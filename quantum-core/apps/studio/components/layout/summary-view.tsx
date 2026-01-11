'use client';

import { BarChart3, Globe, Factory } from 'lucide-react';
import { AnalysisReport } from '../domains/water/analysis-report';

export function SummaryView({ summaryData }: any) {
  if (summaryData) {
      return <AnalysisReport />;
  }
  if (!summaryData) return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
        <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold uppercase text-xs tracking-widest">Lancez une analyse globale pour voir les rejets</p>
    </div>
  );

  return (
    <div className="flex-1 bg-slate-50 p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-10">
        <header>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bilan Consolidé du Site</h2>
            <p className="text-slate-500 italic">Synthèse de tous les flux sortants vers les réseaux de traitement.</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
            {summaryData.networks.map((net: any, i: number) => (
                <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Réseau de collecte</p>
                            <h3 className="text-xl font-black text-slate-800">{net.network}</h3>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-4xl font-black text-slate-900">{net.flow} <span className="text-sm font-bold text-slate-400 uppercase">{net.unit}</span></p>
                        <div className="flex gap-2 justify-end mt-2">
                           {net.lines.map((l: string) => (
                               <span key={l} className="px-2 py-0.5 bg-slate-100 rounded-md text-[8px] font-bold text-slate-500 uppercase">{l}</span>
                           ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}