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
import { runProjectSummaryAction } from '@/app/actions/simulation';
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
  const searchParams = useSearchParams(); // 🚩 Le hook
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
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentView = searchParams ? searchParams.get('view') : null; // 🚩 Sécurisation

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
    // Nettoyage des nœuds pour la sauvegarde (Prisma n'a besoin que des données essentielles)
    const cleanNodes = nodes.map(n => ({
      id: n.id,
      position: n.position,
      data: n.data,
      type: n.type 
    }));

    try {
      // Appel à la Server Action optimisée (Bulk Write)
      const result = await saveGraph(currentSystemId, cleanNodes, edges, sequences);
      if (result.success) {
        toast.success(dict.ui.save);
      } else {
        // Affiche l'erreur renvoyée par le serveur (ex: "IDOR Protection")
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
        // Envoie le signal d'annulation à la requête fetch en cours
        abortControllerRef.current.abort(); 
        abortControllerRef.current = null;
        setLogs(prev => [...prev, { 
            message: "🛑 " + (locale === 'fr' ? "Arrêt manuel par l'utilisateur." : "Manual stop by user."), 
            timestamp: new Date().toLocaleTimeString() 
        }]);
        setSimStatus('error');
        setIsSimulating(false);
        toast.info("Simulation annulée");
    }
  };

  const handleSimulateStreaming = async () => {
    if (!config?.id || !currentSystemId) {
      toast.warning("Données incomplètes (Domaine ou Système manquant)");
      return;
    }

    setIsSimulating(true);
    setSimStatus('running');
    setShowConsole(true); // Ouvre la console
    setLogs([{ message: "🚀 Initialisation Quantum Engine...", timestamp: new Date().toLocaleTimeString() }]);
    setProgress(5);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {

        // Nettoyage des noeuds: Exclure les résultats de la simulation précédente
        const cleanNodes = nodes.map(n => {
            // Copie des propriétés SANS la clé 'simulationResults'
            const { simulationResults, ...cleanProps } = n.data.properties;
            return { 
                id: n.id, 
                type: n.type, 
                properties: cleanProps // <-- ENVOIE SEULEMENT LES INPUTS UTILISATEUR
            };
        });

        const payloadToSend = {
            projectId,
            domain: config.id,
            nodes: cleanNodes, // <-- Utilise la version nettoyée
            edges: edges.map(e => ({ source: e.source, target: e.target, properties: e.data })),
            sequences,
        };

        console.log("PAYLOAD FINAL ENVOYÉ À PYTHON (Inputs Nus) :", JSON.stringify(payloadToSend, null, 2));


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
        let finalData: any = null; // Pour capturer le résultat final

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
                    } else if (msg.type === 'result') {
                        finalData = msg.data; // Capture le résultat final
                        const res = msg.data;
                        console.log("DEBUG HEADER: Final Data Received from Python:", res);
                        // 🚩 Injection des résultats pour le SmartNode
                        Object.keys(res.node_details || {}).forEach(id => 
                            store.updateNodeProperties(id, { simulationResults: res.node_details[id] })
                        );
                        store.setSummaryData(res);
                        setSimStatus('success');
                        toast.success("Simulation terminée");
                    } else if (msg.type === 'error') {
                        // Si le solveur Python renvoie une erreur métier
                        throw new Error(msg.message); 
                    }
                } catch (e) { /* Ignore partial JSON ou petites erreurs */ }
            }
        }
        
        // 🚩 Une fois le stream terminé, on persiste le résultat final en base
        if (finalData) {
            // NOTE: Ceci sera remplacé par la vraie Server Action de persistance
            console.log("Persisting final simulation data...");
        }


    } catch (error: any) {
        if (error.name === 'AbortError') return; // Annulation manuelle
        setLogs(prev => [...prev, { message: `❌ ERROR: ${error.message}`, timestamp: new Date().toLocaleTimeString() }]);
        setSimStatus('error');
        toast.error("Erreur de Simulation", { description: error.message });
    } finally {
        // 🚩 TRÈS IMPORTANT : Réinitialisation propre
        setIsSimulating(false);
        abortControllerRef.current = null;
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
              <button 
                  onClick={handleSimulateStreaming} 
                  disabled={isSimulating || nodes.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50"
              >
                  {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span className="hidden xl:inline">{dict.ui.simulate}</span>
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
      <SimulationConsole isOpen={showConsole} onClose={() => setShowConsole(false)} logs={logs} progress={progress} status={simStatus} onAbort={handleAbort} />
    </>
  );
}