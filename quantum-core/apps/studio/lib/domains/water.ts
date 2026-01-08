// apps/studio/lib/domains/water.ts

// PLUS d'imports d'icônes ici ! 
export const WATER_CONFIG = {
  id: "WATER",
  name: "Traitement des Eaux",
  nodeTypes: {
    TANK: {
      id: "TANK",
      label: "Cuve Process",
      iconName: "Beaker", // <--- On utilise une chaîne
      color: "blue-500",
      fields: [
        { id: "volume", label: "Volume", type: "number", unit: "L", default: 1000 },
        { id: "temp", label: "Température", type: "number", unit: "°C", default: 20 }
      ]
    },
    PUMP: {
      id: "PUMP",
      label: "Pompe",
      iconName: "Fan", // <--- On utilise une chaîne
      color: "slate-500",
      fields: [
        { id: "flow", label: "Débit max", type: "number", unit: "m³/h", default: 10 }
      ]
    }
  },
  edgeTypes: {
    PIPE: {
      id: "PIPE",
      label: "Liaison Flux",
      color: "blue-400",
      fields: [
        { id: "flowRate", label: "Débit", type: "number", unit: "m³/h", default: 0 }
      ]
    }
  }
};