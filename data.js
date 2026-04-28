const bogotaCenter = [4.6559, -74.0628];

// Base inicial simulada para demo en Bogotá.
// Inspirada en zonas urbanas reales, pero NO es una base oficial.
const riskZones = [
  {
    id: 1,
    name: "Calle 72 - Zona comercial",
    coords: [4.6585, -74.0615],
    radius: 280,
    baseRisk: 82,
    type: "robo",
    reportsSafe: 3,
    reportsUnsafe: 18,
    description: "Alta congestión peatonal y mayor exposición a hurtos."
  },
  {
    id: 2,
    name: "Carrera 11 - Cruces de tráfico",
    coords: [4.6548, -74.0648],
    radius: 240,
    baseRisk: 62,
    type: "accidente",
    reportsSafe: 6,
    reportsUnsafe: 12,
    description: "Riesgo por cruces, velocidad y flujo vehicular."
  },
  {
    id: 3,
    name: "Zona iluminada Chapinero",
    coords: [4.6528, -74.0598],
    radius: 230,
    baseRisk: 28,
    type: "segura",
    reportsSafe: 21,
    reportsUnsafe: 4,
    description: "Zona con mejor iluminación y percepción de seguridad."
  },
  {
    id: 4,
    name: "Zona universitaria",
    coords: [4.6384, -74.0847],
    radius: 340,
    baseRisk: 55,
    type: "robo",
    reportsSafe: 9,
    reportsUnsafe: 13,
    description: "Alta movilidad estudiantil y riesgo variable por horario."
  },
  {
    id: 5,
    name: "Centro Internacional",
    coords: [4.6147, -74.0705],
    radius: 360,
    baseRisk: 68,
    type: "robo",
    reportsSafe: 7,
    reportsUnsafe: 16,
    description: "Zona de alto flujo laboral y comercial."
  },
  {
    id: 6,
    name: "La Candelaria",
    coords: [4.5981, -74.0758],
    radius: 420,
    baseRisk: 74,
    type: "robo",
    reportsSafe: 5,
    reportsUnsafe: 20,
    description: "Zona turística con variación fuerte entre día y noche."
  },
  {
    id: 7,
    name: "Parque de la 93",
    coords: [4.6769, -74.0486],
    radius: 300,
    baseRisk: 35,
    type: "segura",
    reportsSafe: 23,
    reportsUnsafe: 5,
    description: "Zona con alta presencia comercial y mejor percepción."
  },
  {
    id: 8,
    name: "Zona T",
    coords: [4.6663, -74.0537],
    radius: 320,
    baseRisk: 48,
    type: "robo",
    reportsSafe: 14,
    reportsUnsafe: 10,
    description: "Riesgo aumenta en horarios nocturnos por alta concentración de personas."
  },
  {
    id: 9,
    name: "Portal Norte",
    coords: [4.7541, -74.0465],
    radius: 380,
    baseRisk: 64,
    type: "robo",
    reportsSafe: 8,
    reportsUnsafe: 14,
    description: "Zona de transporte con riesgo por aglomeración."
  },
  {
    id: 10,
    name: "Av. Boyacá",
    coords: [4.6682, -74.1078],
    radius: 420,
    baseRisk: 70,
    type: "accidente",
    reportsSafe: 6,
    reportsUnsafe: 17,
    description: "Riesgo vial alto para motos, carros y ciclistas."
  },
  {
    id: 11,
    name: "Suba - zona residencial",
    coords: [4.7412, -74.0845],
    radius: 420,
    baseRisk: 52,
    type: "robo",
    reportsSafe: 12,
    reportsUnsafe: 11,
    description: "Riesgo medio con variación por hora."
  },
  {
    id: 12,
    name: "Kennedy - corredor comercial",
    coords: [4.6268, -74.1525],
    radius: 450,
    baseRisk: 76,
    type: "robo",
    reportsSafe: 5,
    reportsUnsafe: 22,
    description: "Mayor exposición por comercio y alto flujo peatonal."
  },
  {
    id: 13,
    name: "Bosa",
    coords: [4.6097, -74.1853],
    radius: 450,
    baseRisk: 79,
    type: "robo",
    reportsSafe: 4,
    reportsUnsafe: 23,
    description: "Zona con percepción de riesgo elevada."
  },
  {
    id: 14,
    name: "Usaquén",
    coords: [4.6950, -74.0300],
    radius: 350,
    baseRisk: 38,
    type: "segura",
    reportsSafe: 19,
    reportsUnsafe: 6,
    description: "Zona con riesgo moderado-bajo según contexto."
  },
  {
    id: 15,
    name: "Engativá",
    coords: [4.7059, -74.1072],
    radius: 420,
    baseRisk: 57,
    type: "robo",
    reportsSafe: 10,
    reportsUnsafe: 13,
    description: "Riesgo medio por movilidad barrial y transporte."
  }
];

const routes = {
  fast: {
    name: "Ruta rápida",
    time: 11,
    distance: 2.4,
    coords: [
      [4.6508, -74.0668],
      [4.6532, -74.0648],
      [4.6554, -74.0632],
      [4.6585, -74.0615],
      [4.6614, -74.0596]
    ],
    instructions: [
      "Avanza por la Carrera 13",
      "Gira a la derecha hacia Calle 72",
      "Continúa por zona de alto flujo",
      "Llegas al destino"
    ]
  },

  safe: {
    name: "Ruta segura",
    time: 15,
    distance: 2.9,
    coords: [
      [4.6508, -74.0668],
      [4.6522, -74.0638],
      [4.6528, -74.0598],
      [4.6562, -74.0584],
      [4.6614, -74.0596]
    ],
    instructions: [
      "Toma una vía alterna con menor riesgo",
      "Evita la zona roja de Calle 72",
      "Continúa por corredor más seguro",
      "Llegas al destino"
    ]
  }
};