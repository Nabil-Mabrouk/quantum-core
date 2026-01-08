import { create } from 'zustand';
import { 
  addEdge, applyNodeChanges, applyEdgeChanges,
  Connection, Edge, EdgeChange, NodeChange,
  OnNodesChange, OnEdgesChange, OnConnect
} from '@xyflow/react';
import { getDomainConfig } from '@/lib/registry';
import { 
  createSequenceAction, 
  deleteSequenceAction 
} from '@/app/actions/sequence';

// --- TYPES ---
export type AppNodeData = {
  type: string; 
  label?: string;
  role?: string;
  properties?: Record<string, any>;
};

export type AppNode = any; // Simplifié pour la compatibilité React Flow

export type AppSequence = {
  id: string;
  name: string;
  properties: Record<string, any>;
  steps: string[];
};

interface CanvasState {
  nodes: AppNode[];
  edges: Edge[];
  projectId: string | null;
  lineId: string | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  sequences: AppSequence[];
  selectedSequenceId: string | null;
  
  // Actions d'initialisation (Hydratation)
  setProjectId: (id: string) => void; // <--- RÉPARÉ ICI
  setLineId: (id: string) => void;
  setGraph: (nodes: AppNode[], edges: Edge[]) => void;
  setSequences: (seqs: AppSequence[]) => void;
  
  // Actions Canvas
  addNode: (type: string, position: { x: number, y: number }) => void;
  updateNodeProperties: (nodeId: string, properties: any) => void;
  updateEdgeProperties: (edgeId: string, properties: any) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  // Actions Séquences (Gammes)
  addSequence: (name: string) => Promise<void>;
  updateSequenceMeta: (id: string, data: { name?: string; properties?: any; }) => Promise<void>;
  updateSequenceSteps: (id: string, steps: string[]) => Promise<void>;
  removeSequence: (id: string) => Promise<void>;
  setSelectedSequenceId: (id: string | null) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  projectId: null,
  lineId: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  sequences: [],
  selectedSequenceId: null,

  // --- ACTIONS D'INITIALISATION ---
  setProjectId: (id) => set({ projectId: id }),
  setLineId: (id) => set({ lineId: id }),
  setGraph: (nodes, edges) => set({ nodes, edges }),
  setSequences: (sequences) => set({ sequences }),

  // --- ACTIONS CANVAS ---
  addNode: (type, position) => {
    const config = getDomainConfig();
    const nodeSchema = config.nodeTypes[type];
    
    const initialProps = nodeSchema?.fields?.reduce((acc: any, f: any) => {
      acc[f.id] = f.default;
      return acc;
    }, {}) || {};

    const newNode = {
      id: crypto.randomUUID(),
      type: 'genericNode',
      position,
      data: { 
        type, 
        label: `Nouveau ${nodeSchema?.label || type}`, 
        properties: initialProps,
        role: nodeSchema?.role || 'PROCESS'
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeProperties: (nodeId, props) => {
    set({
      nodes: get().nodes.map(n => 
        n.id === nodeId 
          ? { ...n, data: { ...n.data, properties: { ...(n.data.properties || {}), ...props } } }
          : n
      )
    });
  },

  updateEdgeProperties: (edgeId, props) => {
    set({
      edges: get().edges.map(e => 
        e.id === edgeId ? { ...e, data: { ...(e.data || {}), ...props } } : e
      )
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  onNodesChange: (changes: NodeChange[]) => {
  set(state => {
    // 1. Identify the IDs of nodes that are being removed
    const removedNodeIds = changes
      .filter(c => c.type === 'remove')
      .map(c => c.id);

    let nextEdges = state.edges;
    let nextSequences = state.sequences;

    if (removedNodeIds.length > 0) {
      // 2. Clean up EDGES: Remove orphaned connections
      nextEdges = state.edges.filter(
        edge => !removedNodeIds.includes(edge.source) && !removedNodeIds.includes(edge.target)
      );

      // 3. Clean up SEQUENCES: Remove steps pointing to deleted nodes
      nextSequences = state.sequences.map(seq => ({
        ...seq,
        steps: seq.steps.filter(nodeId => !removedNodeIds.includes(nodeId))
      }));
    }

    // 4. Apply the original changes to the nodes
    const nextNodes = applyNodeChanges(changes, state.nodes) as AppNode[];
    
    // 5. Handle selection state robustly
    let nextSelectedNodeId = state.selectedNodeId;
    const hasSelectionChange = changes.some(c => c.type === 'select');

    if (hasSelectionChange) {
      const newlySelectedNode = nextNodes.find(n => n.selected);
      nextSelectedNodeId = newlySelectedNode ? newlySelectedNode.id : null;
    }

    return { 
      nodes: nextNodes,
      edges: nextEdges,
      sequences: nextSequences,
      selectedNodeId: nextSelectedNodeId,
      // If a node is now selected, deselect any edge
      selectedEdgeId: nextSelectedNodeId ? null : state.selectedEdgeId
    };
  });
},

  onEdgesChange: (changes: EdgeChange[]) => {
    set(state => {
      const nextEdges = applyEdgeChanges(changes, state.edges);

      let nextSelectedEdgeId = state.selectedEdgeId;
      const hasSelectionChange = changes.some(c => c.type === 'select');

      if (hasSelectionChange) {
        const newlySelectedEdge = nextEdges.find(e => e.selected);
        nextSelectedEdgeId = newlySelectedEdge ? newlySelectedEdge.id : null;
      }
      
      return {
        edges: nextEdges,
        selectedEdgeId: nextSelectedEdgeId,
        // If an edge is now selected, deselect any node
        selectedNodeId: nextSelectedEdgeId ? null : state.selectedNodeId
      };
    });
  },

  onConnect: (connection) => {
    const newEdge = { 
        ...connection, 
        id: crypto.randomUUID(), 
        data: { flowRate: 0 } 
    };
    set({ edges: addEdge(newEdge, get().edges) });
  },

  // --- ACTIONS SÉQUENCES ---
  addSequence: async (name) => {
    const lineId = get().lineId;
    if (!lineId) return;
    // On appelle l'action serveur
    const newSeq = await createSequenceAction(lineId, name, { cadence: 10, dragOut: 0.1 });
    // On met à jour l'UI immédiatement
    set({ sequences: [...get().sequences, {
        id: newSeq.id,
        name: newSeq.name,
        properties: newSeq.properties as any,
        steps: []
    }] });
  },

  updateSequenceMeta: async (id, data) => {
    // On peut faire l'update local d'abord pour la fluidité (Optimistic UI)
    set({
        sequences: get().sequences.map(s => s.id === id ? { ...s, ...data } : s)
    });
    // On persiste
    const { updateSequenceMetaAction } = await import('@/app/actions/sequence');
    await updateSequenceMetaAction(id, data);
  },

  updateSequenceSteps: async (id, steps) => {
    set({
        sequences: get().sequences.map(s => s.id === id ? { ...s, steps } : s)
    });
    const { updateSequenceStepsAction } = await import('@/app/actions/sequence');
    await updateSequenceStepsAction(id, steps);
  },

  removeSequence: async (id) => {
    await deleteSequenceAction(id);
    set({ 
        sequences: get().sequences.filter(s => s.id !== id),
        selectedSequenceId: get().selectedSequenceId === id ? null : get().selectedSequenceId
    });
  },

  setSelectedSequenceId: (id) => set({ selectedSequenceId: id }),
}));