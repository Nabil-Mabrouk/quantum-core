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

export interface SequenceProperties {
  cadence: number;        // Pièces/heure ou Montages/heure
  surfacePerPart: number; // m² par montage
  dragOutSpecific: number;// L/m² (capacité de rétention de la pièce)
  // Calculé : DragOut (L/h) = cadence * surface * dragOutSpecific
}

export interface NodeProperties {
  [key: string]: any; 
  simulationResults?: Record<string, any>;
  accessories?: any[]; // Nesting : Accessoires embarqués
}

export interface AppNodeData extends Record<string, unknown> {
  type: string;
  label: string;
  scope: 'PROCESS' | 'UTILITY' | 'INFRASTRUCTURE'; 
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
  summaryData: any | null;
  visibleScopes: string[]; 
  
  setProjectId: (id: string) => void;
  setSystemId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setViewMode: (mode: 'GRAPH' | 'SYNOPTIC' | 'SUMMARY') => void;
  setSynopticMode: (mode: 'PHYSICAL' | 'SEQUENCE') => void;
  setSummaryData: (data: any | null) => void;
  toggleScopeVisibility: (scope: string) => void;
}

interface GraphSlice {
  nodes: AppNode[];
  edges: Edge[];
  
  setGraph: (nodes: AppNode[], edges: Edge[]) => void;
  addNode: (type: string, position: { x: number, y: number }) => void;
  updateNodeProperties: (nodeId: string, properties: Partial<NodeProperties>) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateEdgeProperties: (edgeId: string, properties: any) => void;
  
  // NOUVEAU : Réorganisation automatique
  applyAutoLayout: () => void;
  
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

// --- IMPLÉMENTATION ---

const createWorkspaceSlice: StateCreator<CanvasState, [], [], WorkspaceSlice> = (set, get) => ({
  projectId: null,
  systemId: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  viewMode: 'GRAPH',
  synopticMode: 'PHYSICAL',
  summaryData: null,
  visibleScopes: ['PROCESS', 'UTILITY', 'INFRASTRUCTURE'],

  setProjectId: (id) => set({ projectId: id }),
  setSystemId: (id) => set({ systemId: id }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSynopticMode: (mode) => set({ synopticMode: mode }),
  setSummaryData: (data) => set({ summaryData: data }),

  toggleScopeVisibility: (scope) => {
    const current = get().visibleScopes;
    const next = current.includes(scope) 
      ? current.filter(s => s !== scope) 
      : [...current, scope];
    
    set({ visibleScopes: next });
    set(state => ({
      nodes: state.nodes.map(node => ({
        ...node,
        hidden: !next.includes(node.data.scope)
      }))
    }));
  }
});

const createGraphSlice: StateCreator<CanvasState, [], [], GraphSlice> = (set, get) => ({
  nodes: [],
  edges: [],
  setGraph: (nodes, edges) => set({ nodes, edges }),

  // ALGORITHME D'AUTO-LAYOUT INDUSTRIEL AMÉLIORÉ
  applyAutoLayout: () => {
    const { nodes, edges, sequences, selectedSequenceId } = get();
    const config = getDomainConfig();
    const activeSeq = sequences.find(s => s.id === selectedSequenceId);

    // On ne peut organiser que si une gamme est sélectionnée pour l'axe X
    if (!activeSeq) return;

    const SPACING_X = 450; 
    const SPACING_Y = 350; 

    const newNodes = nodes.map(node => {
      const nodeSchema = config.nodeTypes[node.type];
      const scope = node.data.scope || nodeSchema?.scope;
      
      let newX = node.position.x;
      let newY = node.position.y;

      // --- CAS 1 : ÉQUIPEMENTS PROCESS (La ligne centrale) ---
      if (scope === 'PROCESS') {
        const stepIndex = activeSeq.steps.indexOf(node.id);
        if (stepIndex !== -1) {
          newX = stepIndex * SPACING_X;
          newY = 0; // Ligne d'horizon
        }
      } 
      
      // --- CAS 2 : UTILITÉS (Sources en haut, Sinks en bas) ---
      else if (scope === 'UTILITY') {
        // A. Identifier tous les "clients" (noeuds process qui utilisent cette utilité)
        
        // 1. Clients via les propriétés (Wireless)
        const wirelessClients = nodes.filter(n => 
            n.data.properties.dumpingNetworkId === node.id || 
            n.data.properties.overflowTargetId === node.id ||
            n.data.properties.waterSourceId === node.id ||
            n.data.properties.compensationSourceId === node.id ||
            n.data.properties.distillateTargetId === node.id ||
            n.data.properties.concentrateTargetId === node.id
        ).map(n => n.id);

        // 2. Clients via les arêtes physiques (Edges)
        const physicalClients = edges
            .filter(e => e.source === node.id || e.target === node.id)
            .map(e => e.source === node.id ? e.target : e.source);

        // Fusion unique des clients
        const allClients = Array.from(new Set([...wirelessClients, ...physicalClients]));

        // B. Calculer la position X moyenne des clients pour aligner l'utilité
        const clientIndices = allClients
            .map(id => activeSeq.steps.indexOf(id))
            .filter(index => index !== -1);

        if (clientIndices.length > 0) {
            const avgIndex = clientIndices.reduce((a, b) => a + b, 0) / clientIndices.length;
            newX = avgIndex * SPACING_X;
        } else {
            // Si l'utilité n'est liée à rien, on la décale à la fin de la ligne
            newX = activeSeq.steps.length * SPACING_X;
        }

        // C. Positionnement Vertical
        // SOURCE / WATER_MAINS -> En haut (Négatif)
        // DRAIN / SINK -> En bas (Positif)
        const isSource = node.type === 'SOURCE' || node.data.role === 'SOURCE' || node.id.toLowerCase().includes('source');
        newY = isSource ? -SPACING_Y : SPACING_Y;
      }

      return { ...node, position: { x: newX, y: newY } };
    });

    set({ nodes: newNodes });
  },

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
        label: `Nouveau ${type}`,
        scope: nodeSchema?.scope || 'PROCESS',
        properties: initialProps
      },
      hidden: !get().visibleScopes.includes(nodeSchema?.scope || 'PROCESS')
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

    const node = get().nodes.find(n => n.id === nodeId);
    if (node && node.data.properties.temp) {
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
         nextEdges = state.edges.filter(edge => !removedNodeIds.includes(edge.source) && !removedNodeIds.includes(edge.target));
         nextSequences = state.sequences.map(seq => ({
            ...seq,
            steps: seq.steps.filter(stepId => !removedNodeIds.includes(stepId))
         }));

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