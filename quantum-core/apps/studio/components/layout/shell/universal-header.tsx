'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  ChevronRight, Folder, LayoutDashboard, Save, 
  Play, Loader2, Network, ListOrdered, Factory, Map, 
  Settings, Sparkles, Layers, StopCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SystemSelector } from '../system-selector';
import { clsx } from 'clsx';
import { runProjectSummaryAction } from '@/app/actions/simulation';
import { saveGraph } from '@/app/actions/graph';
import { useState, useRef } from 'react';
import { getDomainConfig } from '@/lib/registry';
import { toast } from "sonner";
import { ProjectSettingsModal } from '../project-settings-modal';
import { SimulationConsole } from '@/components/ui/simulation-console';

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
  
  // Détection de la vue active via l'URL (pour le niveau projet)
  const currentView = searchParams.get('view') || 'map'; 

  // Détection du mode Library
  const isLibrary = pathname.includes('/library');

  const store = useCanvasStore();
  const { 
    viewMode, 
    setViewMode, 
    nodes, 
    edges, 
    sequences, 
    setSummaryData, 
    setSynopticMode, 
    synopticMode 
  } = store;
  
  // États UI
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // États Simulation (Streaming)
  const [isSimulating, setIsSimulating] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Contextes
  const isProjectLevel = projectId && !currentSystemId;
  const isSystemLevel = !!currentSystemId;

  // --- ACTIONS ---

  const handleSave = async () => {
    if (!currentSystemId) {
      toast.error("Aucun système actif sélectionné.");
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
        toast.success("Modifications enregistrées");
      } else {
        toast.error("Erreur", { description: result.error });
      }
    } catch (e) {
      toast.error("Erreur serveur inattendue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        setLogs(prev => [...prev, { message: "🛑 Arrêt manuel de la simulation.", timestamp: new Date().toLocaleTimeString() }]);
        setSimStatus('error');
        setIsSimulating(false);
        toast.info("Calcul annulé");
    }
  };

  const handleSimulateStreaming = async () => {
    if (!config?.id || !currentSystemId) {
      toast.warning("Données système incomplètes.");
      return;
    }

    setIsSimulating(true);
    setSimStatus('running');
    setShowConsole(true);
    setLogs([{ message: "🚀 Initialisation du moteur Quantum...", timestamp: new Date().toLocaleTimeString() }]);
    setProgress(5);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
        const response = await fetch('/api/simulation/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: projectId,
                domain: config.id,
                nodes: nodes.map(n => ({ id: n.id, type: n.type, properties: n.data.properties })),
                edges: edges.map(e => ({ source: e.source, target: e.target, properties: e.data })),
                sequences,
            }),
            signal: controller.signal,
        });

        if (!response.body) throw new Error("Réponse vide du moteur.");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

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
                    }
                    else if (msg.type === 'result') {
                        const res = msg.data;
                        const details = res.node_details;
                        
                        Object.keys(details).forEach(id => store.updateNodeProperties(id, { simulationResults: details[id] }));
                        store.setSummaryData(res);
                        
                        setSimStatus('success');
                        toast.success("Simulation réussie");
                    }
                    else if (msg.type === 'error') {
                        throw new Error(msg.message);
                    }
                } catch (e) {
                    // Ignorer les fragments JSON
                }
            }
        }
    } catch (error: any) {
        if (error.name === 'AbortError') return;
        setLogs(prev => [...prev, { message: `❌ ERREUR: ${error.message}`, timestamp: new Date().toLocaleTimeString() }]);
        setSimStatus('error');
        toast.error("Erreur pendant le calcul");
    } finally {
        setIsSimulating(false);
        abortControllerRef.current = null;
    }
  };

  const handleGenerateOffer = async () => {
    setIsGenerating(true);
    setTimeout(() => {
        toast.info("Module IA en préparation", { description: "L'analyse prédictive arrive bientôt." });
        setIsGenerating(false);
    }, 1200);
  };

  const handleProjectSummary = async () => {
    if (!projectId) return;
    setIsSummarizing(true);
    try {
        const result = await runProjectSummaryAction(projectId);
        if (result.success) {
            setSummaryData(result.data);
            setViewMode('SUMMARY');
            toast.success("Bilan global consolidé");
        } else {
            toast.error("Erreur Bilan", { description: result.error });
        }
    } catch(e) {
        toast.error("Erreur de connexion");
    } finally {
        setIsSummarizing(false);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white grid grid-cols-[1fr_auto_1fr] items-center px-6 shrink-0 z-40 shadow-sm relative transition-all">
        
        {/* --- GAUCHE : NAVIGATION & BREADCRUMBS --- */}
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
                    "font-black tracking-tight transition-colors truncate max-w-[200px]", 
                    isProjectLevel ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                  )}
                >
                    {projectName}
                </Link>
              </>
            )}

            {isSystemLevel && systems && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                <div className="flex-shrink-0">
                   <SystemSelector systems={systems} currentSystemId={currentSystemId} projectId={projectId} />
                </div>
              </>
            )}
          </nav>
        </div>

        {/* --- CENTRE : VIEW SWITCHER --- */}
        <div className="flex items-center gap-4 justify-center">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 h-10">
            {isProjectLevel && (
              <>
                <Link href={`/project/${projectId}?view=map`} className={clsx("flex items-center gap-2 px-4 h-full rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", currentView === 'map' ? "bg-white text-blue-600 shadow-sm border border-blue-100/50" : "text-slate-400 hover:text-slate-600")}>
                  <Network className="w-3.5 h-3.5" /> Plan
                </Link>
                <div className="w-px h-4 bg-slate-300/50 mx-1" />
                <Link href={`/project/${projectId}?view=summary`} className={clsx("flex items-center gap-2 px-4 h-full rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", currentView === 'summary' ? "bg-white text-purple-600 shadow-sm border border-purple-100/50" : "text-slate-400 hover:text-slate-600")}>
                  <Factory className="w-3.5 h-3.5" /> Bilan
                </Link>
              </>
            )}

            {isSystemLevel && (
              <>
                <button onClick={() => setViewMode('GRAPH')} className={clsx("px-4 h-full rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", viewMode === 'GRAPH' ? "bg-white text-blue-600 shadow-sm border border-blue-100/50" : "text-slate-400 hover:text-slate-600")}>
                  <Network className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Graphe</span>
                </button>
                <button onClick={() => setViewMode('SYNOPTIC')} className={clsx("px-4 h-full rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", viewMode === 'SYNOPTIC' ? "bg-white text-blue-600 shadow-sm border border-blue-100/50" : "text-slate-400 hover:text-slate-600")}>
                  <ListOrdered className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Synoptique</span>
                </button>
                <div className="w-px h-4 bg-slate-300/50 mx-1" />
                <button onClick={() => setViewMode('SUMMARY')} className={clsx("px-4 h-full rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", viewMode === 'SUMMARY' ? "bg-white text-purple-600 shadow-sm border border-purple-100/50" : "text-slate-400 hover:text-slate-600")}>
                  <Factory className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Résultats</span>
                </button>
              </>
            )}

            {isLibrary && (
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Mode Référentiel
                </div>
            )}
          </div>

          {/* SÉLECTEUR DE SOUS-MODE (Uniquement en Synoptique) */}
          {isSystemLevel && viewMode === 'SYNOPTIC' && (
              <div className="bg-blue-50 p-1 rounded-xl border border-blue-100 flex items-center gap-1 h-10 animate-in fade-in slide-in-from-left-4">
                  <button 
                    onClick={() => setSynopticMode('PHYSICAL')}
                    className={clsx(
                        "flex items-center gap-2 px-3 h-full rounded-lg text-[9px] font-black uppercase transition-all",
                        synopticMode === 'PHYSICAL' ? "bg-blue-600 text-white shadow-md" : "text-blue-400 hover:text-blue-600"
                    )}
                  >
                    <Map className="w-3 h-3" /> Implantation
                  </button>
                  <button 
                    onClick={() => setSynopticMode('SEQUENCE')}
                    className={clsx(
                        "flex items-center gap-2 px-3 h-full rounded-lg text-[9px] font-black uppercase transition-all",
                        synopticMode === 'SEQUENCE' ? "bg-blue-600 text-white shadow-md" : "text-blue-400 hover:text-blue-600"
                    )}
                  >
                    <Layers className="w-3 h-3" /> Gamme
                  </button>
              </div>
          )}
        </div>

        {/* --- DROITE : ACTIONS --- */}
        <div className="flex items-center justify-end gap-2">
          {!isSystemLevel && !isLibrary && <div className="h-9 w-20" />}

          {isSystemLevel && (
            <>
              <button 
                onClick={() => setIsSettingsOpen(true)} 
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors" 
                title="Paramètres"
              >
                  <Settings className="w-4 h-4" />
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              <button onClick={handleGenerateOffer} disabled={isGenerating || nodes.length === 0} className="hidden lg:flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 disabled:opacity-30 transition-all">
                  {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} IA
              </button>

              <button 
                  onClick={handleSimulateStreaming} 
                  disabled={isSimulating || nodes.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50"
              >
                  {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span className="hidden xl:inline">Simuler</span>
              </button>

              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-200 disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span className="hidden xl:inline">Sauvegarder</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* --- MODALES & CONSOLE --- */}
      {isSettingsOpen && (
        <ProjectSettingsModal projectId={projectId} onClose={() => setIsSettingsOpen(false)} />
      )}

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