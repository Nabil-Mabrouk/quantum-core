'use client';

import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCanvasStore } from '@/store/canvas-store';
import { 
  ArrowDown, ArrowRightLeft, ArrowUpRight, AlertTriangle, 
  Settings2, Activity, Zap, Flame, Eye, Droplets
} from 'lucide-react';
import { clsx } from 'clsx';
import { getDomainConfig } from '@/lib/registry';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { t } from '@/lib/i18n';

export const SmartNode = memo(({ id, data, selected }: NodeProps) => {
  // 1. CONFIGURATION DU DOMAINE
  const config = getDomainConfig();
  const nodeType = data.type || 'DEFAULT'; 
  const nodeConfig = config.nodeTypes[nodeType];
  const locale = 'fr'; // À récupérer dynamiquement via un contexte si dispo

  if (!nodeConfig) {
    return (
      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2 text-red-700">
        <AlertCircle className="w-5 h-5" />
        <span className="text-xs font-bold">Type inconnu: {nodeType}</span>
      </div>
    );
  }

  const labelType = t(nodeConfig.label, locale as any);
  const iconName = nodeConfig.iconName || "Box";
  const colorBase = nodeConfig.color?.split('-')[0] || "slate"; 

  // 2. RÉCUPÉRATION DES DONNÉES DU STORE
  const props = data.properties || {};
  const allNodes = useCanvasStore(state => state.nodes);
  
  const simResults = props.simulationResults || {};
  const warnings = simResults.warnings || [];
  const concentrations = simResults.concentrations || {};
  
  // 3. LOGIQUE : SOMME IONIQUE (HEALTH BAR)
  // On calcule la pollution totale pour la jauge visuelle
  const totalIonicLoad = useMemo(() => {
    return Object.values(concentrations).reduce((acc, val) => acc + (val as number), 0);
  }, [concentrations]);

  // Seuil d'alerte visuelle (ex: 50 g/L pour un rinçage est critique)
  const POLLUTION_THRESHOLD = 50; 
  const isPolluted = totalIonicLoad > 10; // Devient orange à partir de 10 g/L

  // 4. CHAMPS RÉSUMÉS & ACCESSOIRES
  const accessories = props.accessories || [];
  const summaryFields = useMemo(() => {
    return nodeConfig.fields.filter(f => (f as any).isSummary);
  }, [nodeConfig]);

  // 5. ALERTES CRITIQUES
  // Si le solveur renvoie une erreur (ex: bilan eau négatif)
  const hasCritical = warnings.length > 0;

  // 6. LIAISONS SANS FIL (Wireless)
  const wirelessLinks = useMemo(() => {
    const links = [];
    for (const [key, value] of Object.entries(props)) {
        if (typeof value === 'string' && (key.endsWith('NetworkId') || key.endsWith('SourceId') || key.endsWith('TargetId'))) {
            const target = allNodes.find(n => n.id === value);
            if (target) {
                let color = "slate";
                let icon = ArrowRightLeft;
                let label = "Lien";

                if (key.toLowerCase().includes('dumping')) { color = "orange"; icon = ArrowDown; label = "Vidange"; }
                else if (key.toLowerCase().includes('overflow')) { color = "emerald"; icon = ArrowUpRight; label = "Surverse"; }
                else if (key.toLowerCase().includes('spray')) { color = "blue"; icon = Droplets; label = "Spray"; }
                else if (key.toLowerCase().includes('source')) { color = "blue"; icon = ArrowRightLeft; label = "Appoint"; }

                links.push({ id: value, targetLabel: target.data.label, color, icon, label });
            }
        }
    }
    return links;
  }, [props, allNodes]);

  return (
    <div 
      className={clsx(
        "min-w-[210px] max-w-[280px] rounded-xl border-2 transition-all duration-300 shadow-sm relative group font-sans bg-white",
        `border-${colorBase}-200`,
        selected ? `ring-4 ring-blue-500/10 border-blue-500 shadow-xl scale-105 z-[100]` : "z-10 hover:border-blue-400",
        hasCritical && !selected ? "border-red-500 animate-pulse shadow-red-100" : ""
      )}
    >
      {/* BADGE D'ALERTE PHYSIQUE */}
      {hasCritical && (
        <div className="absolute -top-3 -right-3 z-[110]">
           <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
             <AlertTriangle className="w-4 h-4" />
           </div>
        </div>
      )}

      {/* HEADER */}
      <div className={clsx(
          "px-3 py-2 border-b rounded-t-[9px] flex justify-between items-center transition-colors",
          `bg-${colorBase}-50/50 border-${colorBase}-100 text-${colorBase}-700`
        )}>
        <div className="flex items-center gap-2">
          <DynamicIcon name={iconName} className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest truncate">{labelType}</span>
        </div>
        {selected && <Settings2 className="w-3 h-3 opacity-50" />}
      </div>

      {/* BODY */}
      <div className="p-4 space-y-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 leading-tight truncate">
            {data.label || "Élément sans nom"}
          </p>
          {props.catalogName && (
            <p className="text-[9px] text-blue-500 mt-1 font-black uppercase tracking-tighter truncate italic">
              {props.catalogName}
            </p>
          )}
        </div>

        {/* CHAMPS RÉSUMÉS (Longueur, Largeur, Temp...) */}
        {summaryFields.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
                {summaryFields.map((field: any) => (
                    <div key={field.id} className="flex flex-col bg-slate-50 p-2 rounded-lg border border-slate-100 min-w-0">
                        <span className="text-[7px] font-bold text-slate-400 uppercase truncate">{t(field.label, locale as any)}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-700 truncate">
                            {props[field.id] ?? '-'} <span className="text-[8px] text-slate-400">{field.unit}</span>
                        </span>
                    </div>
                ))}
            </div>
        )}

        {/* ACCESSOIRES (Pompes, Chauffages...) */}
        {accessories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50">
             {accessories.map((acc: any, i: number) => (
               <div 
                key={i} 
                className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded-md shadow-sm" 
               >
                  <DynamicIcon 
                    name={acc.type === 'PUMP' ? 'Zap' : acc.type === 'HEATER' ? 'Flame' : 'Activity'} 
                    className="w-2.5 h-2.5 text-slate-400" 
                  />
                  <span className="text-[7px] font-black uppercase text-slate-500">{acc.type}</span>
               </div>
             ))}
          </div>
        )}

        {/* --- NOUVEAU : JAUGE DE POLLUTION (HEALTH BAR) --- */}
        {totalIonicLoad > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Charge Ionique</span>
              <span className="text-xs font-black text-blue-600">
                {totalIonicLoad.toFixed(2)} <span className="text-[9px] font-medium text-slate-400">g/L</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
              <div 
                className={clsx(
                    "h-full rounded-full transition-all duration-1000 ease-in-out", 
                    totalIonicLoad > POLLUTION_THRESHOLD ? "bg-red-500" : isPolluted ? "bg-orange-500" : "bg-blue-500"
                )}
                style={{ width: `${Math.min((totalIonicLoad / POLLUTION_THRESHOLD) * 100, 100)}%` }} 
              />
            </div>
          </div>
        )}

        {/* KPI HYDRAULIQUE */}
        {simResults.flow > 0 && (
            <div className="flex items-center gap-2 text-slate-400 mt-1">
                <Activity className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-tight">Débit Traversant: {simResults.flow.toFixed(1)} L/h</span>
            </div>
        )}
      </div>

      {/* FOOTER : LIENS WIRELESS (Surverse, Spray...) */}
      {wirelessLinks.length > 0 && (
        <div className="px-3 pb-3 flex flex-wrap gap-1.5 justify-center">
            {wirelessLinks.map((link, i) => (
                <div key={i} className={clsx(
                  "flex items-center gap-1 border px-2 py-0.5 rounded-full shadow-sm text-[7px] font-black max-w-full truncate transition-all",
                  `text-${link.color}-700 bg-${link.color}-50 border-${link.color}-100`
                )}>
                    <link.icon className="w-2.5 h-2.5 opacity-70" />
                    <span className="truncate uppercase">{link.label}: {link.targetLabel}</span>
                </div>
            ))}
        </div>
      )}

      {/* PORTS DE CONNEXION REACT FLOW */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-2.5 h-2.5 !bg-slate-300 border-2 border-white transition-colors hover:!bg-blue-500 hover:scale-125" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-2.5 h-2.5 !bg-slate-300 border-2 border-white transition-colors hover:!bg-blue-500 hover:scale-125" 
      />
    </div>
  );
});

SmartNode.displayName = "SmartNode";