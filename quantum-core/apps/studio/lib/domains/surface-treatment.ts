// apps/studio/lib/domains/surface-treatment.ts

import { DomainManifest, FieldDefinition } from '../domain-config';

const globalEvaporationSettings: FieldDefinition[] = [
    { 
        id: "workshopTemp", 
        label: { fr: "Température Atelier (°C)", en: "Workshop Temp (°C)" }, 
        type: "quantity", 
        unit: "°C", 
        default: 20 
    },
    { 
        id: "evapCoefficient", 
        label: { fr: "Coeff. Évaporation", en: "Evaporation Coeff." }, 
        type: "number", 
        default: 0.02,
        description: "Facteur empirique (L/h/m²/°C) pour calibration." 
    },
    { 
        id: "evapAgitationFactor", 
        label: { fr: "Facteur Agitation", en: "Agitation Factor" }, 
        type: "number", 
        default: 1.5,
        description: "Multiplicateur si agitation par air."
    },
    { 
        id: "evapCoverReductionFactor", 
        label: { fr: "Réduction Couvercle", en: "Cover Reduction Factor" }, 
        type: "number", 
        default: 0.1, // 90% de réduction
        description: "Facteur de réduction si un couvercle est utilisé."
    },
];

export const SURFACE_TREATMENT_CONFIG: DomainManifest = {
  id: "SURFACE_TREATMENT",
  name: { fr: "Traitement de Surface", en: "Surface Treatment" },
  
  globalSettings: globalEvaporationSettings,

  // 🚩 CONFIGURATION UI PILOTÉE PAR LE MANIFESTE
  // On définit ici les outils pertinents pour l'ingénieur procédé.
  ui: {
    enabledViews: ['SYNOPTIC', 'SEQUENCES', 'SUMMARY'], // On cache le mode 'GRAPH' inutile ici
    defaultView: 'SYNOPTIC'
  },

  libraries: [
    { id: 'chemistry', label: { fr: "Ions & Valence", en: "Ions & Valence" }, iconName: 'Atom', type: 'SIMPLE', categories: ['ION'] },
    { id: 'reagents', label: { fr: "Réactifs Purs", en: "Pure Reagents" }, iconName: 'TestTube', type: 'COMPOUND', categories: ['REAGENT'] },
    { id: 'commercial', label: { fr: "Produits Commerciaux", en: "Commercial Products" }, iconName: 'Package', type: 'COMPOUND', categories: ['COMMERCIAL_PRODUCT'] }
  ],

  
    // 🚩 DÉFINITION DES PARAMÈTRES DE GAMME
  sequenceFields: [
    { 
        id: "productionRate", 
        label: { fr: "Cadence (m²/h)", en: "Production Rate (sqm/h)" }, 
        type: "quantity", 
        unit: "m²/h", 
        default: 10 
    },
    { 
        id: "dragOutSpecific", 
        label: { fr: "Entraînement (L/m²)", en: "Specific Drag-out (L/sqm)" }, 
        type: "quantity", 
        unit: "L/m²", 
        default: 0.1 
    },
  ],

  nodeTypes: {
    // --- BAIN DE TRAITEMENT (PROCESS_BATH) ---
    PROCESS_BATH: {
      id: "PROCESS_BATH",
      label: { fr: "Bain de Traitement", en: "Process Bath" },
      scope: "PROCESS",
      iconName: "Beaker",
      color: "purple-600",
      groups: [
        {
          id: "geometry",
          label: { fr: "Dimensions", en: "Dimensions" },
          iconName: "Maximize",
          fields: [
            { id: "length", label: "Longueur (mm)", type: "quantity", unit: "mm", default: 1000 },
            { id: "width", label: "Largeur (mm)", type: "quantity", unit: "mm", default: 800 },
            { id: "height", label: "Hauteur (mm)", type: "quantity", unit: "mm", default: 1000 },
            { id: "workingVol", label: "Volume Utile (L)", type: "quantity", unit: "L", default: 1000, isSummary: true },
            { id: "dumpingFreq", label: "Fréq. Vidange (/an)", type: "quantity", unit: "/an", default: 2 },
            { id: "dumpingNetworkId", label: "Réseau Vidange", type: "node-selector", filter: ["DRAIN"] },
          ]
        },
        {
          id: "evaporation",
          label: { fr: "Évaporation", en: "Evaporation" },
          iconName: "Wind",
          fields: [
            { id: "hasEvaporation", label: "Calculer l'évaporation ?", type: "boolean", default: true },
            { id: "temp", label: "Température Bain (°C)", type: "quantity", unit: "°C", default: 60, isSummary: true },
            { id: "agitation", label: "Type d'Agitation", type: "select", options: [
                { value: "NONE", label: "Calme" },
                { value: "AIR", label: "Air (Intense)" },
                { value: "MECHANICAL", label: "Mécanique" }
            ], default: "NONE" },
            { id: "hasCover", label: "Couvercle présent ?", type: "boolean", default: false },
            { id: "isHeating24h", label: "Chauffage 24h/24", type: "boolean", default: true },
          ]
        },
        {
          id: "compensation",
          label: { fr: "Compensation", en: "Compensation" },
          iconName: "Zap",
          fields: [
            { id: "makeupSourceId", label: "Source d'eau (Complément)", type: "node-selector", filter: ["SOURCE", "RINSE_TANK"] },
            { id: "useSpray", label: "Utiliser un Spray ?", type: "boolean", default: false },
          ]
        },
        {
          id: "chemistry",
          label: { fr: "Chimie", en: "Chemistry" },
          iconName: "FlaskConical",
          fields: [
            { 
              id: "reagents", 
              label: "Mélange Produits Commerciaux", 
              type: "collection", 
              schema: [
                { id: "productId", label: "Produit", type: "library-selector", query: { category: ["COMMERCIAL_PRODUCT"] } },
                { id: "concentration", label: "Consigne (g/L)", type: "quantity", unit: "g/L", default: 50 }
              ]
            }
          ]
        }
      ]
    },

    // --- CUVE DE RINÇAGE (RINSE_TANK) ---
    RINSE_TANK: {
      id: "RINSE_TANK",
      label: { fr: "Cuve de Rinçage", en: "Rinse Tank" },
      scope: "PROCESS",
      iconName: "Droplets",
      color: "blue-500",
      groups: [
        {
          id: "geometry",
          label: { fr: "Dimensions", en: "Dimensions" },
          iconName: "Maximize",
          fields: [
            { id: "workingVol", label: "Volume Utile (L)", type: "quantity", unit: "L", default: 500, isSummary: true },
            { id: "dumpingFreq", label: "Fréq. Vidange (/an)", type: "quantity", unit: "/an", default: 6 },
            { id: "dumpingNetworkId", label: "Réseau Vidange", type: "node-selector", filter: ["DRAIN"] },
          ]
        },
        {
          id: "hydraulics",
          label: { fr: "Hydraulique", en: "Hydraulics" },
          iconName: "Waves",
          fields: [
            { id: "rinseMode", label: "Type", type: "select", options: [
                { value: "RUNNING", label: "Courant (Dilution)" },
                { value: "DEAD", label: "Mort (Statique)" }
            ], default: "RUNNING" },
            { id: "inletSourceId", label: "Entrée d'eau (Dilution)", type: "node-selector", filter: ["SOURCE", "RINSE_TANK"] },
            { id: "manualFlowRate", label: "Débit Dilution (L/h)", type: "quantity", unit: "L/h", default: 100 },
            { id: "overflowTargetId", label: "Surverse vers (Gravité)", type: "node-selector", filter: ["DRAIN", "RINSE_TANK"] }
          ]
        }
      ]
    },

    // --- UTILITIES (SOURCE) ---
    SOURCE: {
      id: "SOURCE",
      label: { fr: "Source Eau", en: "Water Source" },
      scope: "UTILITY",
      iconName: "ArrowRight",
      color: "blue-400",
      groups: [
        {
          id: "main",
          label: { fr: "Général", en: "General" },
          fields: [
            { id: "waterType", label: "Qualité d'eau", type: "select", options: [
                { value: "CITY", label: "Eau de Ville" },
                { value: "RO", label: "Osmosée" },
                { value: "DI", label: "Déminéralisée" }
            ], default: "CITY" }
          ]
        }
      ]
    },

    // --- UTILITIES (DRAIN) ---
    DRAIN: {
      id: "DRAIN",
      label: { fr: "Collecteur Rejet", en: "Drain" },
      scope: "UTILITY",
      iconName: "Waves",
      color: "emerald-600",
      groups: [
        {
          id: "main",
          label: { fr: "Général", en: "General" },
          fields: [
            { id: "networkType", label: "Type", type: "select", options: [
                { value: "ACID_ALKALINE", label: "Acido-Basique" },
                { value: "CYANIDE", label: "Cyanuré" },
                { value: "CHROME", label: "Chromique" }
            ], default: "ACID_ALKALINE" }
          ]
        }
      ]
    }
  },

  edgeTypes: {
    PIPE: {
      id: "PIPE",
      label: { fr: "Tuyauterie", en: "Piping" },
      color: "slate-400",
      groups: [
        {
          id: "main",
          label: "Specs",
          fields: [
            { id: "diameter", label: "Diamètre (DN)", type: "quantity", unit: "mm", default: 32 }
          ]
        }
      ]
    }
  }
};