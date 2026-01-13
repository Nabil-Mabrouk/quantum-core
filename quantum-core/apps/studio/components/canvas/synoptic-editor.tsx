'use client';

import { useCanvasStore, AppNode } from '@/store/canvas-store';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { useMemo } from 'react';
import { 
  ArrowDown, 
  AlertTriangle, 
  Map, 
  Layers, 
  Link as LinkIcon, 
  Zap, 
  Hash 
} from 'lucide-react';
import { clsx } from 'clsx';
import { getDomainConfig } from '@/lib/registry';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- SORTABLE NODE COMPONENT ---

function SortableNodeItem({ node, isSelected, isSequenceMode }: { node: AppNode, isSelected: boolean, isSequenceMode: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: node.id, 
    disabled: !isSequenceMode 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = getDomainConfig();
  const allNodes = useCanvasStore(state => state.nodes);
  const setSelectedNodeId = useCanvasStore(state => state.setSelectedNodeId);

  // Détermination du style via le manifeste
  const nodeType = node.data.type;
  const nodeSchema = config.nodeTypes[nodeType];
  
  const nodeStyle = {
    label: nodeSchema?.label || nodeType,
    iconName: nodeSchema?.iconName || "Box",
    colorClass: nodeSchema?.color?.split('-')[0] || "slate",
  };

  const props = node.data.properties || {};
  const simResults = props.simulationResults || {};
  const warnings = simResults.warnings || [];

  // --- LOGIQUE DES BADGES SANS FIL (Wireless) ---
  const wirelessConnections = useMemo(() => {
    if (!nodeSchema) return [];

    return nodeSchema.fields
      .map(field => {
        if (field.type === 'node-selector') {
          const targetId = props[field.id];
          if (targetId) {
            const targetNode = allNodes.find(n => n.id === targetId);
            return {
              id: field.id,
              // On utilise le label du champ comme catégorie du badge
              category: field.label || 'Lien', 
              targetLabel: targetNode?.data.label || 'Élément inconnu',
            };
          }
        }
        return null;
      })
      .filter((c): c is { id: string; category: string; targetLabel: string } => c !== null);
  }, [node, allNodes, nodeSchema, props]);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="w-full"
      {...(isSequenceMode ? { ...attributes, ...listeners } : {})}
    >
      <div 
        onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
        className={clsx(
          "w-full p-1 rounded-2xl transition-all relative mb-1",
          isSelected ? "bg-slate-900 scale-[1.02] shadow-2xl z-10" : "bg-transparent hover:bg-slate-200/50",
          isSequenceMode && "cursor-grab active:cursor-grabbing"
        )}
      >
        <div className={clsx(
          "bg-white border-2 p-5 rounded-xl relative overflow-hidden transition-colors",
          `border-${nodeStyle.colorClass}-100 hover:border-${nodeStyle.colorClass}-300`,
          isSelected ? "border-transparent" : ""
        )}>
          {/* Header de la carte */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className={clsx(
                "p-3 rounded-2xl shadow-sm",
                `bg-${nodeStyle.colorClass}-50 text-${nodeStyle.colorClass}-600`
              )}>
                <DynamicIcon name={nodeStyle.iconName} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase bg-${nodeStyle.colorClass}-100 text-${nodeStyle.colorClass}-700`}>
                        {nodeStyle.label}
                    </span>
                    {isSequenceMode && <Zap className="w-3 h-3 text-orange-400 animate-pulse" />}
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-none">{node.data.label}</h3>
              </div>
            </div>

            {/* Propriétés de résumé (isSummary) */}
            <div className="text-right">
                 {nodeSchema?.fields.filter(f => (f as any).isSummary).slice(0, 2).map(f => (
                     <div key={f.id} className="text-[10px] font-mono font-bold text-slate-500">
                         {props[f.id]} <span className="opacity-50 uppercase">{f.label}</span>
                     </div>
                 ))}
            </div>
          </div>
          
          {/* Alertes de simulation */}
          {warnings.length > 0 && (
            <div className="space-y-1 mb-4">
                {warnings.map((w: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                        <AlertTriangle className="w-3 h-3" /> {w.message}
                    </div>
                ))}
            </div>
          )}

          {/* Métriques de Simulation (Concentrations, etc.) */}
          {simResults.concentrations && Object.keys(simResults.concentrations).length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-50">
                  {Object.entries(simResults.concentrations).map(([ion, val]: any) => (
                      <div key={ion} className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                              <span>{ion}</span>
                              <span className="text-slate-900">{val} g/L</span>
                          </div>
                          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full bg-${nodeStyle.colorClass}-500`} style={{ width: `${Math.min((val/50)*100, 100)}%` }} />
                          </div>
                      </div>
                  ))}
              </div>
          )}
          
          {/* Badges Wireless */}
          {wirelessConnections.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {wirelessConnections.map(conn => (
                <div key={conn.id} className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{conn.category}</span>
                  <LinkIcon className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-bold text-slate-700">{conn.targetLabel}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN EDITOR COMPONENT ---

export function SynopticEditor() {
  const nodes = useCanvasStore(state => state.nodes);
  const sequences = useCanvasStore(state => state.sequences);
  const selectedSequenceId = useCanvasStore(state => state.selectedSequenceId);
  const synopticMode = useCanvasStore(state => state.synopticMode);
  const setSelectedNodeId = useCanvasStore(state => state.setSelectedNodeId);
  const selectedNodeId = useCanvasStore(state => state.selectedNodeId);
  const updateSequenceSteps = useCanvasStore(state => state.updateSequenceSteps);

  // Ordonnancement réactif
  const { orderedNodes, title, subTitle, activeSeq } = useMemo(() => {
    const _activeSeq = sequences.find(s => s.id === selectedSequenceId);
    
    if (synopticMode === 'SEQUENCE' && _activeSeq) {
      const nodesInSequence = new Set(_activeSeq.steps);
      // 1. Les noeuds de la gamme dans l'ordre
      const ordered = _activeSeq.steps.map(stepId => nodes.find(n => n.id === stepId)).filter(Boolean) as AppNode[];
      // 2. Les noeuds hors-gamme à la suite (pour pouvoir les ajouter)
      const remaining = nodes.filter(n => !n.id.startsWith('edge-') && !nodesInSequence.has(n.id));
      
      return { 
        orderedNodes: [...ordered, ...remaining], 
        title: _activeSeq.name, 
        subTitle: `Gamme de fabrication (${ordered.length} étapes)`, 
        activeSeq: _activeSeq 
      };
    } else {
      // Mode Implantation : Tri géographique
      return {
        orderedNodes: nodes.filter(n => !n.id.startsWith('edge-')).sort((a, b) => a.position.x - b.position.x),
        title: "Implantation Physique",
        subTitle: "Positionnement réel dans l'atelier (Axe X)",
        activeSeq: null
      };
    }
  }, [nodes, sequences, selectedSequenceId, synopticMode]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id && activeSeq) {
      const oldIndex = activeSeq.steps.indexOf(active.id as string);
      const newIndex = activeSeq.steps.indexOf(over.id as string);
      
      if (oldIndex !== -1 && newIndex !== -1) {
          const newSteps = arrayMove(activeSeq.steps, oldIndex, newIndex);
          updateSequenceSteps(activeSeq.id, newSteps);
      }
    }
  }

  return (
    <div className="flex h-full bg-slate-50/50 overflow-hidden relative" onClick={() => setSelectedNodeId(null)}>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="text-center animate-in fade-in slide-in-from-top-2 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 shadow-sm">
                {synopticMode === 'PHYSICAL' ? <Map className="w-3 h-3" /> : <Layers className="w-3 h-3 text-blue-500" />}
                Vue {synopticMode === 'PHYSICAL' ? 'Implantation' : 'Logicielle'}
            </div>
            <h2 className={clsx(
                "text-4xl font-black tracking-tighter transition-colors", 
                synopticMode === 'SEQUENCE' && activeSeq ? "text-blue-600" : "text-slate-900"
            )}>
                {title}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{subTitle}</p>
          </div>

          {orderedNodes.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Aucun équipement disponible
              </p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={activeSeq?.steps || []} strategy={verticalListSortingStrategy}>
                <div className="space-y-0 pb-20">
                  {orderedNodes.map((node: AppNode, idx: number) => {
                    const isInSequence = activeSeq?.steps.includes(node.id) ?? false;
                    
                    return (
                        <div key={node.id} className="flex flex-col items-center">
                           <SortableNodeItem
                             node={node}
                             isSelected={selectedNodeId === node.id}
                             isSequenceMode={synopticMode === 'SEQUENCE' && isInSequence}
                           />
                           
                           {/* Flèche de liaison */}
                           {idx < orderedNodes.length - 1 && (
                             <div className="h-10 flex items-center justify-center">
                               <div className={clsx(
                                   "h-full w-0.5 relative transition-colors",
                                   isInSequence && synopticMode === 'SEQUENCE' ? "bg-blue-300" : "bg-slate-200"
                               )}>
                                 {synopticMode === 'SEQUENCE' && isInSequence && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-50 text-blue-500 p-1 rounded-full border border-blue-100 shadow-sm">
                                      <ArrowDown className="w-3 h-3" />
                                    </div>
                                 )}
                               </div>
                             </div>
                           )}
                        </div>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}