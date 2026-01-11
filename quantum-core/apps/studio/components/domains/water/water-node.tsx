'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCanvasStore } from '@/store/canvas-store';
import { 
  Beaker, 
  Droplets, 
  Anchor, 
  Thermometer, 
  Maximize, 
  AlertCircle,
  ArrowDown,
  ArrowRightLeft,
  ArrowUpRight
} from 'lucide-react';
import { clsx } from 'clsx';

// Configuration visuelle par type de bac
const TYPE_STYLES = {
  PROCESS: {
    label: "Bain Actif",
    icon: Beaker,
    colors: "border-purple-200 bg-purple-50/50 hover:border-purple-400",
    header: "bg-purple-100 text-purple-700",
  },
  CLASSIC_RINSE: {
    label: "Rinçage",
    icon: Droplets,
    colors: "border-blue-200 bg-blue-50/50 hover:border-blue-400",
    header: "bg-blue-100 text-blue-700",
  },
  STATIC_RINSE: {
    label: "Bain Mort",
    icon: Anchor,
    colors: "border-slate-200 bg-slate-50/50 hover:border-slate-400",
    header: "bg-slate-100 text-slate-700",
  }
};

export const WaterNode = memo(({ id, data, selected }: NodeProps) => {
  // 1. Extraction des propriétés de base
  const props = data.properties || {};
  const type = (props.type as keyof typeof TYPE_STYLES) || 'CLASSIC_RINSE';
  const style = TYPE_STYLES[type] || TYPE_STYLES.CLASSIC_RINSE;
  const Icon = style.icon;

  // 2. Extraction des résultats de simulation et alertes
  const simResults = props.simulationResults || {};
  const concentrations = simResults.concentrations || {};
  const warnings = simResults.warnings || [];
  const mainPollutant = Object.entries(concentrations)[0]; // [Symbole, Valeur]
  
  const hasCritical = warnings.some((w: any) => w.severity === 'CRITICAL');

  // 3. Récupération des labels pour les connexions "Sans Fil"
  const getNodeLabel = (targetId: string | null) => {
    return useCanvasStore(state => {
      if (!targetId) return null;
      const t = state.nodes.find(n => n.id === targetId);
      return t ? t.data.label : "?";
    });
  };

  const dumpLabel = getNodeLabel(props.dumpingNetworkId);
  const overflowLabel = getNodeLabel(props.overflowNetworkId);
  const compLabel = getNodeLabel(props.compensationSourceId);

  return (
    <div 
      className={clsx(
        "w-[220px] rounded-xl border-2 transition-all duration-200 shadow-sm relative group font-sans",
        style.colors,
        selected ? "ring-2 ring-offset-2 ring-blue-500 border-transparent shadow-xl scale-105 z-30" : "",
        hasCritical && !selected ? "border-red-500 animate-pulse" : ""
      )}
    >
      {/* --- BADGE ALERTE FLOTTANT --- */}
      {warnings.length > 0 && (
        <div className={clsx(
          "absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-50 animate-bounce",
          hasCritical ? "bg-red-500 text-white" : "bg-amber-500 text-white"
        )}>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      {/* --- HEADER --- */}
      <div className={clsx("px-3 py-2 border-b border-black/5 rounded-t-[10px] flex justify-between items-center", style.header)}>
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">{style.label}</span>
        </div>
        <span className="text-[9px] font-mono opacity-50">#{id.slice(-4)}</span>
      </div>

      {/* --- BODY --- */}
      <div className="p-4 space-y-3 bg-white/60 backdrop-blur-sm rounded-b-[10px]">
        
        {/* Titre et Catalogue */}
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight truncate">
            {data.label || "Nouveau Bac"}
          </p>
          {props.catalogName && (
            <p className="text-[9px] text-slate-400 mt-0.5 truncate">{props.catalogName}</p>
          )}
        </div>

        {/* Grille de caractéristiques */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-white border border-slate-100 shadow-sm">
            <Maximize className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-600">{props.volume || 0} L</span>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-white border border-slate-100 shadow-sm">
            <Thermometer className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-600">{props.temp || 20}°C</span>
          </div>
        </div>

        {/* --- FEEDBACK SIMULATION (Barre de pollution) --- */}
        {mainPollutant && (
          <div className="mt-2 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase">{mainPollutant[0] as string}</span>
              <span className="text-xs font-black text-blue-600">
                {Number(mainPollutant[1]).toFixed(2)} <span className="text-[9px] font-medium text-slate-400">g/L</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={clsx(
                  "h-full rounded-full transition-all duration-1000", 
                  type === 'PROCESS' ? "bg-purple-500" : "bg-blue-500"
                )}
                style={{ width: `${Math.min((Number(mainPollutant[1]) / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* --- FOOTER : BADGES SANS FIL (Connexions logiques) --- */}
      <div className="absolute -bottom-3 w-full flex justify-center gap-1 z-20 pointer-events-none flex-wrap px-2">
        
        {/* Badge Compensation Makeup */}
        {compLabel && (
          <div className="flex items-center gap-1 bg-white border border-blue-200 px-1.5 py-0.5 rounded-full shadow-sm text-[7px] font-bold text-blue-700 max-w-[80px] truncate">
            <ArrowRightLeft className="w-2 h-2 text-blue-500" />
            <span>In: {compLabel}</span>
          </div>
        )}

        {/* Badge Vidange Drain */}
        {dumpLabel && (
          <div className="flex items-center gap-1 bg-white border border-orange-200 px-1.5 py-0.5 rounded-full shadow-sm text-[7px] font-bold text-orange-700 max-w-[80px] truncate">
            <ArrowDown className="w-2 h-2 text-orange-500" />
            <span>Vers: {dumpLabel}</span>
          </div>
        )}

        {/* Badge Surverse Overflow */}
        {overflowLabel && (
          <div className="flex items-center gap-1 bg-white border border-emerald-200 px-1.5 py-0.5 rounded-full shadow-sm text-[7px] font-bold text-emerald-700 max-w-[80px] truncate">
            <ArrowUpRight className="w-2 h-2 text-emerald-500" />
            <span>Déb: {overflowLabel}</span>
          </div>
        )}
      </div>

      {/* --- HANDLES (Points de raccordement physiques) --- */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 !bg-slate-400 border-2 border-white transition-colors hover:!bg-blue-600 z-50" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 !bg-slate-400 border-2 border-white transition-colors hover:!bg-blue-600 z-50" 
      />
    </div>
  );
});

WaterNode.displayName = "WaterNode";