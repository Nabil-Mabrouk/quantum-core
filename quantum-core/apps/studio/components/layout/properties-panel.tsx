'use client';

import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { 
  Settings2, 
  Info, 
  GitCommitVertical, 
  Plus, 
  Trash2, 
  FlaskConical, 
  Target 
} from 'lucide-react';
import { CatalogSelector } from './catalog-selector';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { getLibrary } from '@/app/actions/library'; // Assurez-vous que cette action existe

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
  const [library, setLibrary] = useState<{ baseUnits: any[], referenceItems: any[] }>({ baseUnits: [], referenceItems: [] });
  const [isAddingComponent, setIsAddingComponent] = useState(false);

  const selectedNode = store.nodes.find((n) => n.id === store.selectedNodeId);
  const selectedEdge = store.edges.find((e) => e.id === store.selectedEdgeId);
  const isNode = !!selectedNode;

  // Charger la bibliothèque au besoin
  useEffect(() => {
    if (isNode && selectedNode.data.type === "TANK") {
      getLibrary(config.id).then(setLibrary);
    }
  }, [isNode, selectedNode?.id, config.id]);

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

  let itemConfig: any, properties: any, update: any, title: string, icon: any;
  
  if (selectedNode) {
    itemConfig = config.nodeTypes[selectedNode.data.type];
    properties = selectedNode.data.properties || {};
    update = (props: any) => store.updateNodeProperties(selectedNode.id, props);
    title = itemConfig.label;
    icon = <DynamicIcon name={itemConfig.iconName} className={`w-4 h-4 text-${itemConfig.color}`} />;
  } else if (selectedEdge) {
    const edgeType = selectedEdge.type?.toUpperCase() === 'DEFAULT' ? 'PIPE' : (selectedEdge.type || 'PIPE');
    itemConfig = config.edgeTypes[edgeType];
    properties = selectedEdge.data || {};
    update = (props: any) => store.updateEdgeProperties(selectedEdge.id, props);
    title = itemConfig?.label || "Liaison";
    icon = <GitCommitVertical className={`w-4 h-4 text-slate-400`} />;
  }

  // --- LOGIQUE COMPOSANTS CHIMIQUES ---
  const nodeComponents = properties.components || [];

  const addComponent = (itemId: string) => {
    const item = library.referenceItems.find(i => i.id === itemId);
    if (!item) return;

    const newComponent = {
      id: crypto.randomUUID(),
      referenceItemId: item.id,
      name: item.name,
      value: 0,
      targetType: 'ARTICLE', // Par défaut cible le produit
      targetBaseUnitId: null
    };

    update({ components: [...nodeComponents, newComponent] });
    setIsAddingComponent(false);
  };

  const removeComponent = (id: string) => {
    update({ components: nodeComponents.filter((c: any) => c.id !== id) });
  };

  const updateComponent = (id: string, data: any) => {
    update({
      components: nodeComponents.map((c: any) => c.id === id ? { ...c, ...data } : c)
    });
  };

  const handleDelete = () => {
    if (isNode && selectedNode) {
      // Pour supprimer un noeud dans ReactFlow via Zustand
      store.onNodesChange([{ id: selectedNode.id, type: 'remove' }]);
    } else if (selectedEdge) {
      // Pour supprimer un lien
      store.onEdgesChange([{ id: selectedEdge.id, type: 'remove' }]);
    }
  };

  return (
    <aside className="w-80 border-l border-slate-200 bg-white flex flex-col h-full shadow-sm overflow-y-auto">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Propriétés {isNode ? 'Équipement' : 'Flux'}
            </h2>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        
        {/* BOUTON SUPPRIMER */}
        <button 
          onClick={handleDelete}
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Supprimer l'élément"
        >
          <Trash2 className="w-4 h-4" />
        </button>
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

        {/* --- SECTION 1 : CHAMPS STATIQUES DU MANIFESTE --- */}
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

        {/* --- SECTION 2 : COMPOSITION CHIMIQUE (TANK/PROCESS ONLY) --- */}
        {isNode && itemConfig.id === "TANK" && (
          <div className="mt-8 border-t pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-3.5 h-3.5 text-purple-500" />
                <h4 className="text-[10px] font-black uppercase text-slate-400">Composition</h4>
              </div>
              <button 
                onClick={() => setIsAddingComponent(true)}
                className="p-1 rounded-md bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Liste des produits ajoutés */}
            <div className="space-y-3">
              {nodeComponents.map((comp: any) => {
                const refItem = library.referenceItems.find(i => i.id === comp.referenceItemId);
                return (
                  <div key={comp.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <p className="text-[11px] font-bold text-slate-700">{comp.name}</p>
                      <button onClick={() => removeComponent(comp.id)}>
                        <Trash2 className="w-3 h-3 text-slate-300 hover:text-red-500" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Cible</label>
                        <select 
                          value={comp.targetType}
                          onChange={(e) => updateComponent(comp.id, { targetType: e.target.value, targetBaseUnitId: null })}
                          className="w-full p-1 text-[10px] border rounded bg-white outline-none"
                        >
                          <option value="ARTICLE">Produit</option>
                          <option value="UNIT">Ion spécifique</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Valeur (g/L)</label>
                        <input 
                          type="number"
                          value={comp.value}
                          onChange={(e) => updateComponent(comp.id, { value: parseFloat(e.target.value) })}
                          className="w-full p-1 text-[10px] border rounded bg-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Si on cible un Ion, on affiche le sélecteur d'Ions présents dans ce produit */}
                    {comp.targetType === 'UNIT' && refItem && (
                      <div className="space-y-1 animate-in slide-in-from-top-1">
                         <label className="text-[8px] font-bold text-purple-500 uppercase flex items-center gap-1">
                           <Target className="w-2 h-2" /> Ion à réguler
                         </label>
                         <select 
                           value={comp.targetBaseUnitId || ''}
                           onChange={(e) => updateComponent(comp.id, { targetBaseUnitId: e.target.value })}
                           className="w-full p-1 text-[10px] border border-purple-100 rounded bg-purple-50/30 outline-none"
                         >
                           <option value="">Sélectionner l'Ion...</option>
                           {refItem.composition.map((c: any) => (
                             <option key={c.baseUnit.id} value={c.baseUnit.id}>
                               {c.baseUnit.symbol} ({c.baseUnit.name})
                             </option>
                           ))}
                         </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Menu de sélection de produit */}
            {isAddingComponent && (
              <div className="p-4 bg-purple-50 border-2 border-purple-100 rounded-xl animate-in zoom-in-95 duration-200">
                <p className="text-[9px] font-black text-purple-400 uppercase mb-2">Choisir un produit</p>
                <select 
                  className="w-full p-2 text-xs border rounded-lg bg-white mb-3"
                  onChange={(e) => addComponent(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>--- Sélectionner ---</option>
                  {library.referenceItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setIsAddingComponent(false)}
                  className="w-full text-[10px] text-slate-400 font-bold uppercase hover:text-slate-600"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700 leading-relaxed italic">
            Les modifications sont enregistrées localement. Cliquez sur <strong>Sauvegarder</strong> pour persister en base.
          </p>
        </div>
      </div>
    </aside>
  );
}