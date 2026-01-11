import { create, StateCreator } from 'zustand';
import { 
  addEdge, applyNodeChanges, applyEdgeChanges,
  Edge, EdgeChange, NodeChange, Node,
  OnNodesChange, OnEdgesChange, OnConnect,
  Connection
} from '@xyflow/react';
import { getDomainConfig } from '@/lib/registry';
import { createSequenceAction, deleteSequenceAction, updateSequenceMetaAction, updateSequenceStepsAction } from '@/app/actions/sequence';

// --- DEFINITION DES TYPES ---

// Propriétés génériques d'un noeud métier
export interface NodeProperties {
  type?: string;
  label?: string;
  // Champs spécifiques Eau
  volume?: number;
  temp?: number;
  evapAuto?: boolean;
  evaporationRate?: number;
  inletAuto?: boolean;
  inletFlow?: number;
  inletType?: 'CLEAN_WATER' | 'CASCADE';
  
  // Champs spécifiques Logiciel / Connexions
  dumpingNetworkId?: string | null;
  overflowNetworkId?: string | null;
  compensationSourceId?: string | null;
  
  // Résultats de simulation (Non persisté ou optionnel)
  simulationResults?: {
    concentrations?: Record<string, number>;
    warnings?: Array<{ severity: 'CRITICAL'|'WARNING', message: string }>;
    flow?: number;
    evaporation?: number;
    chemicalAddition?: number;
  };

  // Extension libre (JsonB)
  [key: string]: any; 
}

// Structure de données interne de React Flow
export interface AppNodeData extends Record<string, unknown> {
  type: string;
  label: string;
  role: 'PROCESS' | 'SOURCE' | 'SINK';
  properties: NodeProperties;
}

export type AppNode = Node<AppNodeData>;

export interface AppSequence {
  id: string;
  name: string;
  properties: {
    cadence?: number;
    dragOut?: number;
    [key: string]: any;
  };
  steps: string[]; // Liste d'IDs de noeuds
}

// --- SLICES DU STORE ---

interface WorkspaceSlice {
  projectId: string | null;
  lineId: string | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  viewMode: 'GRAPH' | 'SYNOPTIC' | 'SUMMARY';
  summaryData: any | null;
  
  setProjectId: (id: string) => void;
  setLineId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setViewMode: (mode: 'GRAPH' | 'SYNOPTIC' | 'SUMMARY') => void;
  setSummaryData: (data: any | null) => void;
}

interface GraphSlice {
  nodes: AppNode[];
  edges: Edge[];
  
  setGraph: (nodes: AppNode[], edges: Edge[]) => void;
  addNode: (type: string, position: { x: number, y: number }) => void;
  
  // Mise à jour partielle (Patch) des propriétés
  updateNodeProperties: (nodeId: string, properties: Partial<NodeProperties>) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateEdgeProperties: (edgeId: string, properties: any) => void;
  
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

interface SequenceSlice {
  sequences: AppSequence[];
  selectedSequenceId: string | null;
  
