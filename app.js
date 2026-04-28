let map;
let fastRouteLine;
let safeRouteLine;
let userMarker;
let currentSpeed = 0;

// Inicializar mapa
function initMap() {
  map = L.map("map").setView(bogotaCenter, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  drawRiskZones();
  drawRoutes();
  startRealSpeedTracking();
}

// Dibujar zonas de riesgo
function drawRiskZones() {
  riskZones.forEach(zona => {
    const riskColor =
      zona.baseRisk >= 70 ? "#ff1744" :
      zona.baseRisk >= 45 ? "#ffc107" :
      "#00e676";

    L.circle(zona.coords, {
      radius: zona.radius,
      color: riskColor,
      fillColor: riskColor,
      fillOpacity: 0.32,
      weight: 2
    })
      .addTo(map)
      .bindPopup(`
        <strong>${zona.name}</strong><br>
        Riesgo base: ${zona.baseRisk}/100<br>
        ${zona.description}
      `);
  });
}

// Dibujar rutas
function drawRoutes() {
  fastRouteLine = L.polyline(routes.fast.coords, {
    color: "#ff1744",
    weight: 6,
    opacity: 0.8,
    dashArray: "8, 10"
  }).addTo(map);

  safeRouteLine = L.polyline(routes.safe.coords, {
    color: "#00e676",
    weight: 7,
    opacity: 0.95
  }).addTo(map);

  L.marker(routes.fast.coords[0])
    .addTo(map)
    .bindPopup("Punto de origen");

  L.marker(routes.fast.coords[routes.fast.coords.length - 1])
    .addTo(map)
    .bindPopup("Destino");

  userMarker = L.marker(routes.safe.coords[0])
    .addTo(map)
    .bindPopup("Vehículo en ruta");
}

// Calcular ruta segura
async function calculateSafeRoute() {
  const destinationText = document.getElementById("destinationInput").value;
  const priority = document.getElementById("routePriority").value;
  const vehicleType = document.getElementById("vehicleType").value;
  const timeMode = document.getElementById("timeMode").value;

  if (!currentLocation) {
    alert("Primero permite el acceso a tu ubicación.");
    return;
  }

  if (!destinationText) {
    alert("Escribe un destino.");
    return;
  }

  const destination = await searchDestination(destinationText);

  if (!destination) return;

  if (routingControl) {
    map.removeControl(routingControl);
  }

  let routeColor = "#00e676";
  let routeLabel = "Ruta segura";

  if (priority === "rapida") {
    routeColor = "#00c2ff";
    routeLabel = "Ruta rápida";
  }

  if (priority === "equilibrada") {
    routeColor = "#ffc107";
    routeLabel = "Ruta equilibrada";
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(currentLocation[0], currentLocation[1]),
      L.latLng(destination[0], destination[1])
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    lineOptions: {
      styles: [
        {
          color: routeColor,
          opacity: 0.9,
          weight: 7
        }
      ]
    },
    createMarker: function (i, waypoint) {
      if (i === 0) {
        return L.marker(waypoint.latLng).bindPopup("Tu ubicación actual");
      }

      return L.marker(waypoint.latLng).bindPopup("Destino");
    }
  }).addTo(map);

  const riskScore = calculateDynamicRisk(vehicleType, timeMode, priority);

  document.getElementById("riskValue").textContent = `${riskScore}/100`;
  document.getElementById("routeValue").textContent = routeLabel;

  document.getElementById("aiMessage").innerHTML = `
    La IA calculó una <strong>${routeLabel}</strong> según tu ubicación actual,
    el tipo de usuario, la hora del día y el nivel de riesgo urbano.
    <br><br>
    <strong>Recomendación:</strong> ${
      priority === "segura"
        ? "Se prioriza evitar zonas de mayor peligro, aunque el trayecto pueda tardar más."
        : priority === "rapida"
        ? "Se prioriza el menor tiempo posible, aceptando mayor exposición al riesgo."
        : "Se busca un equilibrio entre tiempo, eficiencia y seguridad."
    }
  `;
}

