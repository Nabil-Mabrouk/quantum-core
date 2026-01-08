'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Layers, Plus, Trash2, ArrowRight, PlayCircle } from 'lucide-react';
import { useState } from 'react';

export function SequenceManager() {
  const { 
    nodes, 
    sequences, 
    addSequence, 
    updateSequenceMeta, 
    updateSequenceSteps, 
    removeSequence, 
    selectedSequenceId, 
    setSelectedSequenceId 
  } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeSeq = sequences.find(s => s.id === selectedSequenceId);

  const addStep = (nodeId: string) => {
    if (!activeSeq || !nodeId) return;
    const newSteps = [...activeSeq.steps, nodeId];
    updateSequenceSteps(activeSeq.id, newSteps);
  };

  const removeStep = (indexToRemove: number) => {
    if (!activeSeq) return;
    const newSteps = activeSeq.steps.filter((_, i) => i !== indexToRemove);
    updateSequenceSteps(activeSeq.id, newSteps);
  };

  return (
    <div className={`fixed bottom-0 left-64 right-80 bg-white border-t border-slate-200 transition-all duration-500 z-40 ${isOpen ? 'h-64' : 'h-10'}`}>
      {/* Barre de titre / Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 flex items-center justify-between px-6 cursor-pointer hover:bg-slate-50 border-b border-slate-100"
      >
        <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Gestion des Gammes de Production</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[9px] font-bold">{sequences.length}</span>
        </div>
        <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isOpen ? 'Réduire' : 'Ouvrir'}</button>
      </div>

      {isOpen && (
        <div className="flex h-54 divide-x divide-slate-100">
          {/* Liste des Gammes */}
          <div className="w-64 p-4 overflow-y-auto space-y-2">
            <button 
                onClick={() => addSequence(`Gamme ${sequences.length + 1}`)}
                className="w-full p-2 border-2 border-dashed border-slate-200 rounded-xl text-[9px] font-bold text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all"
            >
                + NOUVELLE GAMME
            </button>
            {sequences.map(s => (
              <div 
                key={s.id} 
                onClick={() => setSelectedSequenceId(s.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${selectedSequenceId === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white'}`}
              >
                <span className="text-xs font-bold truncate">{s.name}</span>
                <div className="flex items-center gap-2">
                    {selectedSequenceId === s.id && <PlayCircle className="w-4 h-4" />}
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeSequence(s.id); }}
                      className={`p-1 rounded-full ${selectedSequenceId === s.id ? 'hover:bg-blue-500' : 'hover:bg-slate-200'}`}
                    >
                      <Trash2 className={`w-3 h-3 ${selectedSequenceId === s.id ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                </div>
              </div>
            ))}
          </div>

                     {/* Constructeur de Séquence */}
                    <div className="flex-1 p-6 overflow-x-auto">
                      {activeSeq ? (
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                              <input 
                                  className="text-lg font-black bg-transparent outline-none border-b-2 border-transparent focus:border-blue-200"
                                  value={activeSeq.name}
                                  onChange={(e) => updateSequenceMeta(activeSeq.id, { name: e.target.value })}
                              />
                              <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-lg border">
                                  {/* Cadence */}
                                  <div className="flex items-center gap-2 p-1">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase px-2">Cadence:</span>
                                      <input type="number" className="w-16 bg-white border rounded px-1 text-xs font-bold" value={activeSeq.properties.cadence} onChange={e => updateSequenceMeta(activeSeq.id, { properties: { ...activeSeq.properties, cadence: parseFloat(e.target.value) } })} />
                                      <span className="text-[9px] font-bold text-slate-400">m²/h</span>
                                  </div>
                                  <div className="h-6 border-l border-slate-200" />
                                  {/* Entraînement / Drag-out */}
                                  <div className="flex items-center gap-2 p-1">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase px-2">Entraînement:</span>
                                      <input type="number" step="0.01" className="w-16 bg-white border rounded px-1 text-xs font-bold" value={activeSeq.properties.dragOut} onChange={e => updateSequenceMeta(activeSeq.id, { properties: { ...activeSeq.properties, dragOut: parseFloat(e.target.value) } })} />
                                      <span className="text-[9px] font-bold text-slate-400">L/m²</span>
                                  </div>
                              </div>
                          </div>
          
                          <div className="flex items-center gap-3">                  {activeSeq.steps.map((stepId, idx) => {
                    const node = nodes.find(n => n.id === stepId);
                    return (
                      <div key={idx} className="flex items-center gap-3 group">
                        <div className="bg-white border-2 border-blue-500 p-3 rounded-2xl shadow-md min-w-[100px] relative">
                           <p className="text-[8px] font-black text-blue-500 uppercase mb-1">Étape {idx + 1}</p>
                           <p className="text-xs font-bold text-slate-800 truncate">{node?.data.label || 'Node supprimé'}</p>
                           <button 
                             onClick={() => removeStep(idx)}
                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <Trash2 className="w-3 h-3" />
                           </button>
                        </div>
                        {idx < activeSeq.steps.length - 1 && <ArrowRight className="w-4 h-4 text-slate-300" />}
                      </div>
                    );
                  })}
                  
                  {/* Sélecteur pour ajouter une étape */}
                  <select 
                    className="ml-4 p-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-bold text-slate-400 outline-none hover:border-blue-400 transition-all bg-transparent"
                    onChange={(e) => addStep(e.target.value)}
                    value=""
                  >
                    <option value="">+ AJOUTER ÉTAPE</option>
                    {nodes.filter(n => n.data.role === "PROCESS").map(n => (
                        <option key={n.id} value={n.id}>{n.data.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
                Sélectionnez une gamme pour éditer le cheminement des pièces.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
