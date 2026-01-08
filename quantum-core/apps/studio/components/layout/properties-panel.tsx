'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Settings2, Info, GitCommitVertical } from 'lucide-react';
import { CatalogSelector } from './catalog-selector';
import { DynamicIcon } from '@/components/ui/dynamic-icon'; // <--- IMPORT CRUCIAL

// ===================================
// Helper: Render a single form field
// ===================================
type FieldProps = {
  field: any;
  properties: any;
  update: (props: any) => void;
};

function PropertyField({ field, properties, update }: FieldProps) {
  const value = properties[field.id] ?? field.default ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = field.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    update({ [field.id]: val });
  };

  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={handleChange}
        className="w-full p-2 text-sm border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      >
        {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }

  return (
    <input
      type={field.type === 'number' ? 'number' : 'text'}
      value={value}
      onChange={handleChange}
      className="w-full p-2 text-sm border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
    />
  );
}

// ===================================
// Main Panel Component
// ===================================
interface PropertiesPanelProps {
  config: any;
}

export function PropertiesPanel({ config }: PropertiesPanelProps) {
  const store = useCanvasStore();

  const selectedNode = store.nodes.find((n) => n.id === store.selectedNodeId);
  const selectedEdge = store.edges.find((e) => e.id === store.selectedEdgeId);
  const isNode = !!selectedNode;

  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="w-80 border-l border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Settings2 className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-tight">
          Sélectionnez un équipement ou une liaison pour modifier ses propriétés.
        </p>
      </aside>
    );
  }

  let itemConfig, properties, update, title, icon;
  
  if (selectedNode) {
    itemConfig = config.nodeTypes[selectedNode.data.type];
    properties = selectedNode.data.properties || {};
    update = (props: any) => store.updateNodeProperties(selectedNode.id, props);
    title = itemConfig.label;
    
    // CORRECTION ICI : On utilise DynamicIcon avec iconName
    icon = <DynamicIcon name={itemConfig.iconName} className={`w-4 h-4 text-${itemConfig.color}`} />;
    
  } else if (selectedEdge) {
    const edgeType = selectedEdge.type?.toUpperCase() === 'DEFAULT' ? 'PIPE' : (selectedEdge.type || 'PIPE');
    itemConfig = config.edgeTypes[edgeType];
    properties = selectedEdge.data || {};
    update = (props: any) => store.updateEdgeProperties(selectedEdge.id, props);
    title = itemConfig?.label || "Liaison";
    icon = <GitCommitVertical className={`w-4 h-4 text-slate-400`} />;
  }

  return (
    <aside className="w-80 border-l border-slate-200 bg-white flex flex-col h-full shadow-sm overflow-y-auto">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Propriétés {isNode ? 'Équipement' : 'Flux'}
          </h2>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>

      <div className="p-6 space-y-6">
        {isNode && (
          <>
            <CatalogSelector category={selectedNode.data.type} nodeId={selectedNode.id} />

            {properties.catalogName && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg animate-in fade-in zoom-in-95">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Modèle Catalogue</p>
                <p className="text-sm font-bold text-blue-900 leading-tight">{properties.catalogName}</p>
                <button 
                    onClick={() => update({ catalogName: null, price: 0 })}
                    className="mt-2 text-[10px] text-blue-500 hover:underline font-medium"
                >
                    Réinitialiser la sélection
                </button>
              </div>
            )}
          </>
        )}

        {isNode && <div className="h-px bg-slate-100 my-4" />}

        <div className="space-y-5">
            {itemConfig?.fields?.map((field: any) => (
              <div key={field.id} className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                  {field.label}
                  {field.unit && <span className="text-blue-500 lowercase font-medium">{field.unit}</span>}
                </label>
                <PropertyField field={field} properties={properties} update={update} />
              </div>
            ))}
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 leading-relaxed italic">
            Les modifications sont enregistrées localement. Cliquez sur <strong>Sauvegarder</strong> pour persister en base.
          </p>
        </div>
      </div>
    </aside>
  );
}