  setSequences: (seqs: AppSequence[]) => void;
  addSequence: (name: string) => Promise<void>;
  updateSequenceMeta: (id: string, data: { name?: string; properties?: any }) => Promise<void>;
  updateSequenceSteps: (id: string, steps: string[]) => Promise<void>;
  removeSequence: (id: string) => Promise<void>;
  setSelectedSequenceId: (id: string | null) => void;
}

type CanvasState = WorkspaceSlice & GraphSlice & SequenceSlice;

// --- IMPLEMENTATION ---

const createWorkspaceSlice: StateCreator<CanvasState, [], [], WorkspaceSlice> = (set) => ({
  projectId: null,
  lineId: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  viewMode: 'GRAPH',
  summaryData: null,
  setProjectId: (id) => set({ projectId: id }),
  setLineId: (id) => set({ lineId: id }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSummaryData: (data) => set({ summaryData: data }),
});

const createGraphSlice: StateCreator<CanvasState, [], [], GraphSlice> = (set, get) => ({
  nodes: [],
  edges: [],
  setGraph: (nodes, edges) => set({ nodes, edges }),

  addNode: (type, position) => {
    const config = getDomainConfig();
    const nodeSchema = config.nodeTypes[type];
    
    // Valeurs par défaut depuis le schéma
    const initialProps: NodeProperties = nodeSchema?.fields?.reduce((acc: any, f: any) => {
      acc[f.id] = f.default;
      return acc;
    }, {}) || {};

    const newNode: AppNode = {
      id: crypto.randomUUID(),
      type: type,
      position,
      data: {
        type,
        label: `Nouveau ${nodeSchema?.label || type}`,
        role: (nodeSchema?.role as any) || 'PROCESS',
        properties: initialProps
      },
    };

    set({ 
        nodes: [...get().nodes, newNode], 
        selectedNodeId: newNode.id, 
        selectedEdgeId: null 
    });
  },

  updateNodeProperties: async (nodeId, props) => {
    set(state => ({
      nodes: state.nodes.map(n => 
        n.id === nodeId 
          ? { ...n, data: { ...n.data, properties: { ...n.data.properties, ...props } } }
          : n
      )
    }));

    // Trigger Simulation Locale (Optionnel / Background)
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
        const config = getDomainConfig();
        // Dynamique import pour éviter circular dependency
        const { evaluateNodeAction } = await import('@/app/actions/simulation');
        const result = await evaluateNodeAction(config.id, node.type!, node.data.properties);
        
        // Update avec résultat calculé
        set(state => ({
            nodes: state.nodes.map(n => 
                n.id === nodeId 
                ? { ...n, data: { ...n.data, properties: { ...n.data.properties, computed: result.computed } } }
                : n
            )
        }));
    }
  },

  updateNodeLabel: (nodeId, label) => set(state => ({
    nodes: state.nodes.map(n => n.id === nodeId ? { ...n, data: { ...n.data, label } } : n)
  })),

  updateEdgeProperties: (edgeId, props) => set(state => ({
    edges: state.edges.map(e => 
      e.id === edgeId ? { ...e, data: { ...e.data, ...props } } : e
    )
  })),

  onNodesChange: (changes) => {
    set(state => {
      // 1. Appliquer les changements standard (Move, Select, Remove)
      let nextNodes = applyNodeChanges(changes, state.nodes) as AppNode[];
      let nextEdges = state.edges;
      let nextSequences = state.sequences;

      // 2. Gestion spécifique de la suppression (Nettoyage en cascade)
      const removedNodeIds = changes.filter(c => c.type === 'remove').map(c => c.id);
      if (removedNodeIds.length > 0) {
         // Supprimer les liens connectés
         nextEdges = state.edges.filter(edge => !removedNodeIds.includes(edge.source) && !removedNodeIds.includes(edge.target));
         
         // Nettoyer les séquences
         nextSequences = state.sequences.map(seq => ({
            ...seq,
            steps: seq.steps.filter(stepId => !removedNodeIds.includes(stepId))
         }));

         // Nettoyer les références logiques dans les autres noeuds (ex: overflow vers un noeud supprimé)
         nextNodes = nextNodes.map(node => {
            const p = node.data.properties;
            let dirty = false;
            const newP = { ...p };

            if (removedNodeIds.includes(p.dumpingNetworkId || '')) { newP.dumpingNetworkId = null; dirty = true; }
            if (removedNodeIds.includes(p.overflowNetworkId || '')) { newP.overflowNetworkId = null; dirty = true; }
            if (removedNodeIds.includes(p.compensationSourceId || '')) { newP.compensationSourceId = null; dirty = true; }
            
            return dirty ? { ...node, data: { ...node.data, properties: newP } } : node;
         });
      }

      // 3. Gestion de la sélection
      let nextSelectedNodeId = state.selectedNodeId;
      if (changes.some(c => c.type === 'select')) {
         const newlySelected = nextNodes.find(n => n.selected);
         nextSelectedNodeId = newlySelected ? newlySelected.id : null;
      } else if (removedNodeIds.includes(state.selectedNodeId || '')) {
         nextSelectedNodeId = null;
      }

      return { 
          nodes: nextNodes, 
          edges: nextEdges, 
          sequences: nextSequences, 
          selectedNodeId: nextSelectedNodeId, 
          // Si on sélectionne un noeud, on désélectionne l'arête
          selectedEdgeId: nextSelectedNodeId ? null : state.selectedEdgeId 
      };
    });
  },

  onEdgesChange: (changes) => {
    set(state => {
      const nextEdges = applyEdgeChanges(changes, state.edges);
      
      let nextSelectedEdgeId = state.selectedEdgeId;
      if (changes.some(c => c.type === 'select')) {
         const selectedEdge = nextEdges.find(e => e.selected);
         nextSelectedEdgeId = selectedEdge ? selectedEdge.id : null;
      }

      return { 
          edges: nextEdges, 
          selectedEdgeId: nextSelectedEdgeId,
          selectedNodeId: nextSelectedEdgeId ? null : state.selectedNodeId
      };
    });
  },

  onConnect: (connection: Connection) => set(state => ({
    edges: addEdge({ 
        ...connection, 
        id: crypto.randomUUID(), 
        type: 'default', // ou 'step' selon le style
        data: { flowRate: 0 } 
    }, state.edges)
  })),
});

const createSequenceSlice: StateCreator<CanvasState, [], [], SequenceSlice> = (set, get) => ({
  sequences: [],
  selectedSequenceId: null,
  setSequences: (sequences) => set({ sequences }),
  
  addSequence: async (name) => {
    const lineId = get().lineId;
    if (!lineId) return;
    
    // Optimistic Update
    const tempId = crypto.randomUUID();
    const newSeqStub: AppSequence = { id: tempId, name, properties: { cadence: 10, dragOut: 0.1 }, steps: [] };
    set(state => ({ sequences: [...state.sequences, newSeqStub] }));

    // Server Call
    const realSeq = await createSequenceAction(lineId, name, { cadence: 10, dragOut: 0.1 });
    
    // Replace Stub
    set(state => ({
        sequences: state.sequences.map(s => s.id === tempId ? { ...s, id: realSeq.id } : s)
    }));
  },

  updateSequenceMeta: async (id, data) => {
    set(state => ({
        sequences: state.sequences.map(s => s.id === id ? { ...s, ...data } : s)
    }));
    await updateSequenceMetaAction(id, data);
  },

  updateSequenceSteps: async (id, steps) => {
    set(state => ({
        sequences: state.sequences.map(s => s.id === id ? { ...s, steps } : s)
    }));
    await updateSequenceStepsAction(id, steps);
  },

  removeSequence: async (id) => {
    set(state => ({
        sequences: state.sequences.filter(s => s.id !== id),
        selectedSequenceId: state.selectedSequenceId === id ? null : state.selectedSequenceId
    }));
    await deleteSequenceAction(id);
  },

  setSelectedSequenceId: (id) => set({ selectedSequenceId: id }),
});

export const useCanvasStore = create<CanvasState>()((...a) => ({
  ...createWorkspaceSlice(...a),
  ...createGraphSlice(...a),
  ...createSequenceSlice(...a),
}));