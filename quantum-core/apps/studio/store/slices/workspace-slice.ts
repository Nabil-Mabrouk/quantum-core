import { StateCreator } from 'zustand';
import { CanvasState, WorkspaceSlice } from '../types';

export const createWorkspaceSlice: StateCreator<CanvasState, [], [], WorkspaceSlice> = (set, get) => ({
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
  
  // Injection atomique des résultats de simulation
  setSummaryData: (data) => {
    set((state) => {
      const nextNodes = state.nodes.map((node) => {
        const results = data?.node_details?.[node.id];
        if (results) {
          return {
            ...node,
            data: {
              ...node.data,
              properties: { ...node.data.properties, simulationResults: results },
            },
          };
        }
        return node;
      });
      return { summaryData: data, nodes: nextNodes };
    });
  },

  toggleScopeVisibility: (scope) => {
    const current = get().visibleScopes;
    const next = current.includes(scope) ? current.filter(s => s !== scope) : [...current, scope];
    set({ visibleScopes: next });
    set(state => ({
      nodes: state.nodes.map(node => ({ ...node, hidden: !next.includes(node.data.scope) }))
    }));
  }
});