import { LucideIcon } from 'lucide-react';

// Définition pour les requêtes vers la bibliothèque (Filtres)
export type LibraryQuery = {
  category: string | string[]; // ex: "REAGENT" ou ["PUMP", "VALVE"]
  matchProperties?: Record<string, any>; 
};

// Définition des types de champs via une Union Discriminée
export type FieldDefinition = 
  // 1. Champ Numérique & Physique (Avec Unités et Profils Temporels)
  | { 
      id: string; 
      label: string; 
      // 'quantity' active le sélecteur d'unité côté UI, 'number' est brut
      type: 'number' | 'quantity'; 
      unit?: string; 
      // Famille pour les conversions auto (ex: mm -> m)
      unitFamily?: 'length' | 'flow' | 'temperature' | 'mass' | 'volume' | 'time' | 'concentration'; 
      default?: number; 
      // Indique si ce champ dépend d'un profil temporel
      timeProfile?: 'production' | 'heating' | 'maintenance' | '24/7'; 
      isSummary?: boolean; 
    }
  // 2. Champs Texte Simple
  | { 
      id: string; 
      label: string; 
      type: 'string'; 
      default?: string; 
    }
  // 3. Champ Booléen (Switch)
  | { 
      id: string; 
      label: string; 
      type: 'boolean'; 
      default?: boolean; 
    }
  // 4. Liste Déroulante (Choix Statiques)
  | { 
      id: string; 
      label: string; 
      type: 'select'; 
      options: string[]; 
      default?: string; 
    }
  // 5. Sélecteur de Bibliothèque (Filtres Contextuels)
  | { 
      id: string; 
      label: string; 
      type: 'library-selector'; 
      query: LibraryQuery; 
      default?: string; 
    }
  // NOUVEAU: Sélecteur de Nœud
  | { 
      id: string; 
      label: string; 
      type: 'node-selector'; 
      filter?: string[]; // Tableau de types de nœuds autorisés (ex: ['DRAIN', 'TANK'])
      category?: string; // Tag pour le regroupement visuel (ex: Inlet, Outlet, Utility)
    }
  // 6. Collection / Tableau (Support Natif)
  | {
      id: string;
      label: string;
      type: 'collection';
      schema: FieldDefinition[]; // Récursif
      default?: any[];
    };

// Définition d'un Noeud (Équipement)
export type NodeSchema = {
  id: string;           
  label: string;        
  // NOUVEAU CHAMP POUR LA PALETTE
  category?: string;    
  iconName: string;     
  color: string;        
  description?: string; 
  role?: 'SOURCE' | 'SINK' | 'PROCESS'; 
  fields: FieldDefinition[]; 
};

// Définition d'une Arête (Tuyau/Câble)
export type EdgeSchema = {
  id: string;
  label: string;
  color: string;
  fields: FieldDefinition[];
};

// Définition d'une Bibliothèque
export type LibraryDefinition = {
  id: string;
  label: string;
  iconName: string; 
  type: 'COMPOUND' | 'SIMPLE'; 
  categories: string[]; 
};

// Le Manifeste Complet du Domaine
export type DomainManifest = {
  id: string;
  name: string;
  libraries: LibraryDefinition[];
  nodeTypes: Record<string, NodeSchema>;
  edgeTypes: Record<string, EdgeSchema>;
};