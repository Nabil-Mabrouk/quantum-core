import { DomainManifest } from '../domain-config';

export const SURFACE_TREATMENT_CONFIG: DomainManifest = {
  id: "SURFACE_TREATMENT",
  name: { fr: "Traitement de Surface", en: "Surface Treatment" },
  
  libraries: [
    { 
      id: 'chemistry', 
      label: { fr: "Chimie & Réactifs", en: "Chemistry & Reagents" }, 
      iconName: 'FlaskConical', 
      type: 'COMPOUND', 
      categories: ['ION', 'REAGENT', 'ADDITIVE'] 
    }
  ],

  nodeTypes: {
    // --- 1. PROCESS BATH (Bain Actif) ---
    PROCESS_BATH: {
      id: "PROCESS_BATH",
      label: { fr: "Bain de Traitement", en: "Process Bath" },
      category: { fr: "Ligne de Production", en: "Production Line" },
      scope: "PROCESS",
      iconName: "Beaker",
      color: "purple-600",
      description: { fr: "Calcul automatique des appoints d'eau et de chimie.", en: "Automatic water and chemical makeup calculation." },
      fields: [
        // 1. GÉOMÉTRIE (Essentiel pour l'évaporation)
        { id: "length", label: "Longueur (mm)", type: "quantity", unit: "mm", unitFamily: "length", default: 1000 },
        { id: "width", label: "Largeur (mm)", type: "quantity", unit: "mm", unitFamily: "length", default: 800 },
        { id: "workingVol", label: "Volume Utile (L)", type: "quantity", unit: "L", unitFamily: "volume", default: 1000, isSummary: true },
        
        // 2. PHYSIQUE
        { id: "temp", label: "Température (°C)", type: "quantity", unit: "°C", unitFamily: "temperature", default: 60, isSummary: true },
        { id: "isHeating24h", label: "Chauffage/Ventil. 24h/24", type: "boolean", default: true },
        { id: "hasCover", label: "Couvercles hors prod", type: "boolean", default: false },
        { id: "agitation", label: "Agitation", type: "select", options: [
            { value: "NONE", label: "Calme" },
            { value: "AIR", label: "Air (Augmente l'évap.)" },
            { value: "MECHANICAL", label: "Mécanique" }
        ], default: "NONE" },

        // 3. AUTOMATISATION
        { id: "hasSpray", label: "Auto-compensation Évap.", type: "boolean", default: true },

        // 4. CHIMIE (La consigne à maintenir)
        { 
          id: "components", 
          label: "Consignes de Concentration", 
          type: "collection", 
          schema: [
            { id: "chemId", label: "Produit", type: "library-selector", query: { category: ["ION", "REAGENT"] } },
            { id: "concentration", label: "Cible (g/L)", type: "quantity", unit: "g/L", default: 50 }
          ]
        },

        // 5. MAINTENANCE
        { id: "dumpingFreq", label: "Fréq. Vidange (/an)", type: "quantity", unit: "/an", default: 2 },
        
        // NOTE: 'spraySourceId' et 'dumpingNetworkId' sont gérés par le Widget, 
        // donc on les retire de cette liste pour éviter les doublons visuels.
      ]
    },

    // --- 2. RINSE TANK (Rinçage) ---
    RINSE_TANK: {
      id: "RINSE_TANK",
      label: { fr: "Cuve de Rinçage", en: "Rinse Tank" },
      category: { fr: "Ligne de Production", en: "Production Line" },
      scope: "PROCESS",
      iconName: "Droplets",
      color: "blue-500",
      fields: [
        { id: "length", label: "Longueur (mm)", type: "quantity", unit: "mm", default: 1000 },
        { id: "width", label: "Largeur (mm)", type: "quantity", unit: "mm", default: 800 },
        { id: "workingVol", label: "Volume Utile (L)", type: "quantity", unit: "L", default: 500, isSummary: true },
        { id: "temp", label: "Température (°C)", type: "quantity", unit: "°C", default: 20 },
        
        // Paramètre hydraulique manuel (si pas de cascade)
        { id: "flowRate", label: "Débit Eau Neuve", type: "quantity", unit: "L/h", default: 100 },
        
        { id: "dumpingFreq", label: "Fréq. Vidange", type: "quantity", unit: "/an", default: 6 },
        
        // waterSourceId, overflowTargetId et dumpingNetworkId gérés par le Widget.
      ]
    },

    // --- 3. UTILITIES ---
    SOURCE: { id: "SOURCE", label: "Source Eau", scope: "UTILITY", iconName: "ArrowRight", color: "blue-400", fields: [] },
    DRAIN: { 
        id: "DRAIN", 
        label: "Collecteur Rejet", 
        scope: "UTILITY", 
        iconName: "Waves", 
        color: "emerald-600", 
        fields: [
            { id: "networkType", label: "Type", type: "select", options: [
                { value: "ACID_ALKALINE", label: "Acido-Basique" },
                { value: "CYANIDE", label: "Cyanuré" },
                { value: "CHROME", label: "Chromique" }
            ], default: "ACID_ALKALINE" }
        ] 
    }
  },

  edgeTypes: {
    PIPE: { id: "PIPE", label: "Tuyauterie", color: "slate-400", fields: [] }
  }
};