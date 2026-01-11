'use client';

import { useCanvasStore } from "@/store/canvas-store";
import { 
  Download, Waves, AlertCircle, Activity, ArrowDownCircle, 
  Droplets, FileBarChart, PieChart, ArrowLeft
} from "lucide-react";
import { clsx } from 'clsx';
import { useMemo } from "react";

export function AnalysisReport() {
  const { summaryData, nodes, setViewMode } = useCanvasStore();
  if (!summaryData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Factory className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Aucun bilan disponible</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
            Veuillez lancer une simulation pour calculer les flux massiques et générer le rapport environnemental.
        </p>
      </div>
    );
  }

  const { networks, allIons, totalFlow, totalMassGperH } = useMemo(() => {
    const nets = summaryData?.networks || [];
    const ions = Array.from(new Set(nets.flatMap((n: any) => Object.keys(n.concentrations || {})))).sort();
    const flow = nets.reduce((acc: number, n: any) => acc + n.flow, 0);
    const mass = nets.reduce((acc: number, n: any) => {
        const netMass = Object.values(n.concentrations || {}).reduce((sum: number, c: any) => sum + (n.flow * (c as number)), 0);
        return acc + netMass;
    }, 0);
    return { networks: nets, allIons: ions, totalFlow: flow, totalMassGperH: mass };
  }, [summaryData]);

  if (!summaryData) return null;

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-500">
      
      {/* --- BARRE D'OUTILS BILAN (Sub-Header) --- */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setViewMode('GRAPH')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Retour Éditeur
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Rapport de Simulation Global</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
            Statut : Équilibre Atteint
          </span>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* --- ZONE DE SCROLL DU RAPPORT --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto p-10 space-y-10">
          
          {/* GRILLE DE KPIs GÉANTE (Exploitation de la largeur) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KpiCard icon={<Droplets />} label="Eau Totale" value={totalFlow.toFixed(0)} unit="L/h" color="blue" />
            <KpiCard icon={<ArrowDownCircle />} label="Masse Polluante" value={totalMassGperH.toFixed(2)} unit="g/h" color="purple" />
            <KpiCard icon={<Activity />} label="Efficience" value="94.2" unit="%" color="emerald" />
            <KpiCard icon={<AlertCircle />} label="Alertes" value="2" unit="Critiques" color="orange" />
          </div>

          <div className="grid grid-cols-12 gap-8">
            
            {/* TABLEAU DE BILAN (8 colonnes sur 12) */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Matrice des Flux de Pollution</h3>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="w-3 h-3 rounded-full bg-purple-500" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 border-b">Réseau</th>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 border-b text-right">Débit (L/h)</th>
                                {allIons.map(ion => (
                                    <th key={ion} className="p-6 text-[10px] font-black uppercase text-slate-400 border-b text-right">{ion} (g/h)</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {networks.map((net: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-bold text-slate-900">{net.network}</td>
                                    <td className="p-6 text-right font-mono font-bold text-blue-600">{net.flow.toFixed(1)}</td>
                                    {allIons.map(ion => {
                                        const mass = net.flow * (net.concentrations[ion] || 0);
                                        return (
                                            <td key={ion} className={clsx(
                                                "p-6 text-right font-mono text-xs",
                                                mass > 10 ? "text-purple-600 font-black" : "text-slate-400"
                                            )}>
                                                {mass > 0 ? mass.toFixed(2) : '0.00'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* WIDGETS D'ANALYSE À DROITE (4 colonnes sur 12) */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
                
                {/* Diagnostic Rapid */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                    <h3 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Diagnostic
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Concentration Max</p>
                            <p className="text-xl font-black">Zinc (Zn++) <span className="text-blue-400">12.5 g/L</span></p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Point de vigilance</p>
                            <p className="text-sm font-bold text-orange-200 leading-tight">Le débit du Réseau Acide dépasse 80% de sa capacité nominale.</p>
                        </div>
                    </div>
                </div>

                {/* Graphique de répartition simplifié */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Volume par réseau</h3>
                    <div className="space-y-4">
                        {networks.map((net: any, i: number) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-[9px] font-black uppercase">
                                    <span>{net.network}</span>
                                    <span>{((net.flow / totalFlow) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(net.flow / totalFlow) * 100}%` }} />
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

function KpiCard({ icon, label, value, unit, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-5 shadow-sm">
      <div className={clsx("p-4 rounded-2xl", colors[color])}>{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 leading-none">
            {value} <span className="text-xs font-bold text-slate-300 ml-1">{unit}</span>
        </p>
      </div>
    </div>
  );
}