import { LucideIcon } from 'lucide-react';

// --- TYPES DE BASE ---

// Support pour les labels traduisibles : soit une chaîne simple, soit un objet par langue
export type I18nLabel = string | { fr: string; en: string };

// Scopes standards de l'ingénierie (ISA-S88 / P&ID)
// PROCESS: Équipement principal de la ligne (ex: Cuve)
// UTILITY: Réseau support (ex: Eau, Drain, Air)
export type NodeScope = 'PROCESS' | 'UTILITY' | 'INFRASTRUCTURE';

// Définition pour les requêtes vers la bibliothèque (Filtres)
export type LibraryQuery = {
  category: string | string[]; // ex: "REAGENT" ou ["PUMP", "VALVE"]
  matchProperties?: Record<string, any>; 
};

// --- DÉFINITION DES CHAMPS (Méta-Modèle) ---

export type FieldDefinition = 
  // 1. Champ Numérique & Physique (Avec Unités et Profils Temporels)
  | { 
      id: string; 
      label: I18nLabel; 
      type: 'number' | 'quantity'; 
      unit?: string; 
      unitFamily?: 'length' | 'flow' | 'temperature' | 'mass' | 'volume' | 'time' | 'concentration'; 
      default?: number; 
      timeProfile?: 'production' | 'heating' | 'maintenance' | '24/7'; 
      isSummary?: boolean; // Indique si le champ apparaît sur la carte du graphe
    }
  // 2. Champs Texte Simple
  | { 
      id: string; 
      label: I18nLabel; 
      type: 'string'; 
      default?: string; 
      isSummary?: boolean;
    }
  // 3. Champ Booléen (Switch)
  | { 
      id: string; 
      label: I18nLabel; 
      type: 'boolean'; 
      default?: boolean; 
      isSummary?: boolean;
    }
  // 4. Liste Déroulante (Choix Statiques)
  | { 
      id: string; 
      label: I18nLabel; 
      type: 'select'; 
      options: { value: string; label: I18nLabel }[]; 
      default?: string; 
    }
  // 5. Sélecteur de Bibliothèque (Filtres Contextuels)
  | { 
      id: string; 
      label: I18nLabel; 
      type: 'library-selector'; 
      query: LibraryQuery; 
      default?: string; 
    }
  // 6. Sélecteur de Nœud (Liaisons Wireless)
  | { 
      id: string; 
      label: I18nLabel; 
      type: 'node-selector'; 
      filter?: string[]; // Types de nœuds autorisés (ex: ['DRAIN'])
      category?: I18nLabel; // Tag pour le regroupement visuel
    }
  // 7. Collection / Tableau (Support Natif du Nesting / Accessoires)
  | {
      id: string;
      label: I18nLabel;
      type: 'collection';
      schema: FieldDefinition[]; // Définition récursive des colonnes
      default?: any[];
    };

// --- SCHÉMAS D'OBJETS ---

// Définition d'un Noeud (Équipement / Asset)
export type NodeSchema = {
  id: string;           
  label: I18nLabel;        
  category?: I18nLabel;    
  iconName: string;     
  color: string;        
  description?: I18nLabel; 
  scope: NodeScope; // PROCESS (Squelette) ou UTILITY (Périphérique)
  role?: 'SOURCE' | 'SINK' | 'PROCESS'; 
  fields: FieldDefinition[]; 
};

// Définition d'une Arête (Tuyauterie / Câblage)
export type EdgeSchema = {
  id: string;
  label: I18nLabel;
  color: string;
  fields: FieldDefinition[];
};

// Définition d'une Bibliothèque
export type LibraryDefinition = {
  id: string;
  label: I18nLabel;
  iconName: string; 
  type: 'COMPOUND' | 'SIMPLE'; 
  categories: string[]; 
};

// --- MANIFESTE GLOBAL ---

export type DomainManifest = {
  id: string;
  name: I18nLabel;
  libraries: LibraryDefinition[];
  nodeTypes: Record<string, NodeSchema>;
  edgeTypes: Record<string, EdgeSchema>;
};