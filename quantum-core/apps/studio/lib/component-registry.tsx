import { SmartNode } from '@/components/canvas/smart-node';
import { GenericNode } from '@/components/canvas/generic-node';

// Import des composants spécifiques au domaine (Renommés et déplacés)
import { EndpointNode } from '@/components/domains/surface_treatment/endpoint-node';
import { StreamConnectionWidget } from '@/components/domains/surface_treatment/stream-connection-widget';
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
  // DOMAINE UNIQUE : SURFACE TREATMENT (Nettoyé)
  SURFACE_TREATMENT: {
    nodes: {
      // Les équipements principaux utilisent le SmartNode générique (Cartes Riches)
      PROCESS_BATH: SmartNode,
      RINSE_TANK: SmartNode,
      EVAPORATOR: SmartNode,
      STORAGE_TANK: SmartNode,
      
      // Les terminaux utilisent le visuel spécifique "Pilule"
      DRAIN: EndpointNode,
      SOURCE: EndpointNode
    },
    forms: {
      // Plus besoin de formulaires spécifiques ! 
      // Le PropertiesPanel générique gère maintenant les Collections (Chimie) nativement.
    },
    widgets: {
      // Widget pour connecter les flux globaux (Bus Projet)
      PROCESS_BATH: StreamConnectionWidget,
      RINSE_TANK: StreamConnectionWidget,
      DRAIN: StreamConnectionWidget,
      SOURCE: StreamConnectionWidget,
    },
    panels: {
      // Affiche la liste des réseaux quand on clique dans le vide
      EMPTY_SELECTION: NetworkManager 
    },
    reports: {
      SUMMARY: ProcessReport
    }
  }
};

// --- HELPERS D'ACCÈS ---

export function getDomainNode(domain: string, type: string) {
  // Si pas de composant spécifique, on renvoie GenericNode par défaut
  return REGISTRY[domain]?.nodes[type] || GenericNode; 
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