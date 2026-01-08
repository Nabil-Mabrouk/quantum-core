'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { saveGraph } from '@/app/actions/graph';
import { runSimulationAction } from '@/app/actions/simulation'; // <--- Import de l'action
import { currentConfig } from '@/lib/domain-config'; // <--- Import de la config pour le domaine
import { useState } from 'react';
import { Save, Loader2, Play, BarChart3, X } from 'lucide-react';
import { seedCatalog } from '@/app/actions/catalog';
import { FileText, Sparkles } from 'lucide-react';
import { generateProposalAction } from '@/app/actions/simulation';

export function Header() {
  const { projectId, nodes, edges } = useCanvasStore();
  
  // États de chargement distincts
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // État pour stocker les résultats de Python
  const [results, setResults] = useState<any>(null);
  const [proposal, setProposal] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateOffer = async () => {
    setIsGenerating(true);
    const res = await generateProposalAction(currentConfig.id, nodes, edges);
    if (res.success) {
      setProposal(res.proposal);
    } else {
      alert("Erreur durant la génération : " + res.error);
    }
    setIsGenerating(false);
  };


  // --- LOGIQUE SAUVEGARDE ---
  const handleSave = async () => {
    if (!projectId) return alert("Aucun projet chargé");
    setIsSaving(true);
    
    const cleanNodes = nodes.map(n => ({
      id: n.id,
      position: n.position,
      data: n.data
    }));

    const result = await saveGraph(projectId, { nodes: cleanNodes, edges });
    
    setIsSaving(false);
    if (result.success) alert("Projet sauvegardé en base !");
    else alert("Erreur : " + result.error);
  };

  // --- LOGIQUE SIMULATION ---
  const handleSimulate = async () => {
    setIsSimulating(true);
    // On envoie le domaine actuel (WATER), les noeuds et les liens
    const response = await runSimulationAction(currentConfig.id, nodes, edges);
    
    setIsSimulating(false);

    if (response.success) {
      setResults(response.data);
    } else {
      alert("Erreur de simulation : " + response.error);
    }
  };

  return (
    <>
      <header className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-inner">QC</div>
          <div>
            <h1 className="text-sm font-bold leading-none">Quantum Core Studio</h1>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mt-0.5">Engineering Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button 
            onClick={handleGenerateOffer}
            disabled={isGenerating || nodes.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded-md hover:bg-purple-100 transition-all"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Rédiger l'Offre
          </button>

            <button onClick={() => seedCatalog().then(() => alert("Catalogue rempli !"))}>
            Initialiser Catalogue
            </button>

          {/* BOUTON SIMULER */}
          <button 
            onClick={handleSimulate}
            disabled={isSimulating || nodes.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-md hover:bg-blue-100 disabled:opacity-50 transition-all shadow-sm"
          >
            {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            Simuler
          </button>

          <div className="w-px h-6 bg-slate-100 mx-1" />

          {/* BOUTON SAUVEGARDER */}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Sauvegarder
          </button>
        </div>
      </header>

      {/* PANNEAU DE L'OFFRE IA (Slide-over à droite) */}
      {proposal && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-[60] border-l border-slate-200 animate-in slide-in-from-right duration-300 p-8 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <FileText className="text-purple-600" /> Offre IA
            </h2>
            <button onClick={() => setProposal(null)} className="text-slate-400">×</button>
          </div>
          
          <div className="prose prose-slate text-sm leading-relaxed">
            {proposal.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('###') ? "text-lg font-bold mt-4" : ""}>
                {line.replace('###', '')}
              </p>
            ))}
          </div>

          <button className="w-full mt-8 bg-slate-900 text-white p-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
            Exporter en PDF
          </button>
        </div>
      )}






      {/* PANNEAU DE RÉSULTATS (Apparaît en bas quand Python répond) */}
      {results && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white border-2 border-blue-500 rounded-2xl shadow-2xl overflow-hidden ring-4 ring-blue-500/10">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
               <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                  <BarChart3 className="w-4 h-4 text-blue-400" /> Analyse du Système
               </div>
               <button onClick={() => setResults(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="p-6 grid grid-cols-3 gap-4 bg-white">
               {results.kpis?.map((kpi: any, i: number) => (
                 <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                    <p className={`text-2xl font-black text-${kpi.color || 'blue-600'}`}>
                        {kpi.value} <span className="text-xs font-bold text-slate-400">{kpi.unit}</span>
                    </p>
                 </div>
               ))}
            </div>

            {results.warnings?.length > 0 && (
              <div className="px-6 pb-6">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                   <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase mb-2">
                      ⚠️ Alertes de configuration
                   </div>
                   <ul className="space-y-1.5">
                      {results.warnings.map((w: string, i: number) => (
                        <li key={i} className="text-[11px] text-amber-800 leading-tight flex gap-2">
                          <span className="shrink-0">•</span> {w}
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