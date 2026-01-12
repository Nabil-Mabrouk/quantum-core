import { DomainManifest } from '../domain-config';

export const SURFACE_TREATMENT_CONFIG: DomainManifest = {
  id: "SURFACE_TREATMENT",
  name: "Traitement de Surface (Expert)",
  libraries: [
    { 
      id: 'chemistry', 
      label: 'Chimie', 
      iconName: 'FlaskConical', 
      type: 'COMPOUND', 
      categories: ['ION', 'REAGENT'] 
    },
    { 
      id: 'hardware', 
      label: 'Matériel', 
      iconName: 'Settings2', 
      type: 'SIMPLE', 
      categories: ['PUMP', 'TANK', 'EVAPORATOR', 'SKID'] 
    }
  ],
  nodeTypes: {
    // GROUPE : LIGNE DE PRODUCTION
    PROCESS_BATH: {
      id: "PROCESS_BATH",
      label: "Bain Actif",
      category: "Ligne de Production",
      iconName: "Beaker",
      color: "purple-600",
      description: "Dégraissage, Décapage, Phosphatation...",
      fields: [
        { id: "volume", label: "Volume Utile", type: "quantity", unit: "L", unitFamily: "volume", default: 1000, isSummary: true },
        { id: "temp", label: "Température", type: "quantity", unit: "°C", unitFamily: "temperature", default: 60, isSummary: true },
        { id: "evapAuto", label: "Calcul Évaporation Auto", type: "boolean", default: true },
        { id: "evaporationRate", label: "Taux Évaporation Manuel", type: "quantity", unit: "L/h", unitFamily: "flow", timeProfile: "heating", default: 0 },
        { id: "dragOut", label: "Entraînement (Drag-out)", type: "quantity", unit: "L/h", unitFamily: "flow", timeProfile: "production", default: 10 },
        {
          id: "components",
          label: "Composition Chimique",
          type: "collection",
          default: [],
          schema: [
            { id: "chemId", label: "Produit", type: "library-selector", query: { category: ["REAGENT", "ION"] } },
            { id: "concentration", label: "Concentration Cible", type: "quantity", unit: "g/L", unitFamily: "concentration", default: 0 }
          ]
        }
      ]
    },
    RINSE_TANK: {
      id: "RINSE_TANK",
      label: "Cuve de Rinçage",
      category: "Ligne de Production",
      iconName: "Droplets",
      color: "blue-500",
      fields: [
        { id: "type", label: "Type de Rinçage", type: "select", options: ["CASCADE", "STATIC", "SPRAY"], default: "CASCADE" },
        { id: "volume", label: "Volume", type: "quantity", unit: "L", unitFamily: "volume", default: 1000 },
        { id: "inletFlow", label: "Appoint Eau Neuve", type: "quantity", unit: "L/h", unitFamily: "flow", timeProfile: "production", default: 0 },
        { id: "waterInlet", label: "Source Eau", type: "select", options: ["NONE", "FRESH_WATER"], default: "NONE" },
        { id: "hasSpray", label: "Avec Spray de Sortie ?", type: "boolean", default: false },
        { id: "sprayEfficiency", label: "Efficacité Spray", type: "number", unit: "%", default: 50 },
        { id: "dumpingEvents", label: "Fréquence Vidange", type: "number", unit: "/an", default: 0 }
      ]
    },

    // GROUPE : TRAITEMENT ZLD / STEP
    EVAPORATOR: {
      id: "EVAPORATOR",
      label: "Évaporateur Sous Vide",
      category: "Traitement ZLD",
      iconName: "Flame",
      color: "orange-500",
      fields: [
        { id: "capacity", label: "Capacité Nominale", type: "quantity", unit: "L/h", unitFamily: "flow" },
        { id: "recoveryRate", label: "Taux de Recyclage", type: "number", unit: "%", default: 90 },
        { id: "energy", label: "Conso Électrique", type: "quantity", unit: "kWh", default: 15 },
        { id: "model", label: "Modèle Équipement", type: "library-selector", query: { category: "EVAPORATOR" } }
      ]
    },
    STORAGE_TANK: {
      id: "STORAGE_TANK",
      label: "Stockage Tampon",
      category: "Traitement ZLD",
      iconName: "Cylinder",
      color: "slate-500",
      fields: [
        { id: "volume", label: "Capacité", type: "quantity", unit: "L", unitFamily: "volume" },
        { id: "inletAuto", label: "Appoint Ville Auto (Makeup)", type: "boolean", default: false }
      ]
    },

    // GROUPE : RÉSEAUX
    DRAIN: {
      id: "DRAIN",
      label: "Réseau / Égout",
      category: "Réseaux & Utilités",
      iconName: "Waves",
      color: "emerald-600",
      fields: []
    },
    SOURCE: {
      id: "SOURCE",
      label: "Arrivée Effluent",
      category: "Réseaux & Utilités",
      iconName: "ArrowRight",
      color: "blue-400",
      fields: []
    }
  },
  edgeTypes: {
    PIPE: {
      id: "PIPE",
      label: "Tuyauterie",
      color: "slate-400",
      fields: [
        { id: "type", label: "Type Transfert", type: "select", options: ["OVERFLOW", "PUMP"], default: "OVERFLOW" },
        { id: "flowRate", label: "Débit Forcé (Pompe)", type: "quantity", unit: "L/h", unitFamily: "flow", timeProfile: "production", default: 0 },
        { id: "pumpModel", label: "Modèle Pompe", type: "library-selector", query: { category: "PUMP" } }
      ]
    }
  }
};