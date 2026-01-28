import { LucideIcon } from 'lucide-react';

// --- TYPES DE BASE ---

// Support pour les labels traduisibles : soit une chaîne simple, soit un objet par langue
export type I18nLabel = string | { fr: string; en: string };

// Scopes standards de l'ingénierie (ISA-S88 / P&ID)
// PROCESS: Équipement principal de la ligne (ex: Cuve)
// UTILITY: Réseau support (ex: Eau, Drain, Air)
export type NodeScope = 'PROCESS' | 'UTILITY' | 'INFRASTRUCTURE';

/**
 * MODES DE VUE (Layouts)
 * GRAPH: Éditeur de nœuds libre (type React Flow)
 * SYNOPTIC: Vue verticale/linéaire ordonnée (Process Flow Diagram)
 * SEQUENCES: Gestionnaire de gammes opératoires / séquencement
 * SUMMARY: Bilan technique et rapport final
 */
export type ViewMode = 'GRAPH' | 'SYNOPTIC' | 'SEQUENCES' | 'SUMMARY';

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
      isSummary?: boolean; // Indique si le champ apparaît sur la carte du graphe (SmartNode)
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

// --- NOUVEAU : STRUCTURE DE GROUPEMENT (TABS) ---

/**
 * Représente un groupe de champs qui sera affiché dans un onglet (Tab)
 */
export type FieldGroup = {
  id: string;
  label: I18nLabel;
  iconName?: string; // Nom de l'icône Lucide pour l'onglet
  fields: FieldDefinition[];
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
  scope: NodeScope; 
  role?: 'SOURCE' | 'SINK' | 'PROCESS'; 
  groups: FieldGroup[]; 
};

// Définition d'une Arête (Tuyauterie / Câblage)
export type EdgeSchema = {
  id: string;
  label: I18nLabel;
  color: string;
  groups: FieldGroup[]; 
};

// Définition d'une Bibliothèque
export type LibraryDefinition = {
  id: string;
  label: I18nLabel;
  iconName: string; 
  type: 'COMPOUND' | 'SIMPLE'; 
  categories: string[]; 
};

// --- CONFIGURATION UI (LAYOUTS) ---

/**
 * Définit le comportement de l'interface pour ce domaine particulier
 */
export type UIConfiguration = {
  enabledViews: ViewMode[]; // Liste des vues pertinentes
  defaultView: ViewMode;    // Vue chargée à l'ouverture du projet
};

// --- MANIFESTE GLOBAL ---

export type DomainManifest = {
  id: string;
  name: I18nLabel;
  ui: UIConfiguration; // 🚩 Nouveau : pilotage de l'interface
  libraries: LibraryDefinition[];
  nodeTypes: Record<string, NodeSchema>;
  edgeTypes: Record<string, EdgeSchema>;
  sequenceFields?: FieldDefinition[]; 
};