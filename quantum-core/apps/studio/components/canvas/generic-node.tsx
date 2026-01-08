import { Handle, Position, NodeProps } from '@xyflow/react';
import { currentConfig } from '@/lib/domain-config';
import { AppNodeData } from '@/store/canvas-store';
import { clsx } from 'clsx';

export function GenericNode({ data, selected }: NodeProps<any>) {
  // 1. On récupère la config spécifique pour ce type de nœud (ex: TANK)
  const nodeConfig = currentConfig.nodeTypes[data.type];

  if (!nodeConfig) return <div className="p-2 bg-red-100 text-red-500">Type inconnu: {data.type}</div>;

  const Icon = nodeConfig.icon;
 const properties = data.properties || {};
  return (
    <div 
      className={clsx(
        "min-w-[120px] rounded-lg border-2 bg-white shadow-sm transition-all",
        // Si sélectionné, bordure noire, sinon bordure de la couleur du métier
        selected ? "border-black ring-2 ring-black/20" : `border-${nodeConfig.color}`,
        "hover:shadow-md"
      )}
      // Hack Tailwind pour les couleurs dynamiques (ou utiliser style={{ borderColor: ... }})
      style={{ borderColor: selected ? undefined : `var(--color-${nodeConfig.color})` }}
    >
      {/* Header du Nœud */}
      <div className={`p-2 border-b flex items-center gap-2 bg-slate-50 rounded-t-md`}>
        <div className={`p-1.5 rounded-md bg-white border shadow-sm`}>
            <Icon className="w-4 h-4 text-slate-700" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {nodeConfig.label}
        </span>
      </div>

      {/* Corps du Nœud */}
      <div className="p-3">
        <p className="text-sm font-medium text-center text-slate-900">{data.label}</p>
        {properties.catalogName && (
          <p className="mt-1 text-[9px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 truncate">
            {properties.catalogName}
          </p>
        )}

      </div>

      {/* Connecteurs (Ports) */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-slate-400" />
    </div>
  );
}