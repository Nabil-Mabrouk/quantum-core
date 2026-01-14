// apps/studio/lib/domains/surface-treatment.ts

import { DomainManifest } from '../domain-config';

export const SURFACE_TREATMENT_CONFIG: DomainManifest = {
  id: "SURFACE_TREATMENT",
  name: { fr: "Traitement de Surface", en: "Surface Treatment" },
  
  // --- LIBRARIES (Resources) ---
  libraries: [
    { 
      id: 'chemistry', 
      label: { fr: "Chimie & Réactifs", en: "Chemistry & Reagents" }, 
      iconName: 'FlaskConical', 
      type: 'COMPOUND', // Allows recipes (e.g., a Cleaner made of Surfactants + Builders)
      categories: ['ION', 'REAGENT', 'ADDITIVE'] 
    },
    { 
      id: 'hardware', 
      label: { fr: "Catalogue Matériel", en: "Hardware Catalog" }, 
      iconName: 'Settings2', 
      type: 'SIMPLE', 
      categories: ['PUMP', 'TANK', 'HEATER', 'SENSOR', 'RECTIFIER', 'FILTER'] 
    }
  ],

  // --- NODE TYPES (Assets) ---
  nodeTypes: {
    
    // ---------------------------------------------------------
    // 1. PROCESS BATH (Chemical Treatment)
    // ---------------------------------------------------------
    PROCESS_BATH: {
      id: "PROCESS_BATH",
      label: { fr: "Bain Actif", en: "Process Bath" },
      category: { fr: "Ligne de Production", en: "Production Line" },
      scope: "PROCESS",
      iconName: "Beaker",
      color: "purple-600",
      description: { fr: "Cuve de traitement chimique (Dégraissage, Décapage, Dépôt...)", en: "Chemical treatment tank" },
      fields: [
        // --- A. GEOMETRY (For Evaporation Calculation) ---
        { id: "length", label: { fr: "Longueur", en: "Length" }, type: "quantity", unit: "mm", unitFamily: "length", default: 1000 },
        { id: "width", label: { fr: "Largeur", en: "Width" }, type: "quantity", unit: "mm", unitFamily: "length", default: 800 },
        { id: "workingVol", label: { fr: "Volume Utile", en: "Working Vol." }, type: "quantity", unit: "L", unitFamily: "volume", default: 1000, isSummary: true },
        
        // --- B. PHYSICS & OPERATION ---
        { id: "temp", label: { fr: "Température", en: "Temperature" }, type: "quantity", unit: "°C", unitFamily: "temperature", default: 60, isSummary: true },
        { id: "agitation", label: { fr: "Agitation", en: "Agitation" }, type: "select", options: [
            { value: "NONE", label: { fr: "Aucune / Calme", en: "None / Still" } },
            { value: "AIR", label: { fr: "Bullage Air", en: "Air Sparging" } },
            { value: "EDUCTOR", label: { fr: "Buses (Eductors)", en: "Eductors" } },
            { value: "MECHANICAL", label: { fr: "Mécanique (Cathode)", en: "Mechanical" } }
        ], default: "NONE" },
        { id: "heatingProfile", label: { fr: "Profil Chauffage", en: "Heating Profile" }, type: "select", options: [
            { value: "PRODUCTION_ONLY", label: { fr: "Heures Prod. Uniquement", en: "Production Hours Only" } },
            { value: "24_7", label: { fr: "24h/24 (Maintien T°)", en: "24/7 (Temp Maintenance)" } }
        ], default: "PRODUCTION_ONLY" },

        // --- C. CHEMISTRY (The Formulation) ---
        {
          id: "components",
          label: { fr: "Composition Chimique", en: "Chemical Composition" },
          type: "collection",
          schema: [
            { 
              id: "chemId", 
              label: { fr: "Produit", en: "Product" }, 
              type: "library-selector", 
              query: { category: ["REAGENT", "ION", "ADDITIVE"] } 
            },
            { 
              id: "concentration", 
              label: { fr: "Conc. Cible", en: "Target Conc." }, 
              type: "quantity", 
              unit: "g/L", 
              unitFamily: "concentration", 
              default: 0 
            }
          ]
        },

        // --- D. HYDRAULICS (Makeup & Recycling) ---
        { 
            id: "makeupSourceId", 
            label: { fr: "Source Appoint Eau", en: "Water Makeup Source" }, 
            type: "node-selector", 
            // Can be fed by fresh water (SOURCE) or recycled water from a rinse (Counter-flow)
            filter: ["SOURCE", "RINSE_TANK", "EVAPORATOR"], 
            category: { fr: "Entrées", en: "Inlets" } 
        },

        // --- E. WASTE MANAGEMENT ---
        { id: "dumpingFreq", label: { fr: "Fréq. Vidange", en: "Dumping Freq." }, type: "quantity", unit: "/an", default: 2 },
        { 
            id: "dumpingNetworkId", 
            label: { fr: "Réseau Vidange", en: "Drain Network" }, 
            type: "node-selector", 
            filter: ["DRAIN"], 
            category: { fr: "Sorties", en: "Outlets" } 
        },

        // --- F. NESTED EQUIPMENT ---
        {
            id: "accessories",
            label: { fr: "Équipements Embarqués", en: "Accessories" },
            type: "collection",
            schema: [
                { id: "type", label: "Type", type: "select", options: [
                    { value: "HEATER", label: { fr: "Thermoplongeur", en: "Immersion Heater" } },
                    { value: "PUMP", label: { fr: "Pompe Filtre", en: "Filter Pump" } },
                    { value: "SENSOR", label: { fr: "Sonde", en: "Probe" } },
                    { value: "RECTIFIER", label: { fr: "Redresseur", en: "Rectifier" } }
                ]},
                { id: "model", label: { fr: "Modèle", en: "Model" }, type: "library-selector", query: { category: "hardware" } }
            ]
        }
      ]
    },

    // ---------------------------------------------------------
    // 2. RINSE TANK (Hydraulic Cascades)
    // ---------------------------------------------------------
    RINSE_TANK: {
      id: "RINSE_TANK",
      label: { fr: "Cuve de Rinçage", en: "Rinse Tank" },
      category: { fr: "Ligne de Production", en: "Production Line" },
      scope: "PROCESS",
      iconName: "Droplets",
      color: "blue-500",
      description: { fr: "Rinçage par dilution (Mort, Courant ou Cascade)", en: "Dilution rinse (Static, Running or Cascade)" },
      fields: [
        { id: "workingVol", label: { fr: "Volume Utile", en: "Working Vol." }, type: "quantity", unit: "L", unitFamily: "volume", default: 500, isSummary: true },
        
        // --- CONFIGURATION ---
        { id: "rinseMode", label: { fr: "Mode de Rinçage", en: "Rinse Mode" }, type: "select", options: [
            { value: "RUNNING", label: { fr: "Courant (Surverse)", en: "Running (Overflow)" } },
            { value: "DEAD", label: { fr: "Mort (Statique)", en: "Static (Dead)" } },
            { value: "ECO", label: { fr: "Eco (Spray manuel)", en: "Eco (Spray)" } }
        ], default: "RUNNING", isSummary: true },

        // --- HYDRAULICS IN (Water Feed) ---
        { 
          id: "waterSourceId", 
          label: { fr: "Alimentation Eau", en: "Water Feed" }, 
          type: "node-selector", 
          // Crucial for cascades: Can come from SOURCE (Fresh) or RINSE_TANK (Previous tank in counter-flow)
          filter: ["SOURCE", "RINSE_TANK", "EVAPORATOR"], 
          category: { fr: "Hydraulique", en: "Hydraulics" } 
        },
        // Only relevant if feed is NOT another tank (i.e., fresh water injection point)
        { 
          id: "flowRate", 
          label: { fr: "Débit Eau Neuve", en: "Fresh Water Flow" }, 
          type: "quantity", 
          unit: "L/h", 
          unitFamily: "flow", 
          default: 100 
        },

        // --- HYDRAULICS OUT (Overflow / Cascade) ---
        { 
          id: "overflowTargetId", 
          label: { fr: "Surverse vers", en: "Overflows to" }, 
          type: "node-selector", 
          // Can overflow to DRAIN, another RINSE (Cascade), or PROCESS (Compensation)
          filter: ["DRAIN", "RINSE_TANK", "PROCESS_BATH", "STORAGE_TANK"],
          category: { fr: "Hydraulique", en: "Hydraulics" }
        },

        // --- SPRAY OPTION (Dilution Efficiency) ---
        { id: "hasSpray", label: { fr: "Rinçage Spray ?", en: "Has Spray?" }, type: "boolean", default: false },
        { id: "sprayFlowPart", label: { fr: "% Débit vers Spray", en: "% Flow to Spray" }, type: "number", unit: "%", default: 20 },
        
        // --- WASTE ---
        { id: "dumpingFreq", label: { fr: "Fréq. Vidange", en: "Dumping Freq." }, type: "quantity", unit: "/an", default: 4 },
        { id: "dumpingNetworkId", label: { fr: "Réseau Vidange", en: "Drain Network" }, type: "node-selector", filter: ["DRAIN"], category: { fr: "Sorties", en: "Outlets" } }
      ]
    },

    // ---------------------------------------------------------
    // 3. EVAPORATOR (Zero Liquid Discharge)
    // ---------------------------------------------------------
    EVAPORATOR: {
        id: "EVAPORATOR",
        label: { fr: "Évaporateur Sous Vide", en: "Vacuum Evaporator" },
        category: { fr: "Traitement & Recyclage", en: "Treatment & ZLD" },
        scope: "PROCESS",
        iconName: "Flame",
        color: "orange-500",
        fields: [
            { id: "capacity", label: { fr: "Capacité", en: "Capacity" }, type: "quantity", unit: "L/h", unitFamily: "flow", default: 50 },
            { id: "energyType", label: { fr: "Source Énergie", en: "Energy Source" }, type: "select", options: [
                { value: "ELEC", label: { fr: "Électrique (PAC)", en: "Heat Pump" } },
                { value: "STEAM", label: { fr: "Vapeur / Eau Chaude", en: "Steam / Hot Water" } }
            ], default: "ELEC" },
            
            // --- LINKS ---
            { id: "distillateTargetId", label: { fr: "Envoi Distillat (Eau)", en: "Distillate Target" }, type: "node-selector", filter: ["RINSE_TANK", "PROCESS_BATH", "SOURCE"] },
            { id: "concentrateTargetId", label: { fr: "Envoi Concentrât", en: "Concentrate Target" }, type: "node-selector", filter: ["DRAIN", "STORAGE_TANK"] }
        ]
    },

    // ---------------------------------------------------------
    // 4. DRYER (End of Line)
    // ---------------------------------------------------------
    DRYER: {
        id: "DRYER",
        label: { fr: "Étuve de Séchage", en: "Drying Oven" },
        category: { fr: "Ligne de Production", en: "Production Line" },
        scope: "PROCESS",
        iconName: "Wind",
        color: "orange-400",
        fields: [
            { id: "temp", label: "Température", type: "quantity", unit: "°C", default: 100 },
            { id: "power", label: "Puissance", type: "quantity", unit: "kW", default: 10 }
        ]
    },

    // ---------------------------------------------------------
    // 5. UTILITIES (Source & Drain)
    // ---------------------------------------------------------
    SOURCE: {
        id: "SOURCE",
        label: { fr: "Source Eau", en: "Water Source" },
        category: { fr: "Réseaux & Utilités", en: "Utilities" },
        scope: "UTILITY",
        role: "SOURCE",
        iconName: "ArrowRight",
        color: "blue-400",
        fields: [
            { id: "quality", label: { fr: "Qualité Eau", en: "Water Quality" }, type: "select", options: [
                { value: "CITY", label: { fr: "Eau de Ville", en: "City Water" } },
                { value: "SOFT", label: { fr: "Adoucie", en: "Softened" } },
                { value: "OSMOSIS", label: { fr: "Osmosée / Démin.", en: "RO / DI" } },
                { value: "RECYCLED", label: { fr: "Recyclée (STEP)", en: "Recycled (WWTP)" } }
            ], default: "CITY", isSummary: true },
            { id: "pressure", label: { fr: "Pression", en: "Pressure" }, type: "quantity", unit: "bar", default: 3 }
        ]
    },

    DRAIN: {
        id: "DRAIN",
        label: { fr: "Collecteur / Égout", en: "Drain / Collector" },
        category: { fr: "Réseaux & Utilités", en: "Utilities" },
        scope: "UTILITY",
        role: "SINK",
        iconName: "Waves",
        color: "emerald-600",
        fields: [
            { id: "type", label: { fr: "Type Effluent", en: "Effluent Type" }, type: "select", options: [
                { value: "ACID", label: { fr: "Acido-Basique", en: "Acid/Alkali" } },
                { value: "CYANIDE", label: { fr: "Cyanuré", en: "Cyanide" } },
                { value: "CHROME", label: { fr: "Chromique (Cr6)", en: "Chrome (Cr6)" } },
                { value: "COMPLEX", label: { fr: "Complexé / Chelaté", en: "Complexed" } }
            ], default: "ACID", isSummary: true },
            { id: "maxFlow", label: { fr: "Capacité Max", en: "Max Capacity" }, type: "quantity", unit: "L/h", default: 10000 }
        ]
    },

    STORAGE_TANK: {
        id: "STORAGE_TANK",
        label: { fr: "Cuve de Stockage", en: "Storage Tank" },
        category: { fr: "Réseaux & Utilités", en: "Utilities" },
        scope: "INFRASTRUCTURE",
        iconName: "Cylinder",
        color: "slate-500",
        fields: [
            { id: "volume", label: "Volume", type: "quantity", unit: "L", default: 5000, isSummary: true },
            { id: "retention", label: { fr: "Rétention", en: "Bund" }, type: "boolean", default: true }
        ]
    }
  },

  // --- EDGE TYPES (Physical Connections) ---
  // Note: While logical connections (Cascades) are handled via node-selectors,
  // physical pipes can still be drawn to visualize specific pumped transfers.
  edgeTypes: {
    PIPE: {
      id: "PIPE",
      label: { fr: "Tuyauterie", en: "Piping" },
      color: "slate-400",
      fields: [
        { id: "transferMode", label: { fr: "Mode Transfert", en: "Transfer Mode" }, type: "select", options: [
            { value: "GRAVITY", label: { fr: "Gravitaire", en: "Gravity" } },
            { value: "PUMP", label: { fr: "Pompe de Relevage", en: "Lift Pump" } }
        ], default: "GRAVITY" },
        { id: "material", label: { fr: "Matériau", en: "Material" }, type: "select", options: [
            { value: "PVC", label: "PVC" },
            { value: "PP", label: "PP" },
            { value: "PVDF", label: "PVDF" },
            { value: "INOX", label: "Stainless Steel" }
        ], default: "PVC" },
        { id: "diameter", label: { fr: "Diamètre (DN)", en: "Diameter (DN)" }, type: "quantity", unit: "mm", default: 32 }
      ]
    }
  }
};