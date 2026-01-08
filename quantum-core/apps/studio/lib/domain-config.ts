import { Beaker, Zap, Boxes, Cylinder, Droplets, Fan, LucideIcon } from 'lucide-react';


export type FieldDefinition = {
  id: string;
  label: string;
  type: 'number' | 'string' | 'select';
  unit?: string;
  options?: string[]; // Pour les select
  default?: any;
};

// 1. Définition des types (Le Meta-Modèle)
// C'est le contrat que chaque nouveau domaine devra respecter.

export type NodeSchema = {
  id: string;
  label: string;      // Nom affiché (ex: "Cuve", "Batterie")
  icon: LucideIcon;   // Icône visuelle
  color: string;      // Couleur de bordure/header (Tailwind class part)
  description?: string;
  fields: FieldDefinition[];
};

export type EdgeSchema = {
  id: string;
  label: string;
  color: string;
  fields: FieldDefinition[];
};

export type DomainManifest = {
  id: string;
  name: string;
  nodeTypes: Record<string, NodeSchema>; // "TANK": { ... }
  edgeTypes: Record<string, EdgeSchema>;
};

// 2. Configuration Concrète : "WATER" (QuantumH2O)
// C'est ici que vous configurez le métier.

export const WATER_CONFIG: DomainManifest = {
  id: "WATER",
  name: "Traitement de Surface",
  nodeTypes: {
    TANK: {
      id: "TANK",
      label: "Cuve Process",
      icon: Beaker,
      color: "blue-500",
      description: "Bain actif contenant la chimie",
      fields: [
        { id: "volume", label: "Volume", type: "number", unit: "L", default: 1000 },
        { id: "temp", label: "Température", type: "number", unit: "°C", default: 20 },
        { id: "material", label: "Matériau", type: "select", options: ["PP", "Inox", "PVDF"], default: "PP" }
        ]
    },
    PUMP: {
      id: "PUMP",
      label: "Pompe",
      icon: Fan, // Faute de mieux pour l'instant
      color: "slate-500",
      description: "Organe de transfert hydraulique",
      fields: [
        { id: "flow", label: "Débit Nominal", type: "number", unit: "m3/h", default: 10 }
    ]
    },
  },
  edgeTypes: {
    PIPE: {
      id: "PIPE",
      label: "Tuyauterie",
      color: "blue-400",
      fields: [
        { id: "flowRate", label: "Débit circulant", type: "number", unit: "m³/h", default: 0 },
      ]
    }
  }
};

// Helper pour récupérer la config active (Pour l'instant hardcodé sur WATER)
export const currentConfig = WATER_CONFIG;