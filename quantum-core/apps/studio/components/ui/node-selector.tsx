'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Network, Unplug, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useMemo } from 'react';

interface NodeSelectorProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  filter?: string[]; // Liste des types autorisés (ex: ['DRAIN', 'STORAGE_TANK'])
}

export function NodeSelector({ value, onChange, filter }: NodeSelectorProps) {
  const nodes = useCanvasStore((state) => state.nodes);

  // 1. Filtrer les noeuds disponibles selon les critères du manifeste
  const availableNodes = useMemo(() => {
    return nodes.filter((node) => {
      // On ne peut pas se connecter à soi-même (logique)
      // Note: On pourrait passer l'ID du noeud courant pour filtrer plus précisément
      
      if (!filter || filter.length === 0) return true;
      return filter.includes(node.data.type);
    });
  }, [nodes, filter]);

  // 2. Trouver le label du noeud actuellement sélectionné
  const selectedNodeLabel = useMemo(() => {
    if (!value) return null;
    return nodes.find((n) => n.id === value)?.data.label;
  }, [value, nodes]);

  return (
    <div className="relative group w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
        {value ? <Network className="w-3.5 h-3.5" /> : <Unplug className="w-3.5 h-3.5" />}
      </div>

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className={clsx(
          "w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none transition-all appearance-none cursor-pointer",
          "hover:border-blue-300 hover:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500",
          value ? "text-blue-700 border-blue-100" : "text-slate-500 italic"
        )}
      >
        <option value="">-- Aucun raccordement --</option>
        
        {availableNodes.length > 0 ? (
          <optgroup label="Équipements disponibles">
            {availableNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.data.label} ({node.data.type})
              </option>
            ))}
          </optgroup>
        ) : (
          <option disabled>Aucun équipement compatible trouvé</option>
        )}
      </select>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-slate-500 transition-colors">
        <ChevronDown className="w-3.5 h-3.5" />
      </div>

      {/* Petit indicateur visuel de l'ID pour le debug ingénieur */}
      {value && (
        <div className="mt-1.5 flex items-center gap-1 px-2 py-0.5 bg-blue-50/50 rounded-md border border-blue-100/50 w-fit">
            <span className="text-[7px] font-mono text-blue-400 uppercase tracking-tighter">UID: {value.slice(0, 8)}...</span>
        </div>
      )}
    </div>
  );
}