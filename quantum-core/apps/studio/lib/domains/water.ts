import { 
  Beaker, 
  Droplets, 
  Wind, 
  Waves, 
  ArrowRight,
  Maximize,
  Thermometer,
  Timer
} from 'lucide-react';
import { DomainManifest } from '../domain-config';



export const WATER_CONFIG = {
  id: "WATER",
  name: "Traitement de Surface (H2O)",
    // --- CONFIGURATION DES LIBRAIRIES ---
  libraries: [
    {
      id: "chemistry",
      label: "Chimie & Réactifs",
      iconName: "FlaskConical",
      type: "COMPOUND",
      categories: ["ION", "REAGENT", "COAGULANT"] // Filtre pour le premier JSON
    },
    {
      id: "hardware",
      label: "Equipements STEP",
      iconName: "Settings2",
      type: "COMPOUND", // On met COMPOUND aussi ici car un SKID a une composition
      categories: ["PUMP", "TANK", "SENSOR", "SKID", "EVAPORATOR"] // Filtre pour le deuxième JSON
    }
  ],
  vocabulary: {
    libraryTitle: "Chimie & Réactifs",
    baseUnitName: "Ions",
    referenceItemName: "Produits Commerciaux",
  },
  nodeTypes: {
    // --- 1. THE MAIN TANK (Smart Node) ---
    TANK: {
      id: "TANK",
      label: "Cuve de Traitement",
      role: "PROCESS",
      iconName: "Beaker",
      color: "blue-600",
      description: "Bain actif, rinçage ou mort",
      fields: [
        // A. IDENTITY & DIMENSIONS
        { id: "type", label: "Fonction", type: "select", options: ["PROCESS", "CLASSIC_RINSE", "STATIC_RINSE"], default: "CLASSIC_RINSE" },
        { id: "volume", label: "Volume Utile", type: "number", default: 1000, unit: "L" },
        { id: "length", label: "Longueur", type: "number", default: 1000, unit: "mm" },
        { id: "width", label: "Largeur", type: "number", default: 800, unit: "mm" },
        
        // B. PHYSICS
        { id: "temp", label: "Température", type: "number", default: 20, unit: "°C" },
        { id: "evapAuto", label: "Évaporation Auto", type: "boolean", default: true },
        { id: "evaporationRate", label: "Taux Évap. Manuel", type: "number", default: 0, unit: "L/h" },

        // C. HYDRAULICS (Inlet)
        { id: "inletAuto", label: "Appoint Eau Auto", type: "boolean", default: true },
        { id: "inletFlow", label: "Débit Eau Neuve", type: "number", default: 0, unit: "L/h" },

        // D. SPRAY (Specific H2O)
        { id: "hasSpray", label: "Activer Spray", type: "boolean", default: false },
        { id: "sprayFlow", label: "Débit Spray", type: "number", default: 0, unit: "L/h" },
        { id: "sprayEfficiency", label: "Efficacité Rinçage", type: "number", default: 50, unit: "%" },

        // E. MAINTENANCE
        { id: "dumpingFrequency", label: "Fréquence Vidange", type: "number", default: 0, unit: "/an" },
      ]
    },

    // --- 2. THE SINK (Network/STEP) ---
    SINK: {
      id: "SINK",
      label: "Réseau / Égout",
      role: "SINK",
      iconName: "Waves",
      color: "emerald-500",
      fields: [
        { id: "allowedFlow", label: "Capacité Max", type: "number", default: 10000, unit: "L/h" }
      ]
    }
  },
  
  edgeTypes: {
    PIPE: {
      id: "PIPE",
      label: "Tuyauterie / Transfert",
      color: "slate-400",
      fields: [
        { id: "flowRate", label: "Débit Forcé (Pompe)", type: "number", default: 0, unit: "L/h" },
        { id: "type", label: "Type", type: "select", options: ["OVERFLOW", "PUMP"], default: "OVERFLOW" }
      ]
    }
  }
};