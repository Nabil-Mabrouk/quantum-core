'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, Plus, Rocket, Folder, 
  FlaskConical, Zap, Droplets, 
  ArrowRight, Loader2, Info 
} from 'lucide-react';
import { createProjectAction } from '@/app/actions/project';
import { getAvailableDomains } from '@/lib/registry';
import { t } from '@/lib/i18n'; // <--- Import du helper de traduction
import { clsx } from 'clsx';
import { toast } from 'sonner';

export function CreateProjectModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('SURFACE_TREATMENT');
  
  const locale = 'fr'; // À récupérer dynamiquement via un hook de langue si disponible
  const domains = getAvailableDomains();

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      // On injecte le domaine sélectionné dans le formData
      formData.append('domain', selectedDomain);
      
      const result = await createProjectAction(formData);
      
      if (result?.id) {
        toast.success("Étude initialisée avec succès");
        setIsOpen(false);
        // Redirection vers l'éditeur du projet
        router.push(`/editor/${result.id}`);
      }
    } catch (error) {
      toast.error("Erreur lors de la création du projet");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        Nouvelle Étude
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row h-[600px] animate-in zoom-in-95 duration-300">
        
        {/* --- COLONNE GAUCHE : ILLUSTRATION & CONTEXTE --- */}
        <div className="w-full md:w-80 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                    <Rocket className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter leading-none mb-4">Initialiser une Étude</h2>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                    "La précision d'une simulation commence par la qualité de sa définition."
                </p>
            </div>
            <div className="relative z-10 space-y-4">
                <div className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Info className="w-3 h-3 text-blue-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                        Le domaine choisi détermine les bibliothèques chimiques et les solveurs physiques activés.
                    </p>
                </div>
            </div>
        </div>

        {/* --- COLONNE DROITE : FORMULAIRE --- */}
        <form action={handleSubmit} className="flex-1 flex flex-col bg-white">
            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar space-y-10">
                
                {/* 01. NOM DU PROJET */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                        <Folder className="w-3 h-3" /> 01. Identité de l'étude
                    </label>
                    <input 
                        name="name"
                        placeholder="Ex: Optimisation Ligne 4 - Site Lyon"
                        className="w-full text-2xl font-black tracking-tight text-slate-900 placeholder:text-slate-200 outline-none border-b-2 border-slate-100 focus:border-blue-500 transition-all pb-2"
                        required
                        autoFocus
                    />
                </div>

                {/* 02. SÉLECTION DU DOMAINE */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> 02. Domaine d'expertise
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {domains.map((d) => (
                            <div 
                                key={d.id}
                                onClick={() => setSelectedDomain(d.id)}
                                className={clsx(
                                    "p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 group",
                                    selectedDomain === d.id 
                                        ? "bg-blue-50 border-blue-500 shadow-lg shadow-blue-500/10" 
                                        : "bg-slate-50 border-transparent hover:border-slate-200"
                                )}
                            >
                                <div className={clsx(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                    selectedDomain === d.id ? "bg-blue-600 text-white" : "bg-white text-slate-400 group-hover:text-blue-500"
                                )}>
                                    {d.id === 'SURFACE_TREATMENT' ? <Droplets className="w-6 h-6" /> : <FlaskConical className="w-6 h-6" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={clsx("font-black text-sm uppercase tracking-tight", selectedDomain === d.id ? "text-blue-900" : "text-slate-600")}>
                                        {/* TRADUCTION DU NOM DU DOMAINE ICI */}
                                        {t(d.name, locale)}
                                    </p>
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Quantum Engine v3.3</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ACTIONS DU BAS */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                    Annuler
                </button>
                <button 
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>Lancer l'étude <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}