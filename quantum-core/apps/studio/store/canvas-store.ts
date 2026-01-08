import { create } from 'zustand';
import { 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  Connection, 
  Edge, 
  EdgeChange, 
  Node, 
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from '@xyflow/react';
import { currentConfig } from '@/lib/domain-config';
// 1. Mise à jour du type pour inclure les propriétés dynamiques
export type AppNodeData = {
  type: string; 
  label?: string;
  properties?: Record<string, any>; // Ajouté pour le Sprint 4
};

export type AppNode = Node<AppNodeData>;

interface CanvasState {
  nodes: AppNode[];
  edges: Edge[];
  projectId: string | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null; // NOUVEAU
  setSelectedEdgeId: (id: string | null) => void;
  updateEdgeProperties: (edgeId: string, properties: any) => void;
  setProjectId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeProperties: (nodeId: string, properties: any) => void;
  setGraph: (nodes: AppNode[], edges: Edge[]) => void;
  
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  addNode: (type: string, position: { x: number, y: number }) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  projectId: null,
  selectedNodeId: null,
  selectedEdgeId: null,

  setProjectId: (id) => set({ projectId: id }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }), // On déselectionne le noeud

  updateEdgeProperties: (edgeId, props) => {
    set({
      edges: get().edges.map(e => 
        e.id === edgeId 
          ? { ...e, data: { ...(e.data || {}), ...props } }
          : e
      )
    });
  },
  updateNodeProperties: (nodeId, props) => {
    set({
      nodes: get().nodes.map(n => 
        n.id === nodeId 
          ? { 
              ...n, 
              data: { 
                ...n.data, 
                properties: { ...(n.data.properties || {}), ...props } 
              } 
            }
          : n
      )
    });
  },

  setGraph: (nodes, edges) => {
    set({ nodes, edges });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set(state => {
      const newState: Partial<Pick<CanvasState, 'nodes' | 'selectedNodeId'>> = {
        nodes: applyNodeChanges(changes, state.nodes) as AppNode[],
      };

      const selectionChange = changes.find(
        (change) => change.type === 'select' && change.selected === true
      );
      
      const deselectionChange = changes.find(
        (change) => change.type === 'select' && change.selected === false
      );

      if (selectionChange) {
        newState.selectedNodeId = (selectionChange as any).id;
      } else if (deselectionChange) {
        newState.selectedNodeId = null;
      }
      
      return newState;
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set(state => {
      const newState: Partial<Pick<CanvasState, 'edges' | 'selectedEdgeId' | 'selectedNodeId'>> = {
        edges: applyEdgeChanges(changes, state.edges),
      };

      const selectionChange = changes.find(
        (change) => change.type === 'select' && change.selected === true
      );
      
      const deselectionChange = changes.find(
        (change) => change.type === 'select' && change.selected === false
      );

      if (selectionChange) {
        newState.selectedEdgeId = (selectionChange as any).id;
        newState.selectedNodeId = null; // Deselect any selected node
      } else if (deselectionChange) {
        newState.selectedEdgeId = null;
      }
      
      return newState;
    });
  },

  onConnect: (connection) => {
    const newEdge = {
        ...connection,
        id: crypto.randomUUID(),
        type: 'default',
        data: { flowRate: 0 } // Initialisation du débit
    };
    set({ edges: addEdge(newEdge, get().edges) });
  },

  addNode: (type, position) => {

    const nodeSchema = currentConfig.nodeTypes[type];

    let initialProperties = {};
    if (nodeSchema) {
      initialProperties = nodeSchema.fields.reduce((acc, field) => {
        if (field.default !== undefined) {
          acc[field.id] = field.default;
        }
        return acc;
      }, {});
    }

    const newNode: AppNode = {
      id: crypto.randomUUID(),
      type: 'genericNode',
      position,
      data: { 
        type, 
        label: `Nouveau ${type}`,
        properties: initialProperties
      },
    };

    set({ nodes: [...get().nodes, newNode] });
  },
}));