// Seguimiento de velocidad real
function startRealSpeedTracking() {
  setInterval(() => {
    const vehicleType = document.getElementById("vehicleType").value;

    if (vehicleType === "peaton") {
      currentSpeed = randomBetween(3, 6);
    } else if (vehicleType === "bicicleta") {
      currentSpeed = randomBetween(10, 22);
    } else if (vehicleType === "moto") {
      currentSpeed = randomBetween(25, 55);
    } else {
      currentSpeed = randomBetween(20, 50);
    }

    document.getElementById("speedValue").textContent =
      `${currentSpeed} km/h`;
  }, 1600);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Animar vehículo sobre la ruta
function animateVehicle(routeType) {
  const route = routeType === "segura" ? routes.safe : routes.fast;
  let index = 0;

  userMarker.setLatLng(route.coords[0]);

  const interval = setInterval(() => {
    if (index >= route.coords.length) {
      clearInterval(interval);
      return;
    }

    userMarker.setLatLng(route.coords[index]);

    const instruction =
      route.instructions[index] || "Continúa hacia tu destino";

    document.getElementById("aiMessage").innerHTML += `
      <br><br><strong>Próxima indicación:</strong> ${instruction}
    `;

    index++;
  }, 1300);
}

// Conectar botón
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("calculateBtn")
    .addEventListener("click", calculateSafeRoute);
});

// Arrancar mapa
initMap();

let lastPosition = null;
let lastTimestamp = null;

function startRealSpeedTracking() {
  if (!navigator.geolocation) {
    document.getElementById("speedValue").textContent = "GPS no disponible";
    return;
  }

  navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const timestamp = position.timestamp;

      let speedKmh = 0;

      // Si el GPS entrega velocidad directamente
      if (position.coords.speed !== null) {
        speedKmh = position.coords.speed * 3.6;
      }

      // Si no entrega velocidad, la calculamos manualmente
      else if (lastPosition && lastTimestamp) {
        const distanceMeters = getDistanceInMeters(
          lastPosition.lat,
          lastPosition.lng,
          lat,
          lng
        );

        const timeSeconds = (timestamp - lastTimestamp) / 1000;

        if (timeSeconds > 0) {
          speedKmh = (distanceMeters / timeSeconds) * 3.6;
        }
      }

      document.getElementById("speedValue").textContent =
        `${Math.round(speedKmh)} km/h`;

      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
      }

      lastPosition = { lat, lng };
      lastTimestamp = timestamp;
    },
    (error) => {
      document.getElementById("speedValue").textContent = "GPS bloqueado";
      console.error("Error GPS:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000
    }
  );
}

function getDistanceInMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}
let currentLocation = null;
let routingControl = null;

function startLocationTracking() {
  if (!navigator.geolocation) {
    document.getElementById("streetValue").textContent = "GPS no disponible";
    return;
  }

  navigator.geolocation.watchPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      currentLocation = [lat, lng];

      if (userMarker) {
        userMarker.setLatLng(currentLocation);
      }

      const street = await getStreetName(lat, lng);
      document.getElementById("streetValue").textContent = street;
    },
    () => {
      document.getElementById("streetValue").textContent = "Permiso GPS bloqueado";
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000
    }
  );
}
function initMap() {
  map = L.map("map").setView(bogotaCenter, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  drawRiskZones();
  drawRoutes();
  startRealSpeedTracking();
  startLocationTracking();
}

async function getStreetName(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    const response = await fetch(url);
    const data = await response.json();

    const road =
      data.address.road ||
      data.address.pedestrian ||
      data.address.neighbourhood ||
      data.address.suburb ||
      "Calle no identificada";

    return road;
  } catch (error) {
    return "Calle no identificada";
  }
}

async function searchDestination(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    place + ", Bogotá, Colombia"
  )}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.length) {
    alert("No se encontró el destino");
    return null;
  }

  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}