'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  Settings2, 
  Trash2, 
  Type, 
  Hash, 
  List, 
  ToggleLeft, 
  FileText 
} from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { ResizablePanel } from '@/components/ui/resizable-panel';

// --- IMPORT DU REGISTRE (Le cœur de la généricité) ---
import { 
  getDomainForm, 
  getDomainWidget, 
  getDomainPanel 
} from '@/lib/component-registry';

interface PropertiesPanelProps {
  config: any;
}

export function PropertiesPanel({ config }: PropertiesPanelProps) {
  // 1. Récupération de l'état (Hooks optimisés)
  const selectedNodeId = useCanvasStore(state => state.selectedNodeId);
  const selectedEdgeId = useCanvasStore(state => state.selectedEdgeId);
  const nodes = useCanvasStore(state => state.nodes);
  const edges = useCanvasStore(state => state.edges);
  
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) : null;
  
  // Actions
  const updateNodeLabel = useCanvasStore(state => state.updateNodeLabel);
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);
  const updateEdgeProperties = useCanvasStore(state => state.updateEdgeProperties);
  const onNodesChange = useCanvasStore(state => state.onNodesChange);
  const onEdgesChange = useCanvasStore(state => state.onEdgesChange);

  // --- CAS 1 : RIEN N'EST SÉLECTIONNÉ ---
  // On affiche le "Panneau de Fond" du domaine (ex: Gestionnaire de Réseaux pour l'Eau)
  if (!selectedNode && !selectedEdge) {
    const EmptySelectionComponent = getDomainPanel(config.id, 'EMPTY_SELECTION');

    return (
      <ResizablePanel initialWidth={360}>
        <div className="h-full bg-slate-50/30 overflow-y-auto p-6">
           {EmptySelectionComponent ? (
             <EmptySelectionComponent />
           ) : (
             <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                  <Settings2 className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">
                  Sélectionnez un élément<br/>pour le configurer.
                </p>
             </div>
           )}
        </div>
      </ResizablePanel>
    );
  }

  // --- PRÉPARATION DES DONNÉES DE L'ÉLÉMENT ---
  const isNode = !!selectedNode;
  const elementId = isNode ? selectedNode.id : selectedEdge.id;
  
  let schema: any = null;
  let properties: any = {};
  let label = "";
  let elementType = "";

  if (isNode) {
    elementType = selectedNode.type || selectedNode.data.type; 
    schema = config.nodeTypes[elementType];
    properties = selectedNode.data.properties || {};
    label = selectedNode.data.label;
  } else {
    elementType = selectedEdge.data?.type || "PIPE"; 
    schema = config.edgeTypes[elementType] || config.edgeTypes["PIPE"];
    properties = selectedEdge.data || {};
    label = schema?.label || "Liaison";
  }

  const handlePropChange = (key: string, value: any) => {
    if (isNode) updateNodeProperties(elementId, { [key]: value });
    else updateEdgeProperties(elementId, { [key]: value });
  };

  // --- RÉCUPÉRATION DES COMPOSANTS DOMAINE ---
  // On demande au registre : "Existe-t-il un formulaire spécial pour ce type ?"
  const CustomForm = isNode ? getDomainForm(config.id, elementType) : null;
  // On demande : "Existe-t-il un widget additionnel (ex: Bilan) ?"
  const CustomWidget = isNode ? getDomainWidget(config.id, elementType) : null;


  // --- HELPER RENDU CHAMPS STANDARDS ---
  const renderField = (field: any) => {
    const value = properties[field.id] ?? field.default ?? "";
    switch (field.type) {
      case 'boolean': return (
        <div key={field.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2"><ToggleLeft className="w-4 h-4 text-slate-400" /><span className="text-[10px] font-bold text-slate-600 uppercase">{field.label}</span></div>
          <input type="checkbox" checked={!!value} onChange={(e) => handlePropChange(field.id, e.target.checked)} className="w-4 h-4 accent-blue-600 cursor-pointer" />
        </div>
      );
      case 'select': return (
        <div key={field.id} className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><List className="w-3 h-3" /> {field.label}</label>
          <select value={value} onChange={(e) => handlePropChange(field.id, e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20">{field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}</select>
        </div>
      );
      case 'number': return (
        <div key={field.id} className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase flex justify-between"><span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {field.label}</span>{field.unit && <span className="text-blue-500 lowercase">{field.unit}</span>}</label>
          <input type="number" step="any" value={value} onChange={(e) => handlePropChange(field.id, parseFloat(e.target.value))} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-medium outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
      );
      default: return (
        <div key={field.id} className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><Type className="w-3 h-3" /> {field.label}</label>
          <input type="text" value={value} onChange={(e) => handlePropChange(field.id, e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
      );
    }
  };

  return (
    <ResizablePanel initialWidth={360}>
      
      {/* HEADER DE LA SÉLECTION */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start shrink-0">
        <div>
          <div className={`flex items-center gap-2 mb-1 text-${schema?.color || 'slate-500'}`}>
            {schema?.iconName && <DynamicIcon name={schema.iconName} className="w-4 h-4" />}
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {isNode ? "Propriétés" : "Liaison"}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 leading-none truncate max-w-[200px]">
            {schema?.label || "Élément"}
          </h3>
        </div>
        
        {/* Bouton Supprimer */}
        <button 
          onClick={() => isNode ? onNodesChange([{ id: elementId, type: 'remove' }]) : onEdgesChange([{ id: elementId, type: 'remove' }])} 
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* 1. IDENTITÉ (NOM) */}
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

        {/* 2. INJECTION DU WIDGET DOMAINE (Si présent) */}
        {CustomWidget && (
           <div className="border-b border-slate-100 pb-8">
              <CustomWidget nodeId={elementId} />
           </div>
        )}

        {/* 3. FORMULAIRE DE PROPRIÉTÉS */}
        {CustomForm ? (
            // A. Formulaire Spécifique Intelligent (ex: WaterTankForm)
            <CustomForm nodeId={elementId} />
        ) : (
            // B. Formulaire Générique (Boucle sur les champs du JSON)
            <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 mb-2">
                    <FileText className="w-3 h-3" /> Caractéristiques
                </h4>
                {schema?.fields && schema.fields.length > 0 ? (
                    <div className="space-y-4">
                        {schema.fields.map((field: any) => renderField(field))}
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                        <p className="text-xs text-slate-400 italic">Aucune propriété standard.</p>
                    </div>
                )}
            </div>
        )}

      </div>
    </ResizablePanel>
  );
}