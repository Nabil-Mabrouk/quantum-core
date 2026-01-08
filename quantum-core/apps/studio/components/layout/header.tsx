'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { saveGraph } from '@/app/actions/graph';
import { runSimulationAction, generateProposalAction } from '@/app/actions/simulation';
import { seedCatalog } from '@/app/actions/catalog';
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
  FlaskConical
} from 'lucide-react';
import { LineSelector } from './line-selector';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from "next-auth/react"; // Côté client
import { LogOut } from "lucide-react";

interface HeaderProps {
  config: any;
  lines: any[];
  currentLineId: string;
}

export function Header({ config, lines, currentLineId }: HeaderProps) {
  const pathname = usePathname();
  const isLibrary = pathname.includes('/library');
  
  const store = useCanvasStore();
  const { nodes, edges, sequences } = store; // On récupère les séquences du store
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [results, setResults] = useState<any>(null);
  const [proposal, setProposal] = useState<string | null>(null);

  // --- LOGIQUE IA : GÉNÉRATION OFFRE ---
  const handleGenerateOffer = async () => {
    setIsGenerating(true);
    // On passe maintenant les séquences (gammes) pour que l'IA comprenne le process
    const res = await generateProposalAction(config.id, nodes, edges, sequences);
    if (res.success) setProposal(res.proposal);
    else alert("Erreur IA : " + res.error);
    setIsGenerating(false);
  };

  // --- LOGIQUE PERSISTANCE : SAUVEGARDE ---
  const handleSave = async () => {
    if (!currentLineId) return alert("Aucune ligne active");
    setIsSaving(true);
    
    const cleanNodes = nodes.map(n => ({
      id: n.id,
      position: n.position,
      data: n.data
    }));

    const result = await saveGraph(currentLineId, cleanNodes, edges, sequences);
    
    setIsSaving(false);
    if (result.success) {
        alert("Ligne et gammes sauvegardées !");
    } else {
        alert("Erreur : " + result.error);
    }
  };

  // --- LOGIQUE ENGINE : SIMULATION ---
  const handleSimulate = async () => {
    setIsSimulating(true);
    // CRUCIAL : On envoie les séquences à l'Engine pour le calcul du Drag-out
    const response = await runSimulationAction(config.id, nodes, edges, sequences);
    setIsSimulating(false);

    if (response.success) {
      setResults(response.data);
      const details = response.data.node_details;
      if (details) {
        Object.keys(details).forEach(nodeId => {
          // Mise à jour visuelle des cuves avec les concentrations calculées
          store.updateNodeProperties(nodeId, { simulationResults: details[nodeId] });
        });
      }
    } else {
      alert("Erreur Simulation : " + response.error);
    }
  };

  return (
    <>
      <header className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Logo & Titre */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">QC</div>
            <div className="hidden lg:block">
              <h1 className="text-sm font-bold leading-none text-slate-900">Quantum Core</h1>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter mt-0.5">Engineering OS</p>
            </div>
          </div>

          {/* Navigation principale */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Link 
              href="/" 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isLibrary ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutDashboard className="w-3 h-3" /> Conception
            </Link>
            <Link 
              href="/library" 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isLibrary ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FlaskConical className="w-3 h-3" /> Bibliothèque
            </Link>
          </nav>

          {!isLibrary && (
            <>
              <div className="h-8 w-px bg-slate-200 mx-2" />
              <LineSelector lines={lines} currentLineId={currentLineId} />
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => seedCatalog().then(() => alert("Base initialisée"))}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
            title="Initialiser le catalogue"
          >
            <Database className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-slate-100" />

          {!isLibrary ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleGenerateOffer} 
                disabled={isGenerating || nodes.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 disabled:opacity-30 transition-all"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Rédiger l'Offre
              </button>

              <button 
                onClick={handleSimulate} 
                disabled={isSimulating || nodes.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 disabled:opacity-30 transition-all shadow-sm"
              >
                {isSimulating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                Simuler
              </button>

              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-black disabled:opacity-30 transition-all shadow-lg shadow-slate-200"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Sauvegarder
              </button>
              <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
            </div>
          ) : (
            <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest">
              Mode Gestion de Référentiel
            </div>
          )}
        </div>
      </header>

      {/* --- OVERLAYS (Offre IA & Analyse Engine) --- */}
      {/* (Le reste du code reste inchangé par rapport à votre version précédente) */}
      {proposal && (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-2xl z-[60] border-l border-slate-200 animate-in slide-in-from-right duration-500 p-10 overflow-y-auto">
          {/* ... Contenu Proposal ... */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <FileText className="w-5 h-5" />
               </div>
               <h2 className="text-xl font-bold text-slate-900 tracking-tight">Proposition Technique IA</h2>
            </div>
            <button onClick={() => setProposal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
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
          <button className="w-full mt-12 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl">
            Générer le document PDF
          </button>
        </div>
      )}

      {results && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-6 animate-in slide-in-from-bottom-12 duration-700">
          <div className="bg-white border-2 border-slate-900 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden ring-8 ring-slate-900/5">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center px-8">
               <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em]">
                  <BarChart3 className="w-4 h-4 text-blue-400" /> Performance & Dimensionnement
               </div>
               <button onClick={() => setResults(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <div className="p-8 grid grid-cols-3 gap-6 bg-white">
               {results.kpis?.map((kpi: any, i: number) => (
                 <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:border-blue-200 transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-400">{kpi.label}</p>
                    <p className={`text-2xl font-black ${kpi.color || 'text-slate-900'}`}>
                        {kpi.value} <span className="text-xs font-bold text-slate-400 ml-1">{kpi.unit}</span>
                    </p>
                 </div>
               ))}
            </div>
            {results.warnings?.length > 0 && (
              <div className="px-8 pb-8">
                <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                   <div className="flex items-center gap-2 text-orange-700 font-black text-[10px] uppercase tracking-widest mb-3">
                      ⚠️ Alertes Ingénierie
                   </div>
                   <ul className="space-y-2">
                      {results.warnings.map((w: string, i: number) => (
                        <li key={i} className="text-xs text-orange-800 leading-tight flex gap-3">
                          <span className="shrink-0 text-orange-300">●</span> {w}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}