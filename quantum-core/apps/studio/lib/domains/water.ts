export const WATER_CONFIG = {
  id: "WATER",
  name: "Traitement des Eaux",
  vocabulary: {
    libraryTitle: "Gestion des Réactifs & Articles",
    baseUnitName: "Ions",
    baseUnitDescription: "Unités chimiques de base",
    referenceItemName: "Produits Commerciaux",
    referenceItemDescription: "Articles packagés et réactifs",
  },
  nodeTypes: {
    // --- SOURCES ---
    WATER_MAINS: {
      id: "WATER_MAINS",
      role: "SOURCE",
      label: "Arrivée d'eau propre",
      iconName: "Droplets",
      color: "blue-400",
      fields: [{ id: "flowCapacity", label: "Capacité max", type: "number", unit: "L/h", default: 5000 }]
    },
    CHEMICAL_STATION: {
      id: "CHEMICAL_STATION",
      role: "SOURCE",
      label: "Poste de dosage",
      iconName: "FlaskConical",
      color: "purple-400",
      fields: []
    },
    // --- PROCESS ---
    TANK: {
      id: "TANK",
      role: "PROCESS",
      label: "Bain Process",
      iconName: "Beaker",
      color: "purple-600",
      fields: [
        { id: "volume", label: "Volume utile", type: "number", unit: "L", default: 1000 },
        { id: "temp", label: "Température", type: "number", unit: "°C", default: 20 }
      ]
    },
    // --- SINKS ---
    STEP_COLLECTOR: {
      id: "STEP_COLLECTOR",
      role: "SINK",
      label: "Collecteur STEP",
      iconName: "Waves",
      color: "emerald-500",
      fields: []
    }
  },
  edgeTypes: {
    PIPE: { id: "PIPE", label: "Liaison Flux", color: "blue-400", fields: [{ id: "flowRate", label: "Débit", type: "number", unit: "L/h" }] }
  }
};