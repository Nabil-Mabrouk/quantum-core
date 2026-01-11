'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { LayoutDashboard, ExternalLink, Activity, Droplets, Waves } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

export function SystemNode({ data, selected }: NodeProps<any>) {
  const isTreatment = data.type === 'TREATMENT';

  return (
    <div className={clsx(
      "min-w-[280px] bg-white border-2 rounded-[2rem] shadow-xl transition-all overflow-hidden",
      selected ? "border-blue-500 ring-4 ring-blue-500/10 scale-105" : "border-slate-200"
    )}>
      {/* Header */}
      <div className={clsx(
        "p-4 border-b flex justify-between items-center",
        isTreatment ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
      )}>
        <div className="flex items-center gap-3">
          <div className={clsx(
            "p-2 rounded-xl",
            isTreatment ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
          )}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
              {isTreatment ? 'Système Traitement' : 'Système Production'}
            </p>
            <h3 className="text-sm font-black text-slate-900 leading-tight">{data.label}</h3>
          </div>
        </div>
        
        <Link 
          href={`/editor/${data.projectId}?systemId=${data.id}`}
          className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Body / KPIs */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Entrées</p>
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
              <Droplets className="w-3 h-3" /> {data.inputCount || 0} Flux
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Sorties</p>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
              <Waves className="w-3 h-3" /> {data.outputCount || 0} Flux
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Status */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Opérationnel</span>
        </div>
        <Activity className="w-3 h-3 text-slate-300" />
      </div>

      {/* Handles (Points d'ancrage pour les ProjectStreams) */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-blue-400 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-emerald-400 border-2 border-white" />
    </div>
  );
}