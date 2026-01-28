import { StateCreator } from 'zustand';
import { CanvasState, SequenceSlice } from '../types';
import { createSequenceAction, deleteSequenceAction, updateSequenceMetaAction, updateSequenceStepsAction } from '@/app/actions/sequence';

export const createSequenceSlice: StateCreator<CanvasState, [], [], SequenceSlice> = (set, get) => ({
  sequences: [],
  selectedSequenceId: null,

  setSequences: (sequences) => set({ sequences }),

  addSequence: async (name) => {
    const { systemId } = get();
    if (!systemId) return;
    const tempId = crypto.randomUUID();
    const defaultProps = { productionRate: 10, dragOutSpecific: 0.1 };

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