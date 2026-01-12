'use client';

import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCanvasStore } from '@/store/canvas-store';
import { 
  ArrowDown, ArrowRightLeft, ArrowUpRight, AlertCircle, 
  Activity, Info 
} from 'lucide-react';
import { clsx } from 'clsx';
import { getDomainConfig } from '@/lib/registry';
import { DynamicIcon } from '@/components/ui/dynamic-icon';

export const SmartNode = memo(({ id, data, selected }: NodeProps) => {
  // 1. CONFIGURATION
  const config = getDomainConfig();
  const nodeType = data.type || 'DEFAULT'; 
  const nodeConfig = config.nodeTypes[nodeType];

  // Styles par défaut (Fallback)
  const labelType = nodeConfig?.label || nodeType;
  const iconName = nodeConfig?.iconName || "Box";
  const colorBase = nodeConfig?.color?.split('-')[0] || "slate"; 

  // 2. DONNÉES
  const props = data.properties || {};
  const nodes = useCanvasStore(state => state.nodes);
  
  const simResults = props.simulationResults || {};
  const warnings = simResults.warnings || [];
  
  // 3. LOGIQUE D'AFFICHAGE DYNAMIQUE (Basée sur le manifeste)
  // On cherche les champs marqués "isSummary: true"
  const summaryFields = useMemo(() => {
    if (!nodeConfig?.fields) return [];
    return nodeConfig.fields.filter(f => (f as any).isSummary);
  }, [nodeConfig]);

  // 4. LOGIQUE "WIRELESS" (Générique)
  // On détecte automatiquement les propriétés qui lient vers d'autres noeuds (Suffixe conventionnel ou Config)
  const wirelessLinks = useMemo(() => {
    const links = [];
    // Convention : toute prop finissant par 'NetworkId' ou 'SourceId' est un lien
    for (const [key, value] of Object.entries(props)) {
        if (typeof value === 'string' && (key.endsWith('NetworkId') || key.endsWith('SourceId'))) {
            const target = nodes.find(n => n.id === value);
            if (target) {
                // On détermine la couleur et l'icône selon le type de lien (convention de nommage)
                let color = "slate";
                let icon = ArrowRightLeft;
                let label = "Lien";

                if (key.includes('dumping')) { color = "orange"; icon = ArrowDown; label = "Vidange"; }
                if (key.includes('overflow')) { color = "emerald"; icon = ArrowUpRight; label = "Surverse"; }
                if (key.includes('compensation')) { color = "blue"; icon = ArrowRightLeft; label = "Appoint"; }

                links.push({ id: value, targetLabel: target.data.label, color, icon, label });
            }
        }
    }
    return links;
  }, [props, nodes]);

  // 5. RÉSULTATS DE SIMULATION (Générique)
  // On affiche la première métrique disponible trouvée dans "concentrations" ou à la racine
  const primaryMetric = useMemo(() => {
    if (simResults.concentrations) {
        const entries = Object.entries(simResults.concentrations);
        if (entries.length > 0) return { label: entries[0][0], value: entries[0][1], unit: "g/L" };
    }
    // Fallback pour l'énergie ou autres domaines
    if (simResults.power) return { label: "Puissance", value: simResults.power, unit: "kW" };
    return null;
  }, [simResults]);

  const hasCritical = warnings.some((w: any) => w.severity === 'CRITICAL');

  return (
    <div 
      className={clsx(
        "min-w-[200px] max-w-[260px] rounded-xl border-2 transition-all duration-200 shadow-sm relative group font-sans bg-white",
        `border-${colorBase}-200`,
        selected ? "ring-2 ring-offset-4 ring-blue-500 border-transparent shadow-xl scale-105 z-[100]" : "z-10 hover:border-blue-300",
        hasCritical && !selected ? "border-red-500 animate-pulse" : ""
      )}
    >
      {/* ALERTES */}
      {warnings.length > 0 && (
        <div className="absolute -top-3 -right-3 z-[110] animate-bounce">
           <div className={clsx("w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg", hasCritical ? "bg-red-500 text-white" : "bg-amber-500 text-white")}>
             <AlertCircle className="w-4 h-4" />
           </div>
        </div>
      )}

      {/* HEADER */}
      <div className={clsx(
          "px-3 py-2 border-b rounded-t-[9px] flex justify-between items-center",
          `bg-${colorBase}-50 border-${colorBase}-100 text-${colorBase}-700`
        )}>
        <div className="flex items-center gap-2">
          <DynamicIcon name={iconName} className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">{labelType}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight truncate">
            {data.label || "Élément sans nom"}
          </p>
          {props.catalogName && <p className="text-[9px] text-blue-500 mt-0.5 font-black uppercase">{props.catalogName}</p>}
        </div>

        {/* CHAMPS RÉSUMÉS (Configurés via isSummary: true) */}
        {summaryFields.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
                {summaryFields.map((field: any) => (
                    <div key={field.id} className="flex flex-col bg-slate-50 p-1.5 rounded border border-slate-100">
                        <span className="text-[7px] font-bold text-slate-400 uppercase truncate">{field.label}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-600">
                            {props[field.id] ?? '-'} <span className="text-[8px]">{field.unit}</span>
                        </span>
                    </div>
                ))}
            </div>
        )}

        {/* RÉSULTAT SIMULATION */}
        {primaryMetric && (
          <div className="mt-2 pt-2 border-t border-slate-100 animate-in fade-in">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase">{primaryMetric.label}</span>
              <span className="text-xs font-black text-blue-600">
                {Number(primaryMetric.value).toFixed(2)} <span className="text-[9px] font-medium text-slate-400">{primaryMetric.unit}</span>
              </span>
            </div>
            {/* Barre de progression générique */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
              <div 
                className={clsx("h-full rounded-full transition-all duration-1000", `bg-${colorBase}-500`)}
                style={{ width: `${Math.min((Number(primaryMetric.value) / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER : LIENS SANS FIL */}
      {wirelessLinks.length > 0 && (
        <div className="px-2 pb-3 flex flex-wrap gap-1 justify-center">
            {wirelessLinks.map((link, i) => (
                <div key={i} className={`flex items-center gap-1 border px-2 py-0.5 rounded-full shadow-sm text-[7px] font-black max-w-[100%] truncate text-${link.color}-700 bg-${link.color}-50 border-${link.color}-100`}>
                    <link.icon className="w-2 h-2 opacity-70" />
                    <span className="truncate uppercase">{link.label}: {link.targetLabel}</span>
                </div>
            ))}
        </div>
      )}

      {/* PORTS */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-400 border-2 border-white transition-colors hover:!bg-blue-600 z-50" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-400 border-2 border-white transition-colors hover:!bg-blue-600 z-50" />
    </div>
  );
});

SmartNode.displayName = "SmartNode";