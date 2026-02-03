// apps/studio/components/layout/shell/universal-header.tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  ChevronRight, Folder, LayoutDashboard, Save, 
  Play, Loader2, Network, ListOrdered, Factory, Map, 
  Settings, Sparkles, Layers, StopCircle, LayoutList
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SystemSelector } from '../system-selector';
import { clsx } from 'clsx';
// 🚩 CORRECTION: Ajout de l'import des actions de simulation
import { runProjectSummaryAction, runGlobalProjectSimulation, generateProposalAction } from '@/app/actions/simulation';
import { saveGraph } from '@/app/actions/graph';
import { useState, useRef, useMemo } from 'react';
import { getDomainConfig } from '@/lib/registry';
import { t, getDictionary } from '@/lib/i18n'; 
import { toast } from "sonner";
import { ProjectSettingsModal } from '../project-settings-modal';
import { SimulationConsole } from '@/components/ui/simulation-console';
import { useParams } from 'next/navigation';
import { Locale, ViewMode } from '@/lib/domain-config';
import { LanguageSwitcher } from './language-switcher';

interface UniversalHeaderProps {
  projectName?: string;
  projectId: string;
  domainId: string; // Requis pour la généricité et les settings
  systems?: any[];
  currentSystemId?: string;
}

const VIEW_CONFIG: Record<ViewMode, { icon: any; label: { fr: string; en: string }; color: string }> = {
  GRAPH: { 
    icon: Network, 
    label: { fr: "Graphe", en: "Graph" }, 
    color: "text-blue-600" 
  },
  SYNOPTIC: { 
    icon: LayoutList, 
    label: { fr: "Synoptique", en: "Synoptic" }, 
    color: "text-blue-600" 
  },
  SEQUENCES: { 
    icon: Layers, 
    label: { fr: "Gammes", en: "Sequences" }, 
    color: "text-blue-600" 
  },
  SUMMARY: { 
    icon: Factory, 
    label: { fr: "Bilan", en: "Summary" }, 
    color: "text-purple-600" 
  }
};

