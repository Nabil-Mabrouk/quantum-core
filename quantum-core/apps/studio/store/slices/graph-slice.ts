import { StateCreator } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { CanvasState, GraphSlice } from '../types';
import { getDomainConfig } from '@/lib/registry';
import { syncSurfaceTreatmentTopology, cleanupSurfaceTreatmentReferences } from '../domains/surface_treatment/topology';

export const createGraphSlice: StateCreator<CanvasState, [], [], GraphSlice> = (set, get) => ({
  nodes: [],
  edges: [],

  setGraph: (nodes, edges) => set({ nodes, edges }),

  addNode: (type, position) => {
    const config = getDomainConfig();
    const nodeSchema = config.nodeTypes[type];
    const initialProps: Record<string, any> = {};
    nodeSchema.groups.flatMap((g: any) => g.fields).forEach((f: any) => {
        if (f.default !== undefined) {
            initialProps[f.id] = f.default;
        }
    });

    const newNode = {
      id: crypto.randomUUID(),
      type,
      position,
      data: { type, label: `Nouveau ${type}`, scope: nodeSchema?.scope || 'PROCESS', properties: initialProps },
      hidden: !get().visibleScopes.includes(nodeSchema?.scope || 'PROCESS')
    };
    set({ nodes: [...get().nodes, newNode], selectedNodeId: newNode.id });
  },

  updateNodeProperties: (nodeId, props) => {
    set((state) => {
      let nextNodes = state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, properties: { ...n.data.properties, ...props } } } : n
      );

      // Branchement logique de domaine (Surface Treatment)
      if (process.env.NEXT_PUBLIC_ACTIVE_DOMAIN === 'SURFACE_TREATMENT') {
        nextNodes = syncSurfaceTreatmentTopology(nodeId, props, nextNodes);
      }

      return { nodes: nextNodes };
    });
  },

  updateNodeLabel: (nodeId, label) => set(state => ({
    nodes: state.nodes.map(n => n.id === nodeId ? { ...n, data: { ...n.data, label } } : n)
  })),

  updateEdgeProperties: (edgeId, props) => set(state => ({
    edges: state.edges.map(e => e.id === edgeId ? { ...e, data: { ...e.data, ...props } } : e)
  })),

  onNodesChange: (changes) => {
    set((state) => {
      let nextNodes = applyNodeChanges(changes, state.nodes);
      const removedIds = changes.filter(c => c.type === 'remove').map(c => c.id);

      if (removedIds.length > 0) {
        if (process.env.NEXT_PUBLIC_ACTIVE_DOMAIN === 'SURFACE_TREATMENT') {
          nextNodes = cleanupSurfaceTreatmentReferences(removedIds, nextNodes);
        }
      }
      return { nodes: nextNodes };
    });
  },

  onEdgesChange: (changes) => set(state => ({ edges: applyEdgeChanges(changes, state.edges) })),
  onConnect: (connection) => set(state => ({
    edges: addEdge({ ...connection, id: crypto.randomUUID(), type: 'default', data: {} }, state.edges)
  })),
  
  applyAutoLayout: () => { 
    // Logique d'auto-layout à importer d'un fichier lib séparé pour la propreté
  }
});