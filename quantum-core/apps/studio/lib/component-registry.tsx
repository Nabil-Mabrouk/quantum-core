// apps/studio/lib/component-registry.tsx

import { SmartNode } from '@/components/canvas/smart-node';
import { GenericNode } from '@/components/canvas/generic-node';

// Import des composants spécifiques au domaine
import { EndpointNode } from '@/components/domains/surface_treatment/endpoint-node';
import { WaterPropertiesWidget } from '@/components/domains/surface_treatment/water-properties-widget';
import { NetworkManager } from '@/components/domains/surface_treatment/network-manager';
import { ProcessReport } from '@/components/domains/surface_treatment/process-report';

// Définition des types de slots disponibles pour l'injection
type ComponentMap = {
  nodes: Record<string, React.ComponentType<any>>;      // Composants graphiques (Graphe)
  forms: Record<string, React.ComponentType<any>>;      // Formulaires complets (Propriétés)
  widgets: Record<string, React.ComponentType<any>>;    // Widgets additionnels (Propriétés)
  panels: Record<string, React.ComponentType<any>>;     // Panneaux latéraux (ex: NetworkManager)
  reports: Record<string, React.ComponentType<any>>;    // Rapports (Dashboard)
};

// --- LE REGISTRE ---
const REGISTRY: Record<string, ComponentMap> = {
  // DOMAINE : SURFACE TREATMENT (Mise à jour Chapitre 6)
  SURFACE_TREATMENT: {
    nodes: {
      // Les équipements principaux utilisent le SmartNode spécialisé (Health Bars, etc.)
      PROCESS_BATH: SmartNode,
      RINSE_TANK: SmartNode,
      EVAPORATOR: SmartNode,
      STORAGE_TANK: SmartNode,
      
      // Les terminaux utilisent le visuel spécifique "Pilule"
      DRAIN: EndpointNode,
      SOURCE: EndpointNode
    },
    forms: {
      // Géré dynamiquement par le PropertiesPanel générique via le Manifeste
    },
    widgets: {
      // On utilise le WaterPropertiesWidget pour tout ce qui touche à l'eau et aux flux
      // Ce widget gère à la fois le Bus Projet (Drain/Source) et les Appoints/Surverses (Baths/Rinses)
      PROCESS_BATH: WaterPropertiesWidget,
      RINSE_TANK: WaterPropertiesWidget,
      DRAIN: WaterPropertiesWidget,
      SOURCE: WaterPropertiesWidget,
    },
    panels: {
      // Affiche le gestionnaire de réseaux local quand rien n'est sélectionné
      EMPTY_SELECTION: NetworkManager 
    },
    reports: {
      // Le rapport complet de bilan de masse et ionique
      SUMMARY: ProcessReport
    }
  }
};

// --- HELPERS D'ACCÈS ---

/**
 * Retourne le composant visuel pour le noeud sur le canvas
 */
export function getDomainNode(domain: string, type: string) {
  return REGISTRY[domain]?.nodes[type] || GenericNode; 
}

/**
 * Retourne un formulaire spécifique si défini (prioritaire sur le générique)
 */
export function getDomainForm(domain: string, type: string) {
  return REGISTRY[domain]?.forms[type] || undefined;
}

/**
 * Retourne un widget additionnel à afficher en haut du panneau de propriétés
 */
export function getDomainWidget(domain: string, type: string) {
  return REGISTRY[domain]?.widgets[type] || undefined;
}

/**
 * Retourne un composant pour l'affichage latéral hors sélection (ex: légende, global config)
 */
export function getDomainPanel(domain: string, context: 'EMPTY_SELECTION') {
  return REGISTRY[domain]?.panels[context] || undefined;
}

/**
 * Retourne le composant de rapport final pour le mode "Bilan"
 */
export function getDomainReport(domain: string) {
  return REGISTRY[domain]?.reports['SUMMARY'] || undefined;
}

/**
 * Helper pour React Flow (génère l'objet nodeTypes complet dynamiquement)
 */
export function getFlowNodeTypes(domain: string, defaultTypes: any) {
  const customTypes = REGISTRY[domain]?.nodes || {};
  return { ...defaultTypes, ...customTypes };
}