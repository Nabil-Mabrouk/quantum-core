'use client';

import { useCanvasStore, AppNode } from '@/store/canvas-store';
import { currentConfig } from '@/lib/domain-config';
import { Settings2, Info, GitCommitVertical } from 'lucide-react';
import { Edge } from '@xyflow/react';
import { CatalogSelector } from './catalog-selector';
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
export function PropertiesPanel() {
  const store = useCanvasStore();

  const selectedNode = store.nodes.find((n) => n.id === store.selectedNodeId);
  const selectedEdge = store.edges.find((e) => e.id === store.selectedEdgeId);
  const isNode = !!selectedNode;

  // --- 1. No item selected ---
  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="w-80 border-l border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Settings2 className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Sélectionnez un équipement ou une liaison pour modifier ses propriétés.</p>
      </aside>
    );
  }

  // --- 2. Determine configuration for the selected item ---
  let config, properties, update, title, icon;
  
  if (selectedNode) {
    config = currentConfig.nodeTypes[selectedNode.data.type];
    properties = selectedNode.data.properties || {};
    update = (props: any) => store.updateNodeProperties(selectedNode.id, props);
    title = config.label;
    icon = <config.icon className={`w-4 h-4 text-${config.color}`} />;
  } else if (selectedEdge) {
    // Note: Edge type is hardcoded for now as per canvas-store logic
    const edgeType = selectedEdge.type || 'PIPE';
    config = currentConfig.edgeTypes[edgeType];
    properties = selectedEdge.data || {};
    update = (props: any) => store.updateEdgeProperties(selectedEdge.id, props);
    title = config.label;
    icon = <GitCommitVertical className={`w-4 h-4 text-${config.color}`} />;
  } else {
    return null; // Should not happen
  }

  // --- 3. Render the panel ---
  return (
    <aside className="w-80 border-l border-slate-200 bg-white flex flex-col h-full shadow-sm overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Propriétés</h2>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>



      {/* Dynamic Form */}
      <div className="p-6 space-y-6">
        {isNode && (
            <>
                <CatalogSelector category={selectedNode.data.type} nodeId={selectedNode.id} />

                {properties.catalogName && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg animate-in fade-in zoom-in-95">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Équipement sélectionné</p>
                <p className="text-sm font-bold text-blue-900 leading-tight">{properties.catalogName}</p>
                <button 
                    onClick={() => update({ catalogName: null, price: 0 })}
                    className="mt-2 text-[10px] text-blue-500 hover:underline font-medium"
                >
                    Réinitialiser
                </button>
                </div>
            )}
            </>
        )}
        <div className="h-px bg-slate-100 my-4" />

        {config.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
              {field.label}
              {field.unit && <span className="text-blue-500 lowercase">{field.unit}</span>}
            </label>
            <PropertyField field={field} properties={properties} update={update} />
          </div>
        ))}

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 leading-relaxed italic">
            Ces paramètres seront envoyés au moteur Python pour le calcul de flux et le dimensionnement STEP.
          </p>
        </div>
      </div>
    </aside>
  );
}