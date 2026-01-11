'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Layers, Plus, Trash2, ChevronUp, ChevronDown, Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

export function SequenceManager() {
  const { 
    nodes, 
    sequences, 
    addSequence, 
    updateSequenceMeta, 
    updateSequenceSteps, 
    removeSequence, 
    selectedSequenceId, 
    setSelectedSequenceId,
    systemId // Utilisation du nouveau nommage
  } = useCanvasStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- ÉTATS LOCAUX (Mode Brouillon pour la performance) ---
  const [draftName, setDraftName] = useState("");
  const [draftProps, setDraftProps] = useState({ cadence: 10, dragOut: 0.1 });

  const activeSeq = sequences.find(s => s.id === selectedSequenceId);

  // Synchronisation : Remplit le formulaire quand on change de gamme
  useEffect(() => {
    if (activeSeq) {
        setDraftName(activeSeq.name);
        setDraftProps({
            cadence: activeSeq.properties.cadence ?? 10,
            dragOut: activeSeq.properties.dragOut ?? 0.1
        });
    }
  }, [selectedSequenceId, activeSeq]);

  // --- ACTIONS ---

  const handleSave = async () => {
    if (!activeSeq) return;
    setIsSaving(true);
    try {
        await updateSequenceMeta(activeSeq.id, { 
            name: draftName, 
            properties: draftProps 
        });
        // Petit délai pour le feedback visuel
        setTimeout(() => setIsSaving(false), 600);
    } catch (e) {
        console.error(e);
        alert("Erreur lors de la sauvegarde de la gamme.");
        setIsSaving(false);
    }
  };

  const handleAddSequence = async () => {
    if (!systemId) {
        alert("Erreur : Aucun système actif détecté.");
        return;
    }
    await addSequence(`Gamme ${sequences.length + 1}`);
  };

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
    <div className={clsx(
        "fixed bottom-0 left-64 right-80 bg-white border-t border-slate-200 transition-all duration-300 z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]",
        isOpen ? "h-96" : "h-10"
    )}>
      
      {/* BARRE DE TITRE (HEADER) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 flex items-center justify-between px-6 cursor-pointer hover:bg-slate-50 border-b border-slate-100 bg-white relative z-10"
      >
        <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">Gammes de Production</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[9px] font-bold border border-slate-200">{sequences.length}</span>
        </div>
        <div className="text-slate-400">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <div className="flex h-[calc(100%-40px)] divide-x divide-slate-100">
          
          {/* COLONNE GAUCHE : LISTE DES GAMMES */}
          <div className="w-[280px] p-4 overflow-y-auto bg-slate-50 space-y-3 shrink-0">
            <button 
                onClick={handleAddSequence}
                className="w-full py-3 border-2 border-dashed border-slate-200 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
            >
                <Plus className="w-3.5 h-3.5" /> Nouvelle Gamme
            </button>
            
            {sequences.map(s => (
              <div 
                key={s.id} 
                onClick={() => setSelectedSequenceId(s.id)}
                className={clsx(
                    "p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center group",
                    selectedSequenceId === s.id ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500" : "bg-white border-slate-200 text-slate-500 hover:border-blue-300"
                )}
              >
                <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-slate-800">{s.name}</p>
                    <p className="text-[9px] text-slate-400 mt-1">{s.steps.length} étapes</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeSequence(s.id); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* COLONNE DROITE : ÉDITEUR DE GAMME */}
          <div className="flex-1 p-8 overflow-x-auto bg-white">
            {activeSeq ? (
              <div className="space-y-8 min-w-[800px]">
                
                {/* --- CONFIGURATION (NAME & PROPS) --- */}
                <div className="flex items-end justify-between pb-6 border-b border-slate-100">
                    <div className="flex items-end gap-10">
                        {/* Champ Désignation */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase block ml-1">
                                Désignation Gamme
                            </label>
                            <input 
                                className="text-2xl font-black text-slate-900 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500 placeholder:text-slate-200 w-80 transition-all pb-1"
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                placeholder="Nom de la gamme..."
                            />
                        </div>
                        
                        {/* Paramètres Techniques */}
                        <div className="flex items-center gap-6 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 mb-1">
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase block">Cadence (u/h)</span>
                                <input 
                                    type="number" 
                                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20" 
                                    value={draftProps.cadence} 
                                    onChange={e => setDraftProps({...draftProps, cadence: parseFloat(e.target.value) || 0})} 
                                />
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase block">Entraînement (L)</span>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20" 
                                    value={draftProps.dragOut} 
                                    onChange={e => setDraftProps({...draftProps, dragOut: parseFloat(e.target.value) || 0})} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* BOUTON SAUVEGARDER */}
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 mb-1"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Enregistrer les modifications
                    </button>
                </div>

                {/* --- SEQUENCEUR VISUEL --- */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-4">
                  <div className="flex flex-col items-center gap-2 opacity-50 mr-4">
                     <div className="w-4 h-4 bg-slate-300 rounded-full flex items-center justify-center text-[8px] text-white font-bold">A</div>
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Départ</span>
                  </div>

                  {activeSeq.steps.map((stepId, idx) => {
                    const node = nodes.find(n => n.id === stepId);
                    return (
                      <div key={`${stepId}-${idx}`} className="flex items-center animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="relative group min-w-[140px]">
                           <div className="bg-white border-2 border-slate-200 p-4 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group-hover:-translate-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Étape {idx + 1}</p>
                              <p className="text-sm font-bold text-slate-800 truncate">
                                {node?.data?.label || 'Élément introuvable'}
                              </p>
                           </div>
                           <button 
                             onClick={() => removeStep(idx)}
                             className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110"
                           >
                             <Trash2 className="w-3 h-3" />
                           </button>
                        </div>
                        <div className="w-8 h-0.5 bg-slate-200 mx-2" />
                      </div>
                    );
                  })}
                  
                  {/* SÉLECTEUR D'AJOUT D'ÉTAPE */}
                  <div className="relative group">
                    <select 
                      className="appearance-none pl-4 pr-10 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-[10px] font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer outline-none min-w-[140px] focus:ring-2 focus:ring-blue-500/20"
                      onChange={(e) => { addStep(e.target.value); e.target.value = ""; }}
                      value=""
                    >
                      <option value="">+ AJOUTER ÉTAPE</option>
                      
                      {/* --- CORRECTIF DU FILTRE ICI --- */}
                      {nodes
                        .filter(n => {
                            const role = n.data?.role || 'PROCESS';
                            return role === 'PROCESS' || role === 'SINK';
                        })
                        .map(n => (
                          <option key={n.id} value={n.id}>{n.data?.label || 'Sans nom'}</option>
                      ))}
                    </select>
                    <Plus className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 italic space-y-4">
                <Layers className="w-16 h-16 opacity-10" />
                <p>Sélectionnez ou créez une gamme dans la colonne de gauche pour commencer.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}