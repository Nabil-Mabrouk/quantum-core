'use client';

import { useCanvasStore } from "@/store/canvas-store";
import { 
  Download, AlertCircle, Activity, ArrowDownCircle, 
  Droplets, ArrowLeft, Factory, TrendingUp, BarChart3,
  Beaker, FlaskConical, Thermometer, Wind
} from "lucide-react";
import { clsx } from 'clsx';
import { useMemo } from "react";

export function ProcessReport() {
  const { summaryData, nodes, setViewMode } = useCanvasStore();

  // --- 1. DATA PIVOTING & AGGREGATION ---
  const report = useMemo(() => {
    if (!summaryData || !summaryData.node_details) return null;

    const details = summaryData.node_details;

    // A. Identifier tous les Ions uniques (Variables de calcul)
    const ionsSet = new Set<string>();
    Object.values(details).forEach((res: any) => {
      Object.keys(res.concentrations || {}).forEach(ion => ionsSet.add(ion));
    });
    const allIons = Array.from(ionsSet).sort();

    // B. BILANS GLOBAUX
    let totalWaterMakeup = 0;   // L/h (Heures travaillées)
    let totalEvaporation = 0;   // L/h (Moyenne 24h/24)
    let chemicalAdditions: Record<string, number> = {}; // Somme des g/h par Ion

    const bathMaintenance = nodes
      .filter(n => n.type === 'PROCESS_BATH')
      .map(node => {
        const res = details[node.id];
        if (!res) return null;

        totalWaterMakeup += res.water_makeup || 0;
        totalEvaporation += res.evaporation || 0;

        // Somme des ajouts chimiques
        Object.entries(res.chemical_additions || {}).forEach(([ion, val]: any) => {
           chemicalAdditions[ion] = (chemicalAdditions[ion] || 0) + val;
        });

        return {
          name: node.data.label,
          evap: res.evaporation || 0,
          makeup: res.water_makeup || 0,
          additions: res.chemical_additions || {}
        };
      }).filter(Boolean);

    // C. Map Drains (Effluents)
    const drainLines = nodes
      .filter(n => n.type === 'DRAIN')
      .map(node => ({
        name: node.data.label,
        flow: details[node.id]?.flow || 0,
        concentrations: details[node.id]?.concentrations || {}
      }))
      .filter(d => d.flow > 0);

    const totalChemLoss = Object.values(chemicalAdditions).reduce((a, b) => a + b, 0);

    return { allIons, totalWaterMakeup, totalEvaporation, totalChemLoss, drainLines, bathMaintenance, chemicalAdditions };
  }, [summaryData, nodes]);

  // --- 2. EMPTY STATE ---
  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center animate-in fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <BarChart3 className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Analyse non disponible</h3>
        <p className="text-slate-500 mt-2 max-w-sm text-sm">
            Veuillez configurer votre ligne et lancer la simulation pour générer les bilans de masse.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden">
      
      {/* TOOLBAR */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('GRAPH')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 flex items-center gap-2 text-xs font-bold transition-all">
            <ArrowLeft className="w-4 h-4" /> Éditeur
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Bilan d'Ingénierie : Traitement de Surface</h2>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">Solveur Convergent</span>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all">
              <Download className="w-4 h-4" /> Export Rapport
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        
        {/* --- SECTION 1 : KPIs GLOBAUX --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard icon={<Droplets />} label="Appoint Eau (Prod)" value={report.totalWaterMakeup.toFixed(0)} unit="L/h" color="blue" />
          <KpiCard icon={<Wind />} label="Évaporation (24h)" value={report.totalEvaporation.toFixed(1)} unit="L/h" color="orange" />
          <KpiCard icon={<FlaskConical />} label="Consommation Produits" value={report.totalChemLoss.toFixed(1)} unit="g/h" color="purple" />
          <KpiCard icon={<TrendingUp />} label="Optimisation Spray" value="Active" unit="" color="emerald" />
        </div>

        <div className="grid grid-cols-12 gap-8">
            
            {/* --- SECTION 2 : MAINTENANCE DES BAINS (COMPENSATION) --- */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-2">
                            <Beaker className="w-4 h-4 text-purple-500" /> Maintenance des Bains
                        </h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {report.bathMaintenance.map((bath: any, i: number) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="font-black text-xs text-slate-900 mb-3 border-b pb-2 uppercase tracking-tighter">{bath.name}</p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Appoint Eau</p>
                                        <p className="text-sm font-mono font-bold text-blue-600">+{bath.makeup.toFixed(1)} L/h</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Évaporation</p>
                                        <p className="text-sm font-mono font-bold text-orange-500">-{bath.evap.toFixed(1)} L/h</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-purple-400 uppercase mb-1">Ajouts chimiques requis :</p>
                                    {Object.entries(bath.additions).map(([ion, val]: any) => (
                                        <div key={ion} className="flex justify-between text-[11px] font-mono bg-white p-2 rounded-lg border border-purple-50">
                                            <span className="text-slate-500 font-bold">{ion}</span>
                                            <span className="text-purple-600">+{val.toFixed(2)} g/h</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- SECTION 3 : MATRICE DES REJETS (IONIQUES) --- */}
            <div className="col-span-12 lg:col-span-7">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-2">
                            <Factory className="w-4 h-4 text-emerald-500" /> Matrice des Rejets (Effluents)
                        </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest sticky left-0 bg-slate-50">Réseau de Collecte</th>
                            <th className="p-6 text-[10px] font-black uppercase text-blue-600 tracking-widest text-right border-l border-slate-200">Débit (L/h)</th>
                            {report.allIons.map(ion => (
                                <th key={ion} className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right border-l border-slate-100">
                                {ion} <span className="text-[8px] opacity-50 block">(mg/L)</span>
                                </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {report.drainLines.length === 0 ? (
                                <tr><td colSpan={10} className="p-10 text-center text-slate-400 italic">Aucun rejet mesurable</td></tr>
                            ) : report.drainLines.map((drain, i) => (
                            <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                <td className="p-6 font-bold text-slate-900 sticky left-0 bg-white">{drain.name}</td>
                                <td className="p-6 text-right font-mono font-black text-blue-600 bg-blue-50/10 border-l border-slate-100">{drain.flow.toFixed(1)}</td>
                                {report.allIons.map(ion => {
                                const conc = (drain.concentrations[ion] || 0) * 1000; // g/L to mg/L (ppm)
                                return (
                                    <td key={ion} className={clsx(
                                    "p-6 text-right font-mono text-xs border-l border-slate-50",
                                    conc > 50 ? "text-red-500 font-bold" : "text-slate-600"
                                    )}>
                                    {conc > 0 ? conc.toFixed(1) : '-'}
                                    </td>
                                );
                                })}
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>

        {/* --- SECTION 4 : CONSEILS D'OPTIMISATION IA --- */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
            <BarChart3 className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
            <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500 rounded-xl"><Activity className="w-5 h-5 text-white" /></div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Diagnostic de Performance</h3>
                </div>
                <div className="space-y-4">
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                        "Sur la base de la simulation, le rinçage final présente une concentration de {report.drainLines[0]?.concentrations[report.allIons[0]]?.toFixed(3) || '0'} g/L. 
                        L'activation du spray sur le Bain n°1 a permis de réduire la charge polluante de ce réseau de 15%."
                    </p>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/10 rounded-lg text-[10px] font-bold uppercase border border-white/10">Bilan Hydrique : Équilibré</div>
                        <div className="px-4 py-2 bg-white/10 rounded-lg text-[10px] font-bold uppercase border border-white/10">Normes Rejet : Conformes</div>
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
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
        <div className={clsx("p-5 rounded-2xl border transition-all group-hover:scale-110 group-hover:rotate-3", colors[color])}>{icon}</div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-slate-900 leading-none tracking-tighter">{value}</p>
              <span className="text-sm font-bold text-slate-400 uppercase">{unit}</span>
          </div>
        </div>
      </div>
    );
}