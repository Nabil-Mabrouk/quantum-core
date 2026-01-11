'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { saveGraph } from '@/app/actions/graph';
import { 
  runSimulationAction, 
  generateProposalAction, 
  runProjectSummaryAction 
} from '@/app/actions/simulation';
import { seedCatalog } from '@/app/actions/catalog';
import { seedH2OLibrary } from '@/app/actions/seed-h2o';
import { useState } from 'react';
import { 
  Save, 
  Loader2, 
  Play, 
  BarChart3, 
  X, 
  FileText, 
  Sparkles, 
  Database,
  LayoutDashboard,
  FlaskConical,
  Network, 
  ListOrdered,
  Factory,
  Settings, // Ajout de l'icône
  LogOut
} from 'lucide-react';
import { LineSelector } from './line-selector';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from "next-auth/react";
import { ProjectSettingsModal } from './project-settings-modal';

interface HeaderProps {
  config: any;
  lines: any[];
  currentLineId: string;
  projectId: string;
}

export function Header({ config, lines, currentLineId, projectId }: HeaderProps) {
  const pathname = usePathname();
  const isLibrary = pathname.includes('/library');
  
  const store = useCanvasStore();
  const { nodes, edges, sequences, viewMode, setViewMode, setSummaryData } = store;
  
  // --- ÉTATS DE CHARGEMENT ---
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  // --- ÉTATS UI ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 
  const [results, setResults] = useState<any>(null);
  const [proposal, setProposal] = useState<string | null>(null);

  // --- ACTIONS ---

  const handleGenerateOffer = async () => {
    setIsGenerating(true);
    const res = await generateProposalAction(config.id, nodes, edges, sequences);
    if (res.success) setProposal(res.proposal);
    else alert("Erreur IA : " + res.error);
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!currentLineId) return alert("Aucune ligne active");
    setIsSaving(true);
    const cleanNodes = nodes.map(n => ({
      id: n.id,
      position: n.position,
      data: n.data,
      type: n.type // Crucial pour React Flow
    }));
    const result = await saveGraph(currentLineId, cleanNodes, edges, sequences);
    setIsSaving(false);
    if (result.success) alert("Sauvegarde réussie !");
    else alert("Erreur : " + result.error);
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    const response = await runSimulationAction(config.id, nodes, edges, sequences);
    setIsSimulating(false);

    if (response.success) {
      setResults(response.data);
      const details = response.data.node_details;
      if (details) {
        Object.keys(details).forEach(nodeId => {
          store.updateNodeProperties(nodeId, { simulationResults: details[nodeId] });
        });
      }
    } else {
      alert("Erreur Simulation : " + response.error);
    }
  };

  const handleProjectSummary = async () => {
    if (!projectId) return alert("Aucun projet actif");
    setIsSummarizing(true);
    const result = await runProjectSummaryAction(projectId);
    if (result.success) {
      setSummaryData(result.data);
      setViewMode('SUMMARY');
    } else {
      alert("Erreur Bilan Usine : " + result.error);
    }
    setIsSummarizing(false);
  };

  return (
    <>
      <header className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">QC</div>
            <div className="hidden lg:block">
              <h1 className="text-sm font-bold leading-none text-slate-900">Quantum Core</h1>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter mt-0.5">Engineering OS</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Link 
              href="/" 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isLibrary ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              <LayoutDashboard className="w-3 h-3" /> Conception
            </Link>
            <Link 
              href="/library" 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isLibrary ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              <FlaskConical className="w-3 h-3" /> Bibliothèque
            </Link>
          </nav>

          {!isLibrary && (
            <>
              <div className="h-8 w-px bg-slate-200 mx-2" />
              <LineSelector lines={lines} currentLineId={currentLineId} projectId={projectId} />
              
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setViewMode('GRAPH')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'GRAPH' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                  title="Vue Graphe"
                >
                  <Network className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('SYNOPTIC')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'SYNOPTIC' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                  title="Vue Synoptique"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleProjectSummary}
                  disabled={isSummarizing}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'SUMMARY' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'}`}
                >
                  {isSummarizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Factory className="w-3 h-3" />}
                  Bilan Usine
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Outils d'administration / Data */}
          <button 
            onClick={() => seedCatalog().then(() => alert("Matériel importé"))}
            className="p-2 text-slate-400 hover:text-slate-900"
            title="Seed Catalogue Matériel"
          >
            <Database className="w-4 h-4" />
          </button>
          <button 
            onClick={() => seedH2OLibrary().then(() => alert("Ions & Chimie importés"))}
            className="p-2 text-blue-500 hover:text-blue-700"
            title="Seed Chimie H2O"
          >
            <FlaskConical className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-slate-100 mx-1" />

          {!isLibrary ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                title="Paramètres de l'usine"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button 
                onClick={handleGenerateOffer} 
                disabled={isGenerating || nodes.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 disabled:opacity-30"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Rédiger Offre
              </button>

              <button 
                onClick={handleSimulate} 
                disabled={isSimulating || nodes.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100"
              >
                {isSimulating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                Simuler
              </button>

              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-black disabled:opacity-30 shadow-lg"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Sauvegarder
              </button>
              
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-slate-400 hover:text-red-500"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest">
              Mode Référentiel
            </div>
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

      {/* --- OVERLAY PROPOSAL --- */}
      {proposal && (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-2xl z-[60] border-l border-slate-200 animate-in slide-in-from-right duration-500 p-10 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <FileText className="w-5 h-5" />
               </div>
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">Proposition IA</h2>
            </div>
            <button onClick={() => setProposal(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-6 h-6" />
            </button>
          </div>
          <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed">
            {proposal.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('###') ? "text-lg font-bold text-slate-900 border-b pb-2 mb-4 mt-8" : ""}>
                {line.replace('###', '')}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* --- OVERLAY RÉSULTATS SIMULATION --- */}
      {results && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-6 animate-in slide-in-from-bottom-12 duration-700">
          <div className="bg-white border-2 border-slate-900 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center px-8">
               <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em]">
                  <BarChart3 className="w-4 h-4 text-blue-400" /> Résultats de Simulation
               </div>
               <button onClick={() => setResults(null)} className="p-1 hover:bg-white/10 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <div className="p-8 grid grid-cols-3 gap-6 bg-white">
               {results.kpis?.map((kpi: any, i: number) => (
                 <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{kpi.label}</p>
                    <p className={`text-2xl font-black ${kpi.color || 'text-slate-900'}`}>
                        {kpi.value} <span className="text-xs font-bold text-slate-400 ml-1">{kpi.unit}</span>
                    </p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}