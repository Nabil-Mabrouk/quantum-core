'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { getDomainConfig } from '@/lib/registry';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { clsx } from 'clsx';

export function GenericNode({ data, selected }: NodeProps<any>) {
  // 1. Identification du domaine et de la configuration métier
  const config = getDomainConfig();
  const nodeConfig = config.nodeTypes[data.type];

  // Sécurité si le type de noeud n'existe pas dans le manifeste
  if (!nodeConfig) {
    return (
      <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-[10px] font-bold">
        Type Erreur: {data.type}
      </div>
    );
  }

  // Extraction des propriétés (JSONB) et des résultats de calcul (Simulation)
  const properties = data.properties || {};
  const simResults = properties.simulationResults;

  return (
    <div 
      className={clsx(
        "min-w-[180px] rounded-2xl border-2 bg-white transition-all duration-300 shadow-sm",
        selected 
          ? "border-slate-900 shadow-2xl ring-4 ring-slate-900/5 scale-105" 
          : `border-slate-200 hover:border-blue-400`
      )}
    >
      {/* HEADER : Identité visuelle du type d'équipement */}
      <div className="p-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 rounded-t-[14px]">
        <div className="p-1 bg-white rounded-md border border-slate-200 shadow-sm">
            <DynamicIcon name={nodeConfig.iconName} className="w-3.5 h-3.5 text-slate-600" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            {nodeConfig.label}
        </span>
      </div>

      {/* CORPS : Informations techniques et Modèle choisi */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs font-bold text-slate-900 leading-none mb-1">
            {data.label || 'Nouvel élément'}
          </p>

          {/* Badge de matériel (Provenant du catalogue) */}
          {properties.catalogName && (
            <div className="mt-2 py-1 px-2 bg-blue-50 border border-blue-100 rounded-md">
               <p className="text-[7px] font-black text-blue-400 uppercase leading-none mb-0.5">Spécification</p>
               <p className="text-[9px] font-bold text-blue-700 truncate leading-tight">
                 {properties.catalogName}
               </p>
            </div>
          )}
        </div>

        {/* --- SECTION DYNAMIQUE : RÉSULTATS SCIENTIFIQUES (Engine Output) --- */}
        {/* Ce bloc n'apparaît que si le moteur Python a renvoyé un calcul */}
        {simResults && (
          <div className="pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-700">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight">Pollution Calc.</span>
              <span className="text-[11px] font-mono font-bold text-blue-600">
                {simResults.conc} <span className="text-[9px] font-medium text-slate-400 italic">g/L</span>
              </span>
            </div>

            {/* "Health-bar" de pollution : change de couleur selon l'intensité */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
               <div 
                 className={clsx(
                    "h-full transition-all duration-1000 ease-in-out",
                    simResults.conc > 10 ? "bg-orange-500" : "bg-blue-500"
                 )}
                 style={{ width: `${Math.min((simResults.conc / 50) * 100, 100)}%` }} 
               />
            </div>
          </div>
        )}
      </div>

      {/* CONNECTEURS (Handles) : Points d'ancrage pour les liens de flux */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-slate-300 border-2 border-white hover:bg-blue-500 transition-colors !z-10" 
      />
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-slate-300 border-2 border-white hover:bg-blue-500 transition-colors !z-10" 
      />
    </div>
  );
}