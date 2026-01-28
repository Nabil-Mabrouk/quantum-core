'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Play, 
  ArrowDown, 
  ChevronRight, 
  Activity,
  Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { getDomainConfig } from '@/lib/registry';
import { t } from '@/lib/i18n';
import { useParams } from 'next/navigation';
import { Locale } from '@/lib/domain-config';
import { toast } from 'sonner';

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
    systemId 
  } = useCanvasStore();
  
  const params = useParams();
  const locale = (params.locale as Locale) || 'fr';
  const config = getDomainConfig(); // Récupère la config du domaine actuel
  
  const [isSaving, setIsSaving] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftProps, setDraftProps] = useState<Record<string, any>>({});

  const activeSeq = sequences.find(s => s.id === selectedSequenceId);

  // Synchronisation : Remplit le formulaire quand on change de gamme
  useEffect(() => {
    if (activeSeq) {
        setDraftName(activeSeq.name);
        setDraftProps(activeSeq.properties || {});
    }
  }, [selectedSequenceId, activeSeq]);

  const handleSave = async () => {
    if (!activeSeq) return;
    setIsSaving(true);
    try {
        await updateSequenceMeta(activeSeq.id, { 
            name: draftName, 
            properties: draftProps 
        });
        toast.success(locale === 'fr' ? "Gamme enregistrée" : "Sequence saved");
        setTimeout(() => setIsSaving(false), 500);
    } catch (e) {
        toast.error("Erreur de sauvegarde");
        setIsSaving(false);
    }
  };

  const handleAddStep = (nodeId: string) => {
    if (!activeSeq || !nodeId) return;
    updateSequenceSteps(activeSeq.id, [...activeSeq.steps, nodeId]);
  };

  const handleRemoveStep = (idx: number) => {
    if (!activeSeq) return;
    const newSteps = activeSeq.steps.filter((_, i) => i !== idx);
    updateSequenceSteps(activeSeq.id, newSteps);
  };

  return (
    <div className="flex h-full bg-white overflow-hidden animate-in fade-in duration-500">
      
      {/* --- COLONNE GAUCHE : SÉLECTEUR DE GAMME --- */}
      <div className="w-80 border-r border-slate-100 bg-slate-50/30 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-200/60 flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {locale === 'fr' ? 'Mes Workflows' : 'Workflows'}
            </h2>
            <button 
                onClick={() => addSequence(locale === 'fr' ? "Nouveau Workflow" : "New Workflow")} 
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-90"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {sequences.map(s => (
            <button 
              key={s.id} 
              onClick={() => setSelectedSequenceId(s.id)} 
              className={clsx(
                "w-full p-5 rounded-[1.5rem] border text-left transition-all relative group",
                selectedSequenceId === s.id 
                  ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 shadow-sm"
              )}
            >
              <p className="font-black text-sm truncate">{s.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={clsx("text-[9px] font-bold uppercase tracking-tighter", selectedSequenceId === s.id ? "text-blue-400" : "text-slate-400")}>
                    {s.steps.length} {locale === 'fr' ? 'étapes' : 'steps'}
                </span>
                <Trash2 
                  onClick={(e) => { e.stopPropagation(); removeSequence(s.id); }} 
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all" 
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- ZONE PRINCIPALE : ÉDITEUR VERTICAL FULL PAGE --- */}
      <div className="flex-1 bg-white overflow-y-auto custom-scrollbar">
        {activeSeq ? (
          <div className="max-w-5xl mx-auto py-16 px-12">
            
            {/* 1. ENTÊTE : TITRE & PARAMÈTRES DYNAMIQUES */}
            <div className="flex flex-col gap-10 mb-20">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <input 
                            className="text-5xl font-black text-slate-900 bg-transparent outline-none border-b-4 border-transparent focus:border-blue-500 placeholder:text-slate-200 w-full max-w-xl transition-all pb-2 tracking-tighter"
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                        />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-3 h-3" /> {locale === 'fr' ? 'Configuration de la logique séquentielle' : 'Sequential logic configuration'}
                        </p>
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving} 
                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {locale === 'fr' ? 'Enregistrer' : 'Save'}
                    </button>
                </div>

                {/* PARAMÈTRES TECHNIQUES DU MANIFESTE */}
                {config.sequenceFields && config.sequenceFields.length > 0 && (
                    <div className="flex items-center gap-8 bg-slate-50 px-10 py-6 rounded-[2.5rem] border border-slate-100 shadow-inner w-fit">
                        {config.sequenceFields.map((field: any, idx: number) => (
                            <div key={field.id} className="flex items-center gap-8">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                                        {t(field.label, locale)}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="number" 
                                            className="w-28 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" 
                                            value={draftProps[field.id] ?? field.default} 
                                            onChange={e => setDraftProps({
                                                ...draftProps, 
                                                [field.id]: parseFloat(e.target.value) || 0
                                            })} 
                                        />
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">{field.unit}</span>
                                    </div>
                                </div>
                                {idx < config.sequenceFields.length - 1 && (
                                    <div className="w-px h-12 bg-slate-200" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. LE FIL DU WORKFLOW (VERTICAL) */}
            <div className="relative pl-16 space-y-0 max-w-3xl">
                {/* Ligne verticale conductrice */}
                <div className="absolute left-[31px] top-4 bottom-4 w-1.5 bg-gradient-to-b from-blue-500 via-slate-200 to-slate-100 rounded-full" />

                {/* Point de départ */}
                <div className="relative flex items-center gap-8 mb-16">
                    <div className="absolute -left-[16px] w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 text-white fill-current ml-0.5" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 ml-4">
                        {locale === 'fr' ? 'Départ de la Gamme' : 'Sequence Start'}
                    </span>
                </div>

                {/* ÉTAPES */}
                {activeSeq.steps.map((stepId, idx) => {
                    const node = nodes.find(n => n.id === stepId);
                    const nodeConfig = config.nodeTypes[node?.type || ''];
                    const color = nodeConfig?.color?.split('-')[0] || 'slate';

                    return (
                        <div key={`${stepId}-${idx}`} className="relative group pb-12">
                            {/* Indicateur de position sur le fil */}
                            <div className={clsx(
                                "absolute -left-[14px] w-7 h-7 rounded-full border-4 border-white shadow-md transition-all group-hover:scale-125 z-10", 
                                `bg-${color}-500`
                            )} />

                            <div className={clsx(
                                "ml-10 bg-white border-2 p-7 rounded-[2.5rem] shadow-sm transition-all flex items-center justify-between group-hover:shadow-2xl group-hover:border-blue-200 group-hover:-translate-y-1 relative overflow-hidden",
                                `border-${color}-50`
                            )}>
                                <div className="flex items-center gap-8">
                                    <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", `bg-${color}-50 text-${color}-600`)}>
                                        <p className="font-black text-xl italic opacity-50">{idx + 1}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Zap className={clsx("w-3 h-3", `text-${color}-400`)} />
                                            {nodeConfig?.label ? t(nodeConfig.label, locale) : node?.type}
                                        </p>
                                        <p className="text-2xl font-black text-slate-800 tracking-tight">{node?.data?.label}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleRemoveStep(idx)}
                                    className="p-4 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* SÉLECTEUR D'AJOUT (LE "+" DYNAMIQUE) */}
                <div className="relative ml-10 pt-4">
                    <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-300 z-10">
                        <Plus className="w-4 h-4" />
                    </div>
                    
                    <div className="relative max-w-md">
                        <select 
                            className="appearance-none w-full pl-8 pr-14 py-6 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] text-xs font-black uppercase tracking-widest text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer outline-none shadow-inner"
                            onChange={(e) => { 
                                if(e.target.value) {
                                    handleAddStep(e.target.value);
                                    e.target.value = "";
                                }
                            }}
                            value=""
                        >
                            <option value="">+ {locale === 'fr' ? 'Ajouter une étape' : 'Add an operation'}</option>
                            {nodes
                                //.filter(n => n.data?.role === 'PROCESS' || n.data?.role === 'SINK')
                                .filter(n=>{const nodeScope = config.nodeTypes[n.type]?.scope; 
                                    return nodeScope === 'PROCESS';})
                                .map(n => (
                                <option key={n.id} value={n.id}>
                                    {n.data?.label} ({t(config.nodeTypes[n.type]?.label || n.type, locale)})
                                </option>
                            ))}
                        </select>
                        <ChevronRight className="w-6 h-6 text-slate-300 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                    </div>
                </div>
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="h-full flex flex-col items-center justify-center bg-slate-50/20">
            <div className="w-24 h-24 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center mb-8 border border-slate-100">
                <Layers className="w-10 h-10 text-blue-500 animate-pulse" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs text-center leading-relaxed">
              Sélectionnez une gamme existante<br/>ou créez-en une nouvelle pour commencer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}