import { create } from 'zustand';
import { CanvasState } from './types';
import { createWorkspaceSlice } from './slices/workspace-slice';
import { createGraphSlice } from './slices/graph-slice';
import { createSequenceSlice } from './slices/sequence-slice';

export const useCanvasStore = create<CanvasState>()((...a) => ({
  ...createWorkspaceSlice(...a),
  ...createGraphSlice(...a),
  ...createSequenceSlice(...a),
}));

export * from './types';