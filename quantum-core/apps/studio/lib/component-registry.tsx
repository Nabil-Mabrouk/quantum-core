import { WaterNode } from '@/components/domains/water/water-node';
import { WaterEndpointNode } from '@/components/domains/water/water-endpoint-node';
import { WaterTankForm } from '@/components/domains/water/water-tank-form';
import { WaterPropertiesWidget } from '@/components/domains/water/water-properties-widget';
import { NetworkListManager } from '@/components/domains/water/network-list-manager';
import { AnalysisReport } from '@/components/domains/water/analysis-report';

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
  // CONFIGURATION POUR LE DOMAINE "WATER"
  WATER: {
    nodes: {
      TANK: WaterNode,
      SINK: WaterEndpointNode,
      SOURCE: WaterEndpointNode,
      WATER_MAINS: WaterEndpointNode,
    },
    forms: {
      TANK: WaterTankForm, // Remplace le formulaire générique pour les Tanks
    },
    widgets: {
      TANK: WaterPropertiesWidget, // S'ajoute en plus du formulaire
      SINK: WaterPropertiesWidget,    
      SOURCE: WaterPropertiesWidget,
    },
    panels: {
      EMPTY_SELECTION: NetworkListManager, // S'affiche quand rien n'est sélectionné
    },
    reports: {
      SUMMARY: AnalysisReport
    }
  },
  
  // CONFIGURATION POUR LE DOMAINE "ENERGY" (Exemple futur)
  ENERGY: {
    nodes: {}, // Utiliserait des composants électriques
    forms: {},
    widgets: {},
    panels: {},
    reports: {}
  }
};

// --- HELPERS D'ACCÈS ---

export function getDomainNode(domain: string, type: string) {
  return REGISTRY[domain]?.nodes[type] || undefined; // Renvoie undefined pour utiliser le GenericNode
}

export function getDomainForm(domain: string, type: string) {
  return REGISTRY[domain]?.forms[type] || undefined;
}

export function getDomainWidget(domain: string, type: string) {
  return REGISTRY[domain]?.widgets[type] || undefined;
}

export function getDomainPanel(domain: string, context: 'EMPTY_SELECTION') {
  return REGISTRY[domain]?.panels[context] || undefined;
}

export function getDomainReport(domain: string) {
  return REGISTRY[domain]?.reports['SUMMARY'] || undefined;
}

// Helper pour React Flow (génère l'objet nodeTypes complet)
export function getFlowNodeTypes(domain: string, defaultTypes: any) {
  const customTypes = REGISTRY[domain]?.nodes || {};
  return { ...defaultTypes, ...customTypes };
}