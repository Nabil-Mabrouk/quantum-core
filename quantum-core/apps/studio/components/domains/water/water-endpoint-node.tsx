'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Waves,       // Pour les Sinks (Réseaux)
  Droplets,    // Pour les Sources (Eau propre)
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { clsx } from 'clsx';

export const WaterEndpointNode = memo(({ id, data, selected }: NodeProps) => {
  const role = data.role || 'SINK'; // SOURCE ou SINK
  const props = data.properties || {};
  
  // Configuration visuelle selon le rôle
  const isSource = role === 'SOURCE';
  const Icon = isSource ? Droplets : Waves;
  
  // Résultats de simulation (ex: Total collecté par ce réseau)
  const simResults = props.simulationResults || {};
  const totalFlow = simResults.flow || 0; // Calculé par le moteur Python

  return (
    <div 
      className={clsx(
        "min-w-[160px] rounded-full border-2 transition-all duration-200 shadow-sm relative group flex items-center gap-3 p-2 pr-4 bg-white",
        isSource 
          ? "border-blue-200 hover:border-blue-400" 
          : "border-emerald-200 hover:border-emerald-400",
        selected ? "ring-2 ring-offset-2 ring-slate-400 scale-105" : ""
      )}
    >
      {/* Icône Circulaire */}
      <div className={clsx(
        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-inner",
        isSource ? "bg-blue-500" : "bg-emerald-500"
      )}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Informations */}
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
          {isSource ? "Alimentation" : "Réseau / Rejet"}
        </p>
        <p className="text-sm font-bold text-slate-800 truncate leading-none">
          {data.label}
        </p>
        
        {/* Affichage du débit calculé (Résultat Simulation) */}
        {!isSource && totalFlow > 0 && (
           <p className="text-[10px] font-mono font-bold text-emerald-600 mt-1">
             In: {totalFlow.toFixed(1)} L/h
           </p>
        )}
      </div>

      {/* --- HANDLES (Points de connexion) --- */}
      {/* Une Source a seulement une sortie (à droite) */}
      {isSource && (
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 !bg-blue-500 border-2 border-white" 
        />
      )}

      {/* Un Sink a seulement une entrée (à gauche) */}
      {!isSource && (
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-3 h-3 !bg-emerald-500 border-2 border-white" 
        />
      )}
    </div>
  );
});

WaterEndpointNode.displayName = "WaterEndpointNode";