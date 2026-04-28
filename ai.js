// Simulación de IA para calcular riesgo dinámico

function calcularRiesgoZona(zona, vehicleType, timeMode) {
  let riesgo = zona.baseRisk;

  // 🔮 Ajuste por hora del día
  if (timeMode === "noche") {
    riesgo += 15; // más peligro de noche
  }

  // 🚗 Ajuste por tipo de usuario
  switch (vehicleType) {
    case "carro":
      if (zona.type === "accidente") riesgo += 10;
      break;

    case "moto":
      if (zona.type === "robo") riesgo += 15;
      if (zona.type === "accidente") riesgo += 10;
      break;

    case "bicicleta":
      if (zona.type === "accidente") riesgo += 15;
      break;

    case "peaton":
      if (zona.type === "robo") riesgo += 20;
      break;
  }

  return Math.min(riesgo, 100);
}


// 🧠 Evaluar una ruta completa según zonas cercanas
function calcularRiesgoRuta(route, vehicleType, timeMode) {
  let riesgoTotal = 0;

  route.coords.forEach(punto => {
    riskZones.forEach(zona => {
      const distancia = calcularDistancia(punto, zona.coords);

      if (distancia < zona.radius / 10000) {
        riesgoTotal += calcularRiesgoZona(zona, vehicleType, timeMode);
      }
    });
  });

  return riesgoTotal / route.coords.length;
}


// 📏 Distancia simple entre puntos (no real, suficiente para demo)
function calcularDistancia(p1, p2) {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return Math.sqrt(dx * dx + dy * dy);
}


// 🏆 Elegir mejor ruta (la magia)
function elegirMejorRuta(vehicleType, timeMode) {
  const riesgoFast = calcularRiesgoRuta(routes.fast, vehicleType, timeMode);
  const riesgoSafe = calcularRiesgoRuta(routes.safe, vehicleType, timeMode);

  if (riesgoSafe < riesgoFast) {
    return {
      recomendada: "segura",
      riesgo: riesgoSafe,
      mensaje: "Ruta segura recomendada 🛡️"
    };
  } else {
    return {
      recomendada: "rapida",
      riesgo: riesgoFast,
      mensaje: "Ruta rápida recomendada ⚡"
    };
  }
}
function calculateDynamicRisk(vehicleType, timeMode, priority) {
  let risk = 45;

  if (timeMode === "noche") risk += 20;

  if (vehicleType === "moto") risk += 15;
  if (vehicleType === "bicicleta") risk += 12;
  if (vehicleType === "peaton") risk += 18;
  if (vehicleType === "carro") risk += 8;

  if (priority === "segura") risk -= 20;
  if (priority === "equilibrada") risk -= 10;
  if (priority === "rapida") risk += 10;

  return Math.max(5, Math.min(100, risk));
}