import { create, StateCreator } from 'zustand';
import { 
  addEdge, applyNodeChanges, applyEdgeChanges,
  Edge, EdgeChange, NodeChange, Node,
  OnNodesChange, OnEdgesChange, OnConnect,
  Connection
} from '@xyflow/react';
import { getDomainConfig } from '@/lib/registry';
import { 
  createSequenceAction, 
  deleteSequenceAction, 
  updateSequenceMetaAction, 
  updateSequenceStepsAction 
} from '@/app/actions/sequence';

// --- DÉFINITION DES TYPES GÉNÉRIQUES ---

export interface NodeProperties {
  [key: string]: any; 
  simulationResults?: Record<string, any>; // Stockage des résultats du moteur Python
}

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
  properties: Record<string, any>;
  steps: string[];
}

// --- STRUCTURE DES SLICES ---

interface WorkspaceSlice {
  projectId: string | null;
  systemId: string | null; 
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  viewMode: 'GRAPH' | 'SYNOPTIC' | 'SUMMARY';
  synopticMode: 'PHYSICAL' | 'SEQUENCE';
  summaryData: any | null; // C'est ici que sont stockés les résultats du AnalysisReport
  
  setProjectId: (id: string) => void;
  setSystemId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setViewMode: (mode: 'GRAPH' | 'SYNOPTIC' | 'SUMMARY') => void;
  setSynopticMode: (mode: 'PHYSICAL' | 'SEQUENCE') => void;
  setSummaryData: (data: any | null) => void;
}

interface GraphSlice {
  nodes: AppNode[];
  edges: Edge[];
  
  setGraph: (nodes: AppNode[], edges: Edge[]) => void;
  addNode: (type: string, position: { x: number, y: number }) => void;
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

// --- IMPLÉMENTATION DES SLICES ---

const createWorkspaceSlice: StateCreator<CanvasState, [], [], WorkspaceSlice> = (set) => ({
  projectId: null,
  systemId: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  viewMode: 'GRAPH',
  synopticMode: 'PHYSICAL',
  summaryData: null,
  setProjectId: (id) => set({ projectId: id }),
  setSystemId: (id) => set({ systemId: id }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSynopticMode: (mode) => set({ synopticMode: mode }),
  setSummaryData: (data) => set({ summaryData: data }),
});

const createGraphSlice: StateCreator<CanvasState, [], [], GraphSlice> = (set, get) => ({
  nodes: [],
  edges: [],
  setGraph: (nodes, edges) => set({ nodes, edges }),

  addNode: (type, position) => {
    const config = getDomainConfig();
    const nodeSchema = config.nodeTypes[type];
    
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
    // 1. Mise à jour Optimiste de l'UI
    set(state => ({
      nodes: state.nodes.map(n => 
        n.id === nodeId 
          ? { ...n, data: { ...n.data, properties: { ...n.data.properties, ...props } } }
          : n
      )
    }));

    // 2. Évaluation rapide (Physique) si nécessaire
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
        const config = getDomainConfig();
        const { evaluateNodeAction } = await import('@/app/actions/simulation');
        const result = await evaluateNodeAction(config.id, node.type!, node.data.properties);
        
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
      let nextNodes = applyNodeChanges(changes, state.nodes) as AppNode[];
      let nextEdges = state.edges;
      let nextSequences = state.sequences;

      const removedNodeIds = changes.filter(c => c.type === 'remove').map(c => c.id);
      
      if (removedNodeIds.length > 0) {
         // Nettoyage en cascade des arêtes et des gammes
         nextEdges = state.edges.filter(edge => !removedNodeIds.includes(edge.source) && !removedNodeIds.includes(edge.target));
         nextSequences = state.sequences.map(seq => ({
            ...seq,
            steps: seq.steps.filter(stepId => !removedNodeIds.includes(stepId))
         }));

         // Nettoyage GÉNÉRIQUE des propriétés (évite les IDs orphelins dans les sélecteurs)
         nextNodes = nextNodes.map(node => {
            const props = node.data.properties || {};
            let isDirty = false;
            const updatedProps = { ...props };

            Object.keys(updatedProps).forEach(key => {
                if (typeof updatedProps[key] === 'string' && removedNodeIds.includes(updatedProps[key])) {
                    updatedProps[key] = null;
                    isDirty = true;
                }
            });
            return isDirty ? { ...node, data: { ...node.data, properties: updatedProps } } : node;
         });
      }

      // Gestion de la sélection mutuellement exclusive (Node OR Edge)
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
        type: 'default', 
        data: {} 
    }, state.edges)
  })),
});

const createSequenceSlice: StateCreator<CanvasState, [], [], SequenceSlice> = (set, get) => ({
  sequences: [],
  selectedSequenceId: null,
  setSequences: (sequences) => set({ sequences }),
  
  addSequence: async (name) => {
    const systemId = get().systemId;
    if (!systemId) return;
    
    const defaultProps = { cadence: 10, dragOut: 0.1 }; 
    const tempId = crypto.randomUUID();
    
    // Ajout optimiste
    set(state => ({ 
        sequences: [...state.sequences, { id: tempId, name, properties: defaultProps, steps: [] }] 
    }));

    try {
        const realSeq = await createSequenceAction(systemId, name, defaultProps);
        set(state => ({
            sequences: state.sequences.map(s => s.id === tempId ? { ...s, id: realSeq.id } : s)
        }));
    } catch (e) {
        set(state => ({ sequences: state.sequences.filter(s => s.id !== tempId) }));
    }
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