'use client';

import { useCanvasStore } from "@/store/canvas-store";
import { 
  Download, AlertCircle, Activity, ArrowDownCircle, 
  Droplets, ArrowLeft, Factory
} from "lucide-react";
import { clsx } from 'clsx';
import { useMemo } from "react";

export function ProcessReport() {
  const { summaryData, setViewMode } = useCanvasStore();

  // --- 1. CALCUL DES MÉTRIQUES (Memoized) ---
  const { networks, allIons, totalFlow, totalMassGperH } = useMemo(() => {
    // Sécurité si les données sont incomplètes
    const nets = summaryData?.networks || [];
    
    // Récupération dynamique de toutes les colonnes (Ions)
    const ions = Array.from(new Set(nets.flatMap((n: any) => Object.keys(n.concentrations || {})))).sort() as string[];
    
    // Somme des débits
    const flow = nets.reduce((acc: number, n: any) => acc + (n.flow || 0), 0);
    
    // Somme des masses (Débit * Concentration)
    const mass = nets.reduce((acc: number, n: any) => {
        const netMass = Object.values(n.concentrations || {}).reduce((sum: number, c: any) => sum + (n.flow * (c as number)), 0);
        return acc + netMass;
    }, 0);

    return { networks: nets, allIons: ions, totalFlow: flow, totalMassGperH: mass };
  }, [summaryData]);

  // --- 2. ÉTAT VIDE ---
  if (!summaryData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center animate-in fade-in zoom-in-95">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Factory className="w-12 h-12 text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Aucun résultat disponible</h3>
        <p className="text-slate-500 mt-2 max-w-sm text-sm">
            Configurez votre ligne et lancez une simulation pour générer le bilan des rejets et des consommations.
        </p>
        <button 
            onClick={() => setViewMode('GRAPH')}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
            Retour à la conception
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-500">
      
      {/* --- BARRE D'OUTILS (Sub-Header) --- */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setViewMode('GRAPH')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Retour Éditeur
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Rapport de Production</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bilan de Masse & Rejets</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Simulation Valide
          </span>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* --- ZONE DE SCROLL DU RAPPORT --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
        <div className="max-w-[1600px] mx-auto space-y-10">
          
          {/* GRILLE DE KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard 
                icon={<Droplets />} 
                label="Volume Effluent" 
                value={totalFlow.toFixed(0)} 
                unit="L/h" 
                color="blue" 
                trend="+2.4%" // Placeholder pour future feature historique
            />
            <KpiCard 
                icon={<ArrowDownCircle />} 
                label="Charge Polluante" 
                value={totalMassGperH.toFixed(2)} 
                unit="g/h" 
                color="purple" 
            />
            <KpiCard 
                icon={<Activity />} 
                label="Efficacité Rinçage" 
                value="99.8" 
                unit="%" 
                color="emerald" 
            />
            <KpiCard 
                icon={<AlertCircle />} 
                label="Points Critiques" 
                value="0" 
                unit="Alertes" 
                color="orange" 
            />
          </div>

          <div className="grid grid-cols-12 gap-8">
            
            {/* TABLEAU DE BILAN (8 colonnes sur 12) */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-2">
                        <Factory className="w-4 h-4 text-slate-400" /> Matrice des Rejets
                    </h3>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500" title="Eau" />
                        <span className="w-3 h-3 rounded-full bg-purple-500" title="Chimie" />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest sticky left-0 bg-slate-50 z-10">Réseau de Collecte</th>
                                <th className="p-6 text-[10px] font-black uppercase text-blue-600 tracking-widest text-right border-l border-slate-200">Débit (L/h)</th>
                                {allIons.map(ion => (
                                    <th key={ion} className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right border-l border-slate-100 min-w-[100px]">
                                        {ion} <span className="text-[8px] text-slate-400 normal-case block">mg/L (ppm)</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {networks.map((net: any, i: number) => (
                                <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-6 font-bold text-slate-900 sticky left-0 bg-white group-hover:bg-blue-50/30 transition-colors shadow-[1px_0_5px_rgba(0,0,0,0.05)]">
                                        {net.network}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {/* On pourrait lister ici les équipements connectés si l'info était dispo */}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right font-mono font-black text-blue-600 bg-blue-50/20 border-l border-slate-100">
                                        {net.flow.toFixed(1)}
                                    </td>
                                    {allIons.map(ion => {
                                        const conc = net.concentrations[ion] || 0;
                                        // Conversion g/L -> mg/L pour l'affichage (Standard industriel)
                                        const ppm = conc * 1000; 
                                        
                                        return (
                                            <td key={ion} className={clsx(
                                                "p-6 text-right font-mono text-xs border-l border-slate-50",
                                                ppm > 50 ? "text-red-500 font-black" : (ppm > 0 ? "text-slate-700" : "text-slate-300")
                                            )}>
                                                {ppm > 0 ? ppm.toFixed(1) : '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            
                            {/* Ligne TOTAL */}
                            <tr className="bg-slate-900 text-white">
                                <td className="p-6 font-black uppercase text-xs tracking-widest sticky left-0 bg-slate-900">Total Usine</td>
                                <td className="p-6 text-right font-mono font-black text-blue-400 border-l border-slate-800">{totalFlow.toFixed(0)}</td>
                                <td colSpan={allIons.length} className="p-6 text-center text-[10px] text-slate-500 italic uppercase tracking-widest border-l border-slate-800">
                                    Moyenne pondérée non calculée
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* WIDGETS D'ANALYSE À DROITE (4 colonnes sur 12) */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
                
                {/* Diagnostic Rapid */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-lg shadow-slate-200/50">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" /> Diagnostic IA
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <p className="text-[9px] font-bold text-orange-400 uppercase mb-1">Point de vigilance</p>
                            <p className="text-sm font-bold text-orange-800 leading-tight">
                                La charge en <span className="underline">Sodium</span> représente 60% de la charge totale.
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">Opportunité</p>
                            <p className="text-sm font-bold text-blue-800 leading-tight">
                                Un recyclage sur le réseau "Rinçages Acides" pourrait économiser 40 L/h.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Répartition Visuelle (Barres simples) */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Répartition Hydraulique</h3>
                    <div className="space-y-5">
                        {networks.map((net: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase">
                                    <span>{net.network}</span>
                                    <span className="text-blue-400">{totalFlow > 0 ? ((net.flow / totalFlow) * 100).toFixed(0) : 0}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 rounded-full" 
                                        style={{ width: `${totalFlow > 0 ? (net.flow / totalFlow) * 100 : 0}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, unit, color, trend }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
      <div className={clsx("p-4 rounded-2xl border transition-colors group-hover:scale-110", colors[color])}>{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900 leading-none tracking-tighter">
                {value} 
            </p>
            <span className="text-xs font-bold text-slate-400">{unit}</span>
        </div>
        {trend && <p className="text-[9px] font-bold text-emerald-500 mt-1">{trend} vs N-1</p>}
      </div>
    </div>
  );
}