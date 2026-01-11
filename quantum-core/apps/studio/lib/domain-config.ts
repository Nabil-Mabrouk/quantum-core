import { Beaker, Zap, Boxes, Cylinder, Droplets, Fan, LucideIcon } from 'lucide-react';


export type FieldDefinition = {
  id: string;
  label: string;
  type: 'number' | 'string' | 'boolean' | 'select' | 'quantity'; // Ajout de quantity
  unitFamily?: 'length' | 'flow' | 'temperature' | 'mass'; // Pour les conversions
  unit?: string;
  options?: string[];
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

// Type de bibliothèque
export type LibraryDefinition = {
  id: string;
  label: string;
  iconName: string; // Nom de l'icône Lucide
  type: 'COMPOUND' | 'SIMPLE'; // COMPOUND = A une composition (Chimie), SIMPLE = Juste des props (Pompes)
  categories: string[]; // Les catégories en base de données (ex: ["PUMP", "TANK"] ou ["REAGENT"])
};

export type DomainManifest = {
  id: string;
  name: string;
  libraries: LibraryDefinition[];
  nodeTypes: Record<string, NodeSchema>; // "TANK": { ... }
  edgeTypes: Record<string, EdgeSchema>;
};
