'use client';

import { useCanvasStore } from "@/store/canvas-store";
import { Download, Factory, Activity, Beaker, Waves } from "lucide-react";
import { clsx } from 'clsx';

export function AnalysisReport() {
  const summaryData = useCanvasStore(state => state.summaryData);
  if (!summaryData) return <div className="p-20 text-center text-slate-400">Lancez un "Bilan Usine" pour voir les résultats.</div>;

  const networks = summaryData.networks || [];
  
  // Extraire la liste unique des ions présents dans tous les réseaux
  const allIons = Array.from(new Set(networks.flatMap((n:any) => Object.keys(n.concentrations || {})))).sort();

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bilan Environnemental</h2>
          <p className="text-slate-500 italic">Flux massiques cumulés vers la station d'épuration.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20">
          <Download className="w-4 h-4 mr-2 inline" /> Export Dossier Technique
        </button>
      </div>

      {/* TABLEAU CROISÉ RÉSEAUX / IONS */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Réseau de Collecte</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Débit (L/h)</th>
                {allIons.map(ion => (
                  <th key={ion} className="p-6 text-[10px] font-black uppercase tracking-widest text-right border-l border-white/10">
                    {ion} (g/h)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {networks.map((net: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Waves className="w-4 h-4" /></div>
                      <span className="font-black text-slate-800">{net.network}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right font-mono font-bold text-blue-600 bg-blue-50/30">
                    {net.flow.toFixed(1)}
                  </td>
                  {allIons.map(ion => {
                    const mass = (net.flow * (net.concentrations[ion] || 0)) / 1000;
                    return (
                      <td key={ion} className={clsx(
                        "p-6 text-right font-mono text-xs border-l border-slate-100",
                        mass > 0 ? "text-slate-900 font-bold" : "text-slate-300"
                      )}>
                        {mass > 0 ? mass.toFixed(3) : '0.000'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-black">
               <tr>
                 <td className="p-6 uppercase text-[10px]">Total Site</td>
                 <td className="p-6 text-right text-blue-600">
                    {networks.reduce((acc:number, n:any) => acc + n.flow, 0).toFixed(1)}
                 </td>
                 {allIons.map(ion => {
                    const totalMass = networks.reduce((acc:number, n:any) => acc + (n.flow * (n.concentrations[ion] || 0)) / 1000, 0);
                    return <td key={ion} className="p-6 text-right text-purple-600 border-l border-slate-200">{totalMass.toFixed(2)}</td>;
                 })}
               </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}