export function UniversalHeader({ projectName, projectId, domainId, systems, currentSystemId }: UniversalHeaderProps) {
  // 1. DÉPENDANCES DU DOMAINE
  const pathname = usePathname(); 
  const searchParams = useSearchParams(); 
  const config = getDomainConfig(domainId);
  const params = useParams();
  const locale = (params.locale as Locale) || 'fr';
  const dict = getDictionary(locale);
  const isLibrary = pathname.includes('/library');
  
  // 2. ÉTATS ET STORE
  const store = useCanvasStore();
  const { viewMode, setViewMode, nodes, edges, sequences, setSummaryData, setSynopticMode, synopticMode } = store;
  const [isSaving, setIsSaving] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSimulatingAll, setIsSimulatingAll] = useState(false); // Ajout pour l'action globale
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentView = searchParams ? searchParams.get('view') : null; 

  // 3. CONTEXTES DE NAVIGATION
  const isProjectLevel = projectId && !currentSystemId;
  const isSystemLevel = !!currentSystemId;


  // --- ACTIONS ---

  const handleSave = async () => {
    if (!currentSystemId) {
      toast.error("Aucun système sélectionné.");
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
        toast.success(dict.ui.save);
      } else {
        toast.error("Erreur", { description: result.error });
      }
    } catch (e) {
      toast.error("Erreur serveur");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort(); 
        abortControllerRef.current = null;
        setLogs(prev => [...prev, { 
            message: "🛑 " + t({fr: "Arrêt manuel par l'utilisateur.", en: "Manual stop by user."}, locale), 
            timestamp: new Date().toLocaleTimeString() 
        }]);
        setSimStatus('error');
        setIsSimulating(false);
        toast.info("Simulation annulée");
    }
  };

  const handleSimulate = async () => {
    if (!config?.id || !currentSystemId) {
      toast.warning("Données incomplètes (Domaine ou Système manquant)");
      return;
    }

    setIsSimulating(true);
    setSimStatus('running');
    setShowConsole(true);
    setLogs([{ message: "🚀 Initialisation Quantum Engine...", timestamp: new Date().toLocaleTimeString() }]);
    setProgress(5);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
        // Préparation du payload
        const cleanNodes = nodes.map(n => {
            const { simulationResults, ...cleanProps } = n.data.properties;
            return { 
                id: n.id, 
                type: n.type, 
                data: n.data,
                properties: cleanProps // <-- ENVOIE SEULEMENT LES INPUTS UTILISATEUR
            };
        });

        const payloadToSend = {
            projectId,
            domain: config.id,
            nodes: cleanNodes,
            edges: edges.map(e => ({ source: e.source, target: e.target, properties: e.data })),
            sequences,
        };

        // Appel à l'API Route Next.js (Proxy Sécurisé)
        const response = await fetch('/api/simulation/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadToSend),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Erreur proxy: ${errorBody}`);
        }
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalData: any = null; 

        // Boucle de lecture du flux NDJSON
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; 

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const msg = JSON.parse(line);
                    if (msg.type === 'log') {
                        setLogs(prev => [...prev, { message: msg.message, timestamp: new Date().toLocaleTimeString() }]);
                        if (msg.progress) setProgress(msg.progress);
                    } else if (msg.type === 'warning') {
                        setLogs(prev => [...prev, { message: `⚠️ WARNING: ${msg.message}`, timestamp: new Date().toLocaleTimeString() }]);
                    } else if (msg.type === 'result') {
                        finalData = msg.data; 
                        const res = msg.data;
                        
                        // 🚩 POINT CLÉ DE LA CORRECTION : Protection du ForEach dans l'injection
                        const nodeDetails = res.node_details ?? {}; 
                        Object.keys(nodeDetails).forEach(id => 
                            store.updateNodeProperties(id, { simulationResults: nodeDetails[id] })
                        );
                        
                        store.setSummaryData(res);
                        setSimStatus('success');
                        toast.success("Simulation terminée");
                    } else if (msg.type === 'error') {
                        throw new Error(msg.message); 
                    }
                } catch (e) { 
                    setLogs(prev => [...prev, { message: `🐛 JSON Error: ${e.message}. Partial chunk ignored.`, timestamp: new Date().toLocaleTimeString() }]);
                }
            }
        }
    } catch (error: any) {
        if (error.name === 'AbortError') return; 
        setLogs(prev => [...prev, { message: `❌ CRITICAL ERROR: ${error.message}`, timestamp: new Date().toLocaleTimeString() }]);
        setSimStatus('error');
        setProgress(100);
        toast.error("Erreur de Simulation", { description: error.message });
    } finally {
        setIsSimulating(false);
        abortControllerRef.current = null;
    }
  };

  const handleSimulateAll = async () => {
    if (!projectId || !domainId) {
        toast.error("Erreur de contexte", { description: "Projet ou Domaine manquant." });
        return;
    }
    
    setIsSimulatingAll(true);
    setSimStatus('running');
    setShowConsole(true);
    setLogs([{ message: t({fr: '🚀 Initialisation Orchestrateur Projet...', en: 'Project Orchestrator Initializing...'}, locale), timestamp: new Date().toLocaleTimeString() }]);
    setProgress(5);

    try {
        // L'action server appelle l'Engine en mode synchrone, on attend la réponse complète.
        const response = await runGlobalProjectSimulation(projectId);

        if (response.success && response.data?.status === 'success') {
            
            setLogs(prev => [...prev, { message: t({fr: '✅ Orchestration terminée. Sauvegarde des flux en base de données.', en: 'Orchestration complete. Saving stream data to database.'}, locale), timestamp: new Date().toLocaleTimeString() }]);
            
            // Mise à jour de l'UI
            store.setSummaryData(response.data.results); 
            setViewMode('SUMMARY'); 
            
            setProgress(100);
            setSimStatus('success');
            toast.success(t({fr: 'Simulation globale terminée.', en: 'Global simulation complete.'}, locale));

        } else {
            // L'erreur vient du solveur orchestrateur (status: "error" dans le JSON)
            const errorMessage = response.data?.message || response.error || t({fr: 'Erreur inconnue lors de l’orchestration.', en: 'Unknown error during orchestration.'}, locale);
            
            setLogs(prev => [...prev, { message: `❌ ERREUR: ${errorMessage}`, timestamp: new Date().toLocaleTimeString() }]);
            setProgress(100);
            setSimStatus('error');
            toast.error(t({fr: 'Échec de la simulation globale.', en: 'Global simulation failed.'}, locale), { description: errorMessage });
        }
    } catch (error: any) {
        // Erreur réseau ou exception inattendue du Server Action
        setLogs(prev => [...prev, { message: `❌ ERREUR CRITIQUE: ${error.message}`, timestamp: new Date().toLocaleTimeString() }]);
        setProgress(100);
        setSimStatus('error');
        toast.error(t({fr: 'Échec réseau/serveur.', en: 'Network/server failure.'}, locale));
    } finally {
        setIsSimulatingAll(false);
    }
  };   

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white grid grid-cols-[1fr_auto_1fr] items-center px-6 shrink-0 z-40 shadow-sm relative">
        
        {/* --- GAUCHE : NAVIGATION --- */}
        <div className="flex items-center justify-start min-w-0">
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 mr-4 group">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">QC</div>
          </Link>

          <nav className="flex items-center gap-2 overflow-hidden text-sm">
            <Link href={`/${locale}/dashboard`} className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider transition-colors truncate">
                {dict.ui.dashboard}
            </Link>
            
            {/* Breadcrumbs Project Level */}
            {projectName && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                <Link href={`/${locale}/project/${projectId}`} className={clsx("font-black tracking-tight transition-colors truncate max-w-[250px]", isProjectLevel ? "text-blue-600" : "text-slate-700 hover:text-blue-600")}>
                    {projectName}
                </Link>
              </>
            )}

            {/* Breadcrumbs System Level */}
            {isSystemLevel && systems && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                <SystemSelector systems={systems} currentSystemId={currentSystemId} projectId={projectId} />
              </>
            )}
          </nav>
        </div>

        {/* --- CENTRE : VIEW SWITCHER (MANIFEST DRIVEN) --- */}
        <div className="flex items-center gap-4 justify-center">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 h-10">
            {isProjectLevel && (
              // Rendu pour la vue Blueprint (Plan + Bilan global)
              <>
                <Link 
                  href={`/${locale}/project/${projectId}?view=map`} 
                  className={clsx(
                    "flex items-center gap-2 px-4 h-full rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", 
                    currentView !== 'summary' ? "bg-white text-blue-600 shadow-sm border border-blue-100/50" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Network className="w-3.5 h-3.5" /> Plan
                </Link>
                <Link 
                  href={`/${locale}/project/${projectId}?view=summary`} 
                  className={clsx(
                    "flex items-center gap-2 px-4 h-full rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", 
                    currentView === 'summary' ? "bg-white text-purple-600 shadow-sm border border-purple-100/50" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Factory className="w-3.5 h-3.5" /> Bilan
                </Link>
              </>
            )}

            {isSystemLevel && (
              <>
                {/* BOUCLE DYNAMIQUE SUR LES VUES AUTORISÉES (Graphe, Synoptique, Séquence, Bilan) */}
                {config.ui.enabledViews.map((view, idx) => {
                  const viewInfo = VIEW_CONFIG[view];
                  const Icon = viewInfo.icon;
                  const isActive = viewMode === view;
                  
                  // Séparateur juste avant le Bilan pour le distinguer des vues d'édition
                  const separator = (view === 'SUMMARY' && idx > 0) 
                    ? <div className="w-px h-4 bg-slate-300/50 mx-1" /> 
                    : null;
                  
                  return (
                    <div key={view} className="flex items-center gap-1">
                      {separator}
                      <button 
                        onClick={() => setViewMode(view)} 
                        className={clsx(
                          "px-4 h-full rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", 
                          isActive ? `bg-white ${viewInfo.color} shadow-sm border border-blue-100/50` : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">{t(viewInfo.label, locale)}</span>
                      </button>
                    </div>
                  );
                })}
              </>
            )}

            {isLibrary && (
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t(config.name, locale)}
                </div>
            )}
          </div>


        </div>

        {/* --- DROITE : ACTIONS --- */}
        <div className="flex items-center justify-end gap-2">
          <LanguageSwitcher /> 
          {isSystemLevel && (
            <>
              <button onClick={() => setIsSettingsOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                  <Settings className="w-4 h-4" />
              </button>
              <div className="h-6 w-px bg-slate-200 mx-1" />
              
              {/* Bouton IA Offre (Réintégré pour la complétude) */}
              <button 
                onClick={() => generateProposalAction(domainId, nodes as any, edges as any, sequences as any)} // Forcé à any pour le typage rapide
                disabled={isSimulating || isSimulatingAll || nodes.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 disabled:opacity-30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">IA Offre</span>
              </button>

              <button 
                  onClick={handleSimulate} // 👈 Utilise la fonction de streaming corrigée
                  disabled={isSimulating || nodes.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50"
              >
                  {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span className="hidden xl:inline">{dict.ui.simulate}</span>
              </button>
              
              <button onClick={handleSimulateAll} disabled={isSimulatingAll || !projectId}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all disabled:opacity-50"
              >
                  {isSimulatingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Factory className="w-3.5 h-3.5" />}
                  <span className="hidden xl:inline">Simuler Tout</span>
              </button>

              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-black transition-all shadow-lg disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span className="hidden xl:inline">{dict.ui.save}</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* MODALES : On passe le domainId au Modal de Settings */}
      {isSettingsOpen && (
        <ProjectSettingsModal 
          projectId={projectId} 
          domainId={domainId} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
      {/* 🚩 CONSOLE DE SIMULATION RÉACTIVÉE */}
      <SimulationConsole 
        isOpen={showConsole} 
        onClose={() => setShowConsole(false)} 
        logs={logs} 
        progress={progress} 
        status={simStatus} 
        onAbort={handleAbort} 
      />
    </>
  );
}