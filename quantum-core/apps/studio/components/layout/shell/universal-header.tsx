'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  ChevronRight, Folder, LayoutDashboard, Save, 
  Play, Loader2, Network, ListOrdered, Factory, Map, 
  Settings, Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SystemSelector } from '../system-selector';
import { clsx } from 'clsx';
import { runSimulationAction, generateProposalAction, runProjectSummaryAction } from '@/app/actions/simulation';
import { saveGraph } from '@/app/actions/graph';
import { useState } from 'react';
import { getDomainConfig } from '@/lib/registry';
import { toast } from "sonner";
import { ProjectSettingsModal } from '../project-settings-modal';

interface UniversalHeaderProps {
  projectName?: string;
  projectId: string;
  systems?: any[];
  currentSystemId?: string;
}

export function UniversalHeader({ projectName, projectId, systems, currentSystemId }: UniversalHeaderProps) {
  const config = getDomainConfig();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'map';
  
  // Utilisation simple pour détecter le mode Library
  const isLibrary = pathname.includes('/library');

  const store = useCanvasStore();
  const { viewMode, setViewMode, nodes, edges, sequences, setSummaryData, setSynopticMode, synopticMode } = store;
  
  // États de chargement
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Détermine le contexte (Niveau Projet vs Niveau Système)
  const isProjectLevel = projectId && !currentSystemId;
  const isSystemLevel = !!currentSystemId;

  // --- ACTIONS ---

  const handleSave = async () => {
    if (!currentSystemId) {
      toast.error("Impossible de sauvegarder", { description: "Aucun système actif." });
      return;
    }
    
    setIsSaving(true);
    const cleanNodes = nodes.map(n => ({
      id: n.id,
      position: n.position,
      data: n.data,
      type: n.type 
    }));

    try {
      const result = await saveGraph(currentSystemId, cleanNodes, edges, sequences);
      if (result.success) {
        toast.success("Système sauvegardé");
      } else {
        toast.error("Erreur de sauvegarde", { description: result.error });
      }
    } catch (e) {
      toast.error("Erreur inattendue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulate = async () => {
    if (!config?.id || !currentSystemId) {
      toast.warning("Données manquantes", { description: "Impossible de lancer la simulation." });
      return;
    }

    setIsSimulating(true);
    try {
      const res = await runSimulationAction(
        config.id, 
        currentSystemId,
        nodes, 
        edges, 
        sequences
      );

      if (res.success) {
        if (res.data.status === "success") {
          const details = res.data.node_details;
          // Mise à jour des résultats dans le store pour affichage sur les noeuds
          Object.keys(details).forEach(id => store.updateNodeProperties(id, { simulationResults: details[id] }));
          store.setSummaryData(res.data); 
          
          toast.success("Simulation terminée", { description: "Les bilans ont été mis à jour." });
        } else {
          toast.error("Erreur Moteur", { description: res.data.message });
        }
      } else {
        toast.error("Erreur Serveur", { description: res.error });
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'appel à la simulation.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleGenerateOffer = async () => {
    setIsGenerating(true);
    // Note: Implémentation simplifiée pour l'exemple
    setTimeout(() => {
        toast.info("Génération IA simulée", { description: "Fonctionnalité en cours de développement." });
        setIsGenerating(false);
    }, 1000);
  };

  const handleProjectSummary = async () => {
    if (!projectId) return;
    setIsSummarizing(true);
    try {
        const result = await runProjectSummaryAction(projectId);
        if (result.success) {
            setSummaryData(result.data);
            setViewMode('SUMMARY');
            toast.success("Bilan global généré");
        } else {
            toast.error("Erreur Bilan", { description: result.error });
        }
    } catch(e) {
        toast.error("Erreur critique");
    } finally {
        setIsSummarizing(false);
    }
  };

  return (
    <>
      {/* HEADER PRINCIPAL - GRID LAYOUT */}
      <header className="h-16 border-b border-slate-200 bg-white grid grid-cols-[1fr_auto_1fr] items-center px-6 shrink-0 z-40 shadow-sm relative transition-all">
        
        {/* --- 1. GAUCHE : BREADCRUMBS --- */}
        <div className="flex items-center justify-start min-w-0">
          <Link href="/dashboard" className="flex items-center gap-3 mr-4 group">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">QC</div>
          </Link>

          <nav className="flex items-center gap-2 overflow-hidden text-sm">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider transition-colors truncate">
                Projets
            </Link>
            
            {projectName && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                <Link 
                  href={`/project/${projectId}`} 
                  className={clsx(
                    "font-black tracking-tight transition-colors truncate max-w-[150px] lg:max-w-[300px]",
                    isProjectLevel ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                  )}
                  title={projectName}
                >
                    {projectName}
                </Link>
              </>
            )}

            {isSystemLevel && systems && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                <div className="flex-shrink-0">
                   {/* Le sélecteur de système est isolé ici */}
                   <SystemSelector 
                      systems={systems} 
                      currentSystemId={currentSystemId} 
                      projectId={projectId} 
                   />
                </div>
              </>
            )}
          </nav>
        </div>

        {/* --- 2. CENTRE : VIEW SWITCHER --- */}
        <div className="flex justify-center">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 h-10">
            
            {/* VUE PROJET (Blueprint vs Bilan Global) */}
            {isProjectLevel && (
              <>
                <Link 
                  href={`/project/${projectId}?view=map`}
                  className={clsx(
                    "flex items-center gap-2 px-4 h-full rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    currentView === 'map' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Network className="w-3.5 h-3.5" /> Plan
                </Link>
                <div className="w-px h-4 bg-slate-300/50 mx-1" />
                <Link 
                  href={`/project/${projectId}?view=summary`}
                  className={clsx(
                    "flex items-center gap-2 px-4 h-full rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    currentView === 'summary' ? "bg-white text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Factory className="w-3.5 h-3.5" /> Bilan
                </Link>
              </>
            )}

            {/* VUE SYSTÈME (Graphe vs Synoptique vs Bilan Local) */}
            {isSystemLevel && (
              <>
                <button 
                  onClick={() => setViewMode('GRAPH')}
                  className={clsx(
                    "px-3 h-full rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", 
                    viewMode === 'GRAPH' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                  title="Vue Engineering (P&ID)"
                >
                  <Network className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Graphe</span>
                </button>
                
                <button 
                  onClick={() => setViewMode('SYNOPTIC')}
                  className={clsx(
                    "px-3 h-full rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", 
                    viewMode === 'SYNOPTIC' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                  title="Vue Opérateur"
                >
                  <ListOrdered className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Synoptique</span>
                </button>

                <div className="w-px h-4 bg-slate-300/50 mx-1" />
                
                <button 
                  onClick={() => setViewMode('SUMMARY')}
                  className={clsx(
                    "px-3 h-full rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", 
                    viewMode === 'SUMMARY' ? "bg-white text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                  title="Résultats de simulation"
                >
                  <Factory className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Résultats</span>
                </button>
              </>
            )}

            {/* MODE LIBRAIRIE (FALLBACK) */}
            {isLibrary && (
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Mode Gestion Référentiel
                </div>
            )}
          </div>
        </div>

        {/* --- 3. DROITE : ACTIONS --- */}
        <div className="flex items-center justify-end gap-2">
          
          {/* Placeholder visuel pour éviter le vide si pas de boutons */}
          {!isSystemLevel && !isLibrary && <div className="h-9" />}

          {isSystemLevel && (
            <>
              {/* Paramètres */}
              <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Paramètres Projet"
              >
                  <Settings className="w-4 h-4" />
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              {/* IA (Caché sur mobile) */}
              <button 
                  onClick={handleGenerateOffer} 
                  disabled={isGenerating || nodes.length === 0}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 disabled:opacity-30 transition-all"
              >
                  {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  IA
              </button>

              {/* Simuler */}
              <button 
                  onClick={handleSimulate} 
                  disabled={isSimulating || nodes.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50"
                  title="Lancer le calcul"
              >
                  {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span className="hidden xl:inline">Simuler</span>
              </button>

              {/* Sauvegarder */}
              <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
              >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span className="hidden xl:inline">Sauvegarder</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* --- MODALE SETTINGS --- */}
      {isSettingsOpen && (
        <ProjectSettingsModal 
          projectId={projectId} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </>
  );
}