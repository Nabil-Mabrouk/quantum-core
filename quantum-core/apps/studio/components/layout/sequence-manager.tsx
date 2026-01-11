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
    <div className={`fixed bottom-0 left-64 right-80 bg-white border-t border-slate-200 transition-all duration-300 z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] ${isOpen ? 'h-96' : 'h-10'}`}>
      
      {/* Barre de titre */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 flex items-center justify-between px-6 cursor-pointer hover:bg-slate-50 border-b border-slate-100 bg-white relative z-10"
      >
        <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">Gammes de Production</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[9px] font-bold border border-slate-200">{sequences.length}</span>
        </div>
        <button className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline">{isOpen ? 'Réduire' : 'Ouvrir'}</button>
      </div>

      {isOpen && (
        <div className="flex h-[calc(100%-40px)] divide-x divide-slate-100">
          
          {/* COLONNE GAUCHE : LISTE DES GAMMES (Fixe 250px) */}
          <div className="w-[280px] p-4 overflow-y-auto bg-slate-50 space-y-3 shrink-0">
            <button 
                onClick={() => addSequence(`Gamme ${sequences.length + 1}`)}
                className="w-full py-3 border-2 border-dashed border-slate-200 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all"
            >
                + Nouvelle Gamme
            </button>
            {sequences.map(s => (
              <div 
                key={s.id} 
                onClick={() => setSelectedSequenceId(s.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center group ${selectedSequenceId === s.id ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'}`}
              >
                <div>
                    <p className="text-xs font-bold truncate text-slate-800">{s.name}</p>
                    <p className="text-[9px] text-slate-400 mt-1">{s.steps.length} étapes</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeSequence(s.id); }}
                  className={`p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-300 transition-colors opacity-0 group-hover:opacity-100`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* COLONNE DROITE : ÉDITEUR (Flexible) */}
          <div className="flex-1 p-8 overflow-x-auto bg-white">
            {activeSeq ? (
              <div className="space-y-8 min-w-[800px]"> {/* min-w force le scroll si trop petit */}
                
                {/* CONFIGURATION DE LA GAMME */}
                <div className="flex items-end gap-8 pb-6 border-b border-slate-100">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Nom de la gamme</label>
                        <input 
                            className="text-2xl font-black text-slate-900 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500 placeholder:text-slate-200 w-64"
                            value={activeSeq.name}
                            onChange={(e) => updateSequenceMeta(activeSeq.id, { name: e.target.value })}
                            placeholder="Nom..."
                        />
                    </div>
                    
                    <div className="flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">Cadence (m²/h)</span>
                            <input type="number" className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20" value={activeSeq.properties.cadence} onChange={e => updateSequenceMeta(activeSeq.id, { properties: { ...activeSeq.properties, cadence: parseFloat(e.target.value) } })} />
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">Entraînement (L/m²)</span>
                            <input type="number" step="0.01" className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20" value={activeSeq.properties.dragOut} onChange={e => updateSequenceMeta(activeSeq.id, { properties: { ...activeSeq.properties, dragOut: parseFloat(e.target.value) } })} />
                        </div>
                    </div>
                </div>

                {/* SÉQUENCEUR VISUEL */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4">
                  {/* Start Point */}
                  <div className="flex flex-col items-center gap-2 opacity-50 mr-2">
                     <div className="w-3 h-3 bg-slate-300 rounded-full" />
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Début</span>
                  </div>

                  {activeSeq.steps.map((stepId, idx) => {
                    const node = nodes.find(n => n.id === stepId);
                    return (
                      <div key={idx} className="flex items-center">
                        <div className="relative group min-w-[140px]">
                           <div className="bg-white border-2 border-slate-200 p-4 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Étape {idx + 1}</p>
                              <p className="text-sm font-bold text-slate-800 truncate">{node?.data.label || 'Node supprimé'}</p>
                           </div>
                           
                           {/* Bouton Supprimer l'étape (Hover) */}
                           <button 
                             onClick={() => removeStep(idx)}
                             className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110"
                           >
                             <Trash2 className="w-3 h-3" />
                           </button>
                        </div>
                        {/* Flèche de liaison */}
                        <div className="w-8 h-0.5 bg-slate-200 mx-1" />
                      </div>
                    );
                  })}
                  
                  {/* AJOUTER ÉTAPE */}
                  <div className="relative">
                    <select 
                      className="appearance-none pl-4 pr-10 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-[10px] font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer outline-none min-w-[120px]"
                      onChange={(e) => addStep(e.target.value)}
                      value=""
                    >
                      <option value="">+ ÉTAPE</option>
                      {nodes.filter(n => n.type === "TANK").map(n => (
                          <option key={n.id} value={n.id}>{n.data.label}</option>
                      ))}
                    </select>
                    <Plus className="w-4 h-4 text-current absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 italic space-y-4">
                <Layers className="w-16 h-16 opacity-20" />
                <p>Sélectionnez une gamme à gauche pour éditer le process.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}