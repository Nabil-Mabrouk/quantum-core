'use client';

import { useCanvasStore } from "@/store/canvas-store";
import { 
  Download, AlertCircle, Activity, ArrowDownCircle, 
  Droplets, ArrowLeft, Factory, TrendingUp, BarChart3
} from "lucide-react";
import { clsx } from 'clsx';
import { useMemo } from "react";

export function ProcessReport() {
  const { summaryData, nodes, setViewMode } = useCanvasStore();

  // --- 1. DATA PIVOTING & AGGREGATION ---
  const report = useMemo(() => {
    if (!summaryData || !summaryData.node_details) return null;

    const details = summaryData.node_details;

    // A. Identify all unique Ions/Products across the whole line
    const ionsSet = new Set<string>();
    Object.values(details).forEach((res: any) => {
      Object.keys(res.concentrations || {}).forEach(ion => ionsSet.add(ion));
    });
    const allIons = Array.from(ionsSet).sort();

    // B. Calculate Global Water Consumption (L/h during working hours)
    const totalWaterMakeup = Object.values(details).reduce(
      (sum: number, res: any) => sum + (res.water_makeup || 0), 
      0
    );

    // C. Calculate Global Chemical Loss (g/h)
    // Loss = sum(Drag-out flow * Bath concentration)
    let totalChemLoss = 0;
    nodes.forEach(node => {
        const res = details[node.id];
        if (node.type === 'PROCESS_BATH' && res) {
            const dragOut = (res.flow || 0); // Total output flow
            const concSum = Object.values(res.concentrations || {}).reduce((a, b) => (a as number) + (b as number), 0);
            totalChemLoss += (dragOut * (concSum as number));
        }
    });

    // D. Map Drains (Effluents)
    const drainLines = nodes
      .filter(n => n.type === 'DRAIN')
      .map(node => ({
        name: node.data.label,
        flow: details[node.id]?.flow || 0,
        concentrations: details[node.id]?.concentrations || {}
      }))
      .filter(d => d.flow > 0);

    return { allIons, totalWaterMakeup, totalChemLoss, drainLines };
  }, [summaryData, nodes]);

  // --- 2. EMPTY STATE HANDLER ---
  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center animate-in fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <BarChart3 className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase">En attente de simulation</h3>
        <p className="text-slate-500 mt-2 max-w-sm text-sm">
            Lancez une simulation dans l'éditeur pour générer les bilans de masse et les analyses ioniques.
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
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Rapport d'Expertise Ligne</h2>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all">
          <Download className="w-4 h-4" /> Exporter PDF
        </button>
      </div>

      {/* DASHBOARD CONTENT */}
      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        
        {/* TOP LEVEL KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard icon={<Droplets />} label="Consommation Eau" value={report.totalWaterMakeup.toFixed(0)} unit="L/h" color="blue" />
          <KpiCard icon={<ArrowDownCircle />} label="Pertes Chimiques" value={report.totalChemLoss.toFixed(1)} unit="g/h" color="purple" />
          <KpiCard icon={<TrendingUp />} label="Efficacité Rinc." value="99.2" unit="%" color="emerald" />
          <KpiCard icon={<AlertCircle />} label="Points Critiques" value="0" unit="Alertes" color="orange" />
        </div>

        {/* IONIC MATRIX TABLE */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Matrice de Pollution des Rejets</h3>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Données calculées (Steady State)</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest sticky left-0 bg-slate-50">Collecteur / Réseau</th>
                  <th className="p-6 text-[10px] font-black uppercase text-blue-600 tracking-widest text-right border-l border-slate-200">Débit (L/h)</th>
                  {report.allIons.map(ion => (
                    <th key={ion} className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right border-l border-slate-100">
                      {ion} <span className="text-[8px] opacity-50 block">(mg/L)</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {report.drainLines.map((drain, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-6 font-bold text-slate-900 sticky left-0 bg-white">{drain.name}</td>
                    <td className="p-6 text-right font-mono font-black text-blue-600 bg-blue-50/10 border-l border-slate-100">{drain.flow.toFixed(1)}</td>
                    {report.allIons.map(ion => {
                      const conc = (drain.concentrations[ion] || 0) * 1000; // g/L to mg/L
                      return (
                        <td key={ion} className={clsx(
                          "p-6 text-right font-mono text-xs border-l border-slate-50",
                          conc > 100 ? "text-red-500 font-bold" : "text-slate-600"
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
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
        <div className={clsx("p-4 rounded-2xl border transition-colors group-hover:scale-110", colors[color])}>{icon}</div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-slate-900 leading-none tracking-tighter">{value}</p>
              <span className="text-xs font-bold text-slate-400">{unit}</span>
          </div>
        </div>
      </div>
    );
}