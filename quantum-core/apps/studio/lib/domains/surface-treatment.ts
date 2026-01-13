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
    // --- GROUPE 1 : LIGNE DE PRODUCTION ---
    PROCESS_BATH: {
      id: "PROCESS_BATH",
      label: "Bain Actif",
      category: "Ligne de Production",
      iconName: "Beaker",
      color: "purple-600",
      description: "Dégraissage, Décapage, Phosphatation...",
      fields: [
        // Physico-chimie
        { id: "volume", label: "Volume Utile", type: "quantity", unit: "L", unitFamily: "volume", default: 1000, isSummary: true },
        { id: "temp", label: "Température", type: "quantity", unit: "°C", unitFamily: "temperature", default: 60, isSummary: true },
        { id: "evapAuto", label: "Calcul Évaporation Auto", type: "boolean", default: true },
        { id: "evaporationRate", label: "Taux Évaporation", type: "quantity", unit: "L/h", unitFamily: "flow", timeProfile: "heating", default: 0, isSummary: true },
        { id: "dragOut", label: "Entraînement", type: "quantity", unit: "L/h", unitFamily: "flow", timeProfile: "production", default: 10 },
        
        // Composition (Collection générique)
        {
          id: "components",
          label: "Composition Chimique",
          type: "collection",
          default: [],
          schema: [
            { id: "chemId", label: "Produit", type: "library-selector", query: { category: ["REAGENT", "ION"] } },
            { id: "concentration", label: "Conc.", type: "quantity", unit: "g/L", unitFamily: "concentration", default: 0 }
          ]
        },

        // Connectivité Wireless (Liaisons par propriétés)
        { id: "dumpingNetworkId", label: "Réseau de Vidange", type: "node-selector", filter: ["DRAIN"] },
        { id: "compensationSourceId", label: "Source d'Appoint (Recyclage)", type: "node-selector", filter: ["RINSE_TANK", "STORAGE_TANK", "SOURCE"] }
      ]
    },

    RINSE_TANK: {
      id: "RINSE_TANK",
      label: "Cuve de Rinçage",
      category: "Ligne de Production",
      iconName: "Droplets",
      color: "blue-500",
      fields: [
        { id: "type", label: "Type", type: "select", options: ["CASCADE", "STATIC", "SPRAY"], default: "CASCADE" },
        { id: "volume", label: "Volume", type: "quantity", unit: "L", unitFamily: "volume", default: 1000, isSummary: true },
        
        // Alimentation Eau
        { id: "inletFlow", label: "Appoint Eau Neuve", type: "quantity", unit: "L/h", unitFamily: "flow", timeProfile: "production", default: 0, isSummary: true },
        { id: "waterSourceId", label: "Source d'Eau alternative", type: "node-selector", filter: ["SOURCE", "STORAGE_TANK", "RINSE_TANK"] },

        // Sorties & Rejets
        { id: "overflowTargetId", label: "Destination Surverse (Cascade)", type: "node-selector", filter: ["RINSE_TANK", "STORAGE_TANK", "DRAIN"] },
        { id: "dumpingNetworkId", label: "Réseau de Vidange", type: "node-selector", filter: ["DRAIN"] },

        // Options avancées
        { id: "hasSpray", label: "Spray de Sortie", type: "boolean", default: false },
        { id: "sprayEfficiency", label: "Efficacité Spray", type: "number", unit: "%", default: 50 },
        { id: "dumpingEvents", label: "Fréquence Vidange", type: "number", unit: "/an", default: 0 }
      ]
    },

    // --- GROUPE 2 : TRAITEMENT ZLD / STEP ---
    EVAPORATOR: {
      id: "EVAPORATOR",
      label: "Évaporateur Sous Vide",
      category: "Traitement ZLD",
      iconName: "Flame",
      color: "orange-500",
      fields: [
        { id: "capacity", label: "Capacité", type: "quantity", unit: "L/h", unitFamily: "flow", default: 50, isSummary: true },
        { id: "recoveryRate", label: "Rendement Distillat", type: "number", unit: "%", default: 90, isSummary: true },
        { id: "energy", label: "Puissance", type: "quantity", unit: "kW", default: 15 },
        
        // Wireless
        { id: "distillateTargetId", label: "Destination Distillat", type: "node-selector", filter: ["STORAGE_TANK", "RINSE_TANK"] },
        { id: "concentrateTargetId", label: "Destination Concentrât", type: "node-selector", filter: ["DRAIN"] },
        
        { id: "model", label: "Référence Catalogue", type: "library-selector", query: { category: "EVAPORATOR" } }
      ]
    },

    STORAGE_TANK: {
      id: "STORAGE_TANK",
      label: "Cuve Tampon",
      category: "Traitement ZLD",
      iconName: "Cylinder",
      color: "slate-500",
      fields: [
        { id: "volume", label: "Capacité Max", type: "quantity", unit: "L", unitFamily: "volume", default: 1000, isSummary: true },
        { id: "inletAuto", label: "Appoint Ville Auto", type: "boolean", default: false, isSummary: true },
        
        // Wireless
        { id: "overflowTargetId", label: "Surverse vers", type: "node-selector", filter: ["DRAIN", "STORAGE_TANK"] },
        { id: "dumpingNetworkId", label: "Vidange vers", type: "node-selector", filter: ["DRAIN"] }
      ]
    },

    // --- GROUPE 3 : RÉSEAUX & UTILITAIRES ---
    DRAIN: {
      id: "DRAIN",
      label: "Réseau / Égout",
      category: "Réseaux & Utilités",
      iconName: "Waves",
      color: "emerald-600",
      fields: [
        { id: "allowedFlow", label: "Capacité Réseau", type: "quantity", unit: "L/h", unitFamily: "flow" }
      ]
    },
    SOURCE: {
      id: "SOURCE",
      label: "Arrivée Eau / Fluide",
      category: "Réseaux & Utilités",
      iconName: "ArrowRight",
      color: "blue-400",
      fields: [
        { id: "availableFlow", label: "Débit Max Dispo", type: "quantity", unit: "L/h", unitFamily: "flow" }
      ]
    }
  },
  edgeTypes: {
    PIPE: {
      id: "PIPE",
      label: "Tuyauterie Physique",
      color: "slate-400",
      fields: [
        { id: "type", label: "Type", type: "select", options: ["OVERFLOW", "PUMP"], default: "OVERFLOW" },
        { id: "flowRate", label: "Débit Forcé", type: "quantity", unit: "L/h", unitFamily: "flow", timeProfile: "production", default: 0 },
        { id: "pumpModel", label: "Modèle Pompe", type: "library-selector", query: { category: "PUMP" } }
      ]
    }
  }
};