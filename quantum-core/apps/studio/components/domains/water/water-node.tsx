'use client';

import { memo, useMemo } from 'react';
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
  ArrowUpRight,
  Network
} from 'lucide-react';
import { clsx } from 'clsx';

// Configuration visuelle par type de bac
const TYPE_STYLES = {
  PROCESS: {
    label: "Bain Actif",
    icon: Beaker,
    colors: "border-purple-200 bg-purple-50/50 hover:border-purple-400",
    header: "bg-purple-100 text-purple-700",
    bar: "bg-purple-500"
  },
  CLASSIC_RINSE: {
    label: "Rinçage",
    icon: Droplets,
    colors: "border-blue-200 bg-blue-50/50 hover:border-blue-400",
    header: "bg-blue-100 text-blue-700",
    bar: "bg-blue-500"
  },
  STATIC_RINSE: {
    label: "Bain Mort",
    icon: Anchor,
    colors: "border-slate-200 bg-slate-50/50 hover:border-slate-400",
    header: "bg-slate-100 text-slate-700",
    bar: "bg-slate-400"
  }
};

export const WaterNode = memo(({ id, data, selected }: NodeProps) => {
  // OPTIMISATION : On ne récupère que les noeuds nécessaires pour les labels (évite les re-renders inutiles)
  const nodes = useCanvasStore(state => state.nodes);

  // 1. Propriétés et Style
  const props = data.properties || {};
  const type = (props.type as keyof typeof TYPE_STYLES) || 'CLASSIC_RINSE';
  const style = TYPE_STYLES[type] || TYPE_STYLES.CLASSIC_RINSE;
  const Icon = style.icon;

  // 2. Simulation et Alertes
  const simResults = props.simulationResults || {};
  const concentrations = simResults.concentrations || {};
  const warnings = simResults.warnings || [];
  
  // Sécurité sur l'extraction du polluant principal
  const mainPollutant = useMemo(() => {
    const entries = Object.entries(concentrations);
    return entries.length > 0 ? entries[0] : null;
  }, [concentrations]);
  
  const hasCritical = warnings.some((w: any) => w.severity === 'CRITICAL');

  // 3. Helper pour identifier les destinations (Locales vs Globales)
  // useMemo pour éviter de recalculer à chaque tick si les nodes n'ont pas changé
  const getTargetInfo = (targetId: string | null) => {
    if (!targetId) return null;
    const targetNode = nodes.find(n => n.id === targetId);
    if (!targetNode) return null;

    return {
      label: targetNode.data.label,
      // Détection de connexion au BUS PROJET (ProjectStream)
      isGlobal: !!(targetNode.data.properties?.outputStreamId || targetNode.data.properties?.inputStreamId)
    };
  };

  const dumpInfo = useMemo(() => getTargetInfo(props.dumpingNetworkId), [props.dumpingNetworkId, nodes]);
  const overflowInfo = useMemo(() => getTargetInfo(props.overflowNetworkId), [props.overflowNetworkId, nodes]);
  const compInfo = useMemo(() => getTargetInfo(props.compensationSourceId), [props.compensationSourceId, nodes]);

  return (
    <div 
      className={clsx(
        "w-[220px] rounded-xl border-2 transition-all duration-200 shadow-sm relative group font-sans",
        style.colors,
        selected ? "ring-2 ring-offset-4 ring-blue-500 border-transparent shadow-xl scale-105 z-[100]" : "z-10",
        hasCritical && !selected ? "border-red-500 animate-pulse" : ""
      )}
    >
      {/* --- BADGE ALERTE FLOTTANT --- */}
      {warnings.length > 0 && (
        <div className={clsx(
          "absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-[110] animate-bounce",
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
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight truncate">
            {data.label || "Nouveau Bac"}
          </p>
          {props.catalogName && (
            <p className="text-[9px] text-blue-500 mt-0.5 truncate uppercase font-black tracking-tighter">
                {props.catalogName}
            </p>
          )}
        </div>

        {/* Grille de caractéristiques physiques */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-white/80 border border-slate-100 shadow-sm">
            <Maximize className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-600">{props.volume || 0} L</span>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-white/80 border border-slate-100 shadow-sm">
            <Thermometer className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-600">{props.temp || 20}°C</span>
          </div>
        </div>

        {/* Barre de Pollution (Résultat Engine) */}
        {mainPollutant && (
          <div className="mt-2 pt-2 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase">{mainPollutant[0]}</span>
              <span className="text-xs font-black text-blue-600">
                {Number(mainPollutant[1]).toFixed(2)} <span className="text-[9px] font-medium text-slate-400">g/L</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
              <div 
                className={clsx("h-full rounded-full transition-all duration-1000", style.bar)}
                style={{ width: `${Math.min((Number(mainPollutant[1]) / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* --- FOOTER : BADGES SANS FIL (Connexions) --- */}
      <div className="absolute -bottom-3 w-full flex justify-center gap-1 z-20 pointer-events-none flex-wrap px-2">
        {compInfo && (
          <Badge icon={ArrowRightLeft} label={`In: ${compInfo.label}`} color="blue" isGlobal={compInfo.isGlobal} />
        )}
        {dumpInfo && (
          <Badge icon={ArrowDown} label={`Vers: ${dumpInfo.label}`} color="orange" isGlobal={dumpInfo.isGlobal} />
        )}
        {overflowInfo && (
          <Badge icon={ArrowUpRight} label={`Déb: ${overflowInfo.label}`} color="emerald" isGlobal={overflowInfo.isGlobal} />
        )}
      </div>

      {/* --- HANDLES --- */}
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

/**
 * Sous-composant Badge optimisé pour la lecture
 */
function Badge({ icon: Icon, label, color, isGlobal }: any) {
    const colorClasses: any = {
        blue: "text-blue-700 bg-white border-blue-200",
        orange: "text-orange-700 bg-white border-orange-200",
        emerald: "text-emerald-700 bg-white border-emerald-200",
    };
    
    return (
        <div className={clsx(
            "flex items-center gap-1 border px-2 py-0.5 rounded-full shadow-md text-[7px] font-black max-w-[100px] truncate transition-all",
            colorClasses[color],
            isGlobal && "ring-1 ring-blue-500 border-blue-600 bg-blue-50" 
        )}>
            {isGlobal ? <Network className="w-2 h-2 text-blue-600" /> : <Icon className="w-2 h-2 opacity-70" />}
            <span className="truncate uppercase">{label}</span>
        </div>
    );
}

WaterNode.displayName = "WaterNode";