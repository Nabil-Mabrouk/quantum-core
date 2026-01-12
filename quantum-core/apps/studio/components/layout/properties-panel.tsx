'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  Settings2, 
  Trash2, 
  Type, 
  Hash, 
  List, 
  ToggleLeft, 
  FileText, 
  Plus,
  Scale
} from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { ResizablePanel } from '@/components/ui/resizable-panel';
import { CatalogSelector } from '@/components/layout/catalog-selector';

// --- IMPORT DU REGISTRE ---
import { 
  getDomainForm, 
  getDomainWidget, 
  getDomainPanel 
} from '@/lib/component-registry';

interface PropertiesPanelProps {
  config: any;
}

export function PropertiesPanel({ config }: PropertiesPanelProps) {
  // 1. DÉCLARATION DES HOOKS
  const viewMode = useCanvasStore(state => state.viewMode);
  const selectedNodeId = useCanvasStore(state => state.selectedNodeId);
  const selectedEdgeId = useCanvasStore(state => state.selectedEdgeId);
  const nodes = useCanvasStore(state => state.nodes);
  const edges = useCanvasStore(state => state.edges);
  
  const updateNodeLabel = useCanvasStore(state => state.updateNodeLabel);
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);
  const updateEdgeProperties = useCanvasStore(state => state.updateEdgeProperties);
  const onNodesChange = useCanvasStore(state => state.onNodesChange);
  const onEdgesChange = useCanvasStore(state => state.onEdgesChange);

  // 2. SORTIE PRÉCOCE
  if (viewMode === 'SUMMARY') return null;

  // 3. LOGIQUE DE SÉLECTION
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) : null;

  // --- CAS VIDE ---
  if (!selectedNode && !selectedEdge) {
    const EmptySelectionComponent = getDomainPanel(config.id, 'EMPTY_SELECTION');
    return (
      <ResizablePanel initialWidth={360}>
        <div className="h-full bg-slate-50/30 overflow-y-auto p-6">
           {EmptySelectionComponent ? <EmptySelectionComponent /> : (
             <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                  <Settings2 className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">Sélectionnez un élément<br/>pour le configurer.</p>
             </div>
           )}
        </div>
      </ResizablePanel>
    );
  }

  // --- PRÉPARATION DES DONNÉES ---
  const isNode = !!selectedNode;
  const elementId = isNode ? selectedNode!.id : selectedEdge!.id;
  
  let schema: any = null;
  let properties: any = {};
  let label = "";
  let elementType = "";

  if (isNode && selectedNode) {
    elementType = selectedNode.type || (selectedNode.data as any).type; 
    schema = config.nodeTypes[elementType];
    properties = (selectedNode.data as any).properties || {};
    label = (selectedNode.data as any).label;
  } else if (selectedEdge) {
    elementType = (selectedEdge.data as any)?.type || "PIPE"; 
    schema = config.edgeTypes[elementType] || config.edgeTypes["PIPE"];
    properties = selectedEdge.data || {};
    label = schema?.label || "Liaison";
  }

  const handlePropChange = (key: string, value: any) => {
    if (isNode) updateNodeProperties(elementId, { [key]: value });
    else updateEdgeProperties(elementId, { [key]: value });
  };

  // --- COMPOSANTS CUSTOM (Legacy ou Spécifique) ---
  const CustomForm = isNode ? getDomainForm(config.id, elementType) : null;
  const CustomWidget = isNode ? getDomainWidget(config.id, elementType) : null;

  // --- MOTEUR DE RENDU GÉNÉRIQUE ---
  
  // Fonction récursive pour afficher un champ ou une collection
  const renderField = (field: any, value: any, onChange: (val: any) => void) => {
    
    // 1. CHAMP QUANTITÉ (Physique)
    if (field.type === 'quantity' || field.type === 'number') {
        const displayValue = value ?? field.default ?? 0;
        return (
            <div key={field.id} className="space-y-1">
                <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        {field.unitFamily === 'mass' || field.unitFamily === 'concentration' ? <Scale className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                        {field.label}
                    </label>
                    {field.unit && <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">{field.unit}</span>}
                </div>
                <input 
                    type="number" 
                    step="any" 
                    value={displayValue} 
                    onChange={(e) => onChange(parseFloat(e.target.value))} 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
            </div>
        );
    }

    // 2. SÉLECTEUR DE BIBLIOTHÈQUE (Avec Filtre)
    if (field.type === 'library-selector') {
        return (
            <div key={field.id} className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">{field.label}</label>
                <CatalogSelector 
                    category={field.query?.category || []} 
                    nodeId={elementId} // Passe le contexte pour injection directe si besoin
                    // Mais on préfère utiliser le callback générique
                    onSelect={(item: any) => onChange(item.id)}
                    label={value ? "Changer sélection" : "Choisir..."}
                />
                {value && <p className="text-xs font-bold text-blue-600 mt-1 truncate">ID: {value}</p>}
            </div>
        );
    }

    // 3. COLLECTION (Tableau Récursif)
    if (field.type === 'collection') {
        const items = Array.isArray(value) ? value : (field.default || []);
        
        const addItem = () => {
            // Crée un objet vide avec les valeurs par défaut du sous-schéma
            const newItem = field.schema.reduce((acc: any, f: any) => ({ ...acc, [f.id]: f.default }), {});
            onChange([...items, newItem]);
        };

        const updateItem = (idx: number, k: string, v: any) => {
            const newItems = [...items];
            newItems[idx] = { ...newItems[idx], [k]: v };
            onChange(newItems);
        };

        const removeItem = (idx: number) => {
            onChange(items.filter((_: any, i: number) => i !== idx));
        };

        return (
            <div key={field.id} className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                        <List className="w-3 h-3" /> {field.label}
                    </label>
                    <button onClick={addItem} className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-[9px] font-bold uppercase transition-all">
                        <Plus className="w-3 h-3" /> Ajouter
                    </button>
                </div>
                
                <div className="space-y-2">
                    {items.map((item: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative group hover:border-blue-200 transition-all">
                            <div className="grid gap-3">
                                {field.schema.map((subField: any) => (
                                    <div key={subField.id}>
                                        {renderField(subField, item[subField.id], (val) => updateItem(idx, subField.id, val))}
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => removeItem(idx)}
                                className="absolute -top-2 -right-2 bg-white text-slate-300 hover:text-red-500 border p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-[10px] text-slate-300 italic">Aucun élément dans la liste</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 4. CHAMPS STANDARDS (String, Boolean, Select)
    switch (field.type) {
      case 'boolean': return (
        <div key={field.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
          <div className="flex items-center gap-2"><ToggleLeft className="w-4 h-4 text-slate-400" /><span className="text-[10px] font-bold text-slate-600 uppercase">{field.label}</span></div>
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-blue-600 cursor-pointer" />
        </div>
      );
      case 'select': return (
        <div key={field.id} className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><List className="w-3 h-3" /> {field.label}</label>
          <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
             {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      );
      default: return (
        <div key={field.id} className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><Type className="w-3 h-3" /> {field.label}</label>
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
      );
    }
  };

  return (
    <ResizablePanel initialWidth={360}>
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start shrink-0">
        <div>
          <div className={`flex items-center gap-2 mb-1 text-${schema?.color || 'slate-500'}`}>
            {schema?.iconName && <DynamicIcon name={schema.iconName} className="w-4 h-4" />}
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {isNode ? "Configuration" : "Liaison"}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 leading-none truncate max-w-[200px]">
            {schema?.label || "Élément"}
          </h3>
        </div>
        
        <button 
          onClick={() => isNode ? onNodesChange([{ id: elementId, type: 'remove' }]) : onEdgesChange([{ id: elementId, type: 'remove' }])} 
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* NOMMAGE (Toujours présent pour les noeuds) */}
        {isNode && (
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Type className="w-3 h-3" /> Désignation
            </label>
            <input 
              className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
              value={label}
              onChange={(e) => updateNodeLabel(elementId, e.target.value)}
              placeholder="Ex: Cuve 1"
            />
          </div>
        )}

        {/* WIDGETS SPÉCIFIQUES (Haut de page) */}
        {CustomWidget && (
           <div className="border-b border-slate-100 pb-8">
              <CustomWidget nodeId={elementId} />
           </div>
        )}

        {/* FORMULAIRE PRINCIPAL (Générique ou Custom) */}
        {CustomForm ? (
            <CustomForm nodeId={elementId} />
        ) : (
            <div className="space-y-6">
                {schema?.fields && schema.fields.length > 0 ? (
                    <div className="space-y-5">
                        {schema.fields.map((field: any) => 
                            renderField(
                                field, 
                                properties[field.id], 
                                (val) => handlePropChange(field.id, val)
                            )
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                        <p className="text-xs text-slate-400 italic">Aucune propriété configurable.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </ResizablePanel>
  );
}