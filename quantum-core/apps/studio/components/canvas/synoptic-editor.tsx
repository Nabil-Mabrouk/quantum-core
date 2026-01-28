'use client';

import { useCanvasStore, AppNode } from '@/store/canvas-store';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { useMemo } from 'react';
import { 
  ArrowDown, 
  Map, 
  Layers, 
  Link as LinkIcon, 
  Settings2,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { getDomainConfig } from '@/lib/registry';
import { t } from '@/lib/i18n'; 
import { useParams } from 'next/navigation';
import { Locale } from '@/lib/domain-config';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- COMPOSANT : ÉLÉMENT DE LISTE ORDONNABLE ---

function SortableNodeItem({ node, isSelected, isSequenceMode, locale }: { node: AppNode, isSelected: boolean, isSequenceMode: boolean, locale: Locale }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: node.id, 
    disabled: !isSequenceMode 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const config = getDomainConfig();
  const allNodes = useCanvasStore(state => state.nodes);
  const setSelectedNodeId = useCanvasStore(state => state.setSelectedNodeId);

  const nodeSchema = config.nodeTypes[node.data.type];
  if (!nodeSchema) return null;

  const colorBase = nodeSchema.color.split('-')[0] || "slate";
  const props = (node.data.properties as any) || {};
  
  // Simulation results peut contenir n'importe quoi (Mass balance, AI metrics, etc.)
  const simResults = props.simulationResults || {};
  const accessories = props.accessories || [];

  // 1. Extraction générique des connexions logiques (Wireless)
  const wirelessConnections = useMemo(() => {
    const allFields = nodeSchema.groups.flatMap(g => g.fields);
    return allFields
      .filter(f => f.type === 'node-selector')
      .map(field => {
        const targetId = props[field.id];
        if (targetId) {
          const targetNode = allNodes.find(n => n.id === targetId);
          return {
            id: field.id,
            label: t(field.label, locale),
            targetName: targetNode?.data.label || '?',
          };
        }
        return null;
      })
      .filter((c): c is any => c !== null);
  }, [nodeSchema, props, allNodes, locale]);

  // 2. Champs de résumé dynamiques
  const summaryFields = useMemo(() => {
    return nodeSchema.groups
      .flatMap(g => g.fields)
      .filter(f => (f as any).isSummary);
  }, [nodeSchema]);

  return (
    <div ref={setNodeRef} style={style} className="w-full" {...(isSequenceMode ? { ...attributes, ...listeners } : {})}>
      <div 
        onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
        className={clsx(
          "w-full p-1 rounded-2xl transition-all relative mb-1",
          isSelected ? "bg-slate-900 scale-[1.02] shadow-2xl z-10" : "bg-transparent hover:bg-slate-200/50",
          isSequenceMode && "cursor-grab active:cursor-grabbing",
          isDragging && "opacity-50"
        )}
      >
        <div className={clsx(
          "bg-white border-2 p-5 rounded-xl relative overflow-hidden transition-colors",
          `border-${colorBase}-100 hover:border-${colorBase}-300`,
          isSelected ? "border-transparent" : "border-slate-100"
        )}>
          {/* Header & Summary */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className={clsx("p-3 rounded-2xl shadow-sm", `bg-${colorBase}-50 text-${colorBase}-600`)}>
                <DynamicIcon name={nodeSchema.iconName} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className={clsx("text-[8px] px-2 py-0.5 rounded-full font-black uppercase", `bg-${colorBase}-100 text-${colorBase}-700`)}>
                        {t(nodeSchema.label, locale)}
                    </span>
                    {isSequenceMode && <Settings2 className="w-3 h-3 text-slate-300" />}
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-none">{node.data.label}</h3>
              </div>
            </div>
            
            {/* Métriques de résumé dynamiques */}
            <div className="text-right space-y-1">
                {summaryFields.map((f: any) => (
                    <div key={f.id} className="text-[10px] font-mono font-bold text-slate-500">
                        {props[f.id]} <span className="opacity-40 uppercase">{f.unit || ""}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Section Accessoires GÉNERIQUE */}
          {accessories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
               {accessories.map((acc: any, i: number) => (
                 <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                    {/* Fallback sur une icône Activity si l'accessoire n'a pas d'icône définie */}
                    <DynamicIcon name={acc.iconName || 'Activity'} className="w-3 h-3 text-slate-400" />
                    <span className="text-[8px] font-black uppercase text-slate-600">
                        {acc.label || acc.type}
                    </span>
                 </div>
               ))}
            </div>
          )}

          {/* RÉSULTATS DE SIMULATION GÉNÉRIQUES
              Le manifeste peut définir une clé "mainResultsKey" (ex: "concentrations" ou "performance")
          */}
          {simResults && Object.keys(simResults).length > 0 && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 pt-4 border-t border-slate-50">
               {/* On itère sur les clés de simulation de manière agnostique */}
               {Object.entries(simResults).map(([key, val]: any) => {
                 if (typeof val === 'object') return null; // On n'affiche que les valeurs simples ici
                 return (
                    <div key={key} className="space-y-1">
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                            <span>{key}</span>
                            <span className="text-slate-900">{val}</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={clsx("h-full rounded-full", `bg-${colorBase}-500`)} 
                                 style={{ width: `${Math.min(Number(val), 100)}%` }} />
                        </div>
                    </div>
                 );
               })}
            </div>
          )}
          
          {/* Connexions logiques (Utilities/Bus) */}
          {wirelessConnections.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {wirelessConnections.map((conn: any) => (
                <div key={conn.id} className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">{conn.label}</span>
                  <LinkIcon className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-bold text-slate-700">{conn.targetName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---

export function SynopticEditor() {
  const { nodes, sequences, selectedSequenceId, synopticMode, updateSequenceSteps, setSelectedNodeId, selectedNodeId } = useCanvasStore();
  
  const params = useParams();
  const locale = (params.locale as Locale) || 'fr';
  const config = getDomainConfig();

  const { orderedNodes, title, subTitle, activeSeq } = useMemo(() => {
    const _activeSeq = sequences.find(s => s.id === selectedSequenceId);
    
    // Le scope filtré peut être paramétré dans le manifeste futur, par défaut PROCESS
    const processNodes = nodes.filter(n => config.nodeTypes[n.type]?.scope === 'PROCESS');

    if (synopticMode === 'SEQUENCE' && _activeSeq) {
      const nodesInSequence = new Set(_activeSeq.steps);
      const ordered = _activeSeq.steps
        .map(stepId => nodes.find(n => n.id === stepId))
        .filter((n): n is AppNode => n !== undefined);
      
      const remaining = processNodes.filter(n => !nodesInSequence.has(n.id));

      return { 
        orderedNodes: [...ordered, ...remaining], 
        title: _activeSeq.name, 
        subTitle: locale === 'fr' ? `Gamme opératoire (${ordered.length} étapes)` : `Operating sequence (${ordered.length} steps)`, 
        activeSeq: _activeSeq 
      };
    } else {
      return {
        orderedNodes: [...processNodes].sort((a, b) => a.position.x - b.position.x),
        title: locale === 'fr' ? "Implantation Physique" : "Physical Layout",
        subTitle: locale === 'fr' ? "Ordre géographique des équipements" : "Geographic order of assets",
        activeSeq: null
      };
    }
  }, [nodes, sequences, selectedSequenceId, synopticMode, config, locale]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id && activeSeq) {
      const oldIndex = activeSeq.steps.indexOf(active.id as string);
      const newIndex = activeSeq.steps.indexOf(over.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
          updateSequenceSteps(activeSeq.id, arrayMove(activeSeq.steps, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="flex h-full bg-slate-50/50 overflow-hidden relative" onClick={() => setSelectedNodeId(null)}>
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="text-center animate-in fade-in slide-in-from-top-2 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 shadow-sm">
                {synopticMode === 'PHYSICAL' ? <Map className="w-3 h-3" /> : <Layers className="w-3 h-3 text-blue-500" />}
                {t(synopticMode === 'PHYSICAL' ? {fr: 'Vue Implantation', en: 'Layout View'} : {fr: 'Vue Procédé', en: 'Process View'}, locale)}
            </div>
            <h2 className={clsx("text-4xl font-black tracking-tighter transition-colors", synopticMode === 'SEQUENCE' && activeSeq ? "text-blue-600" : "text-slate-900")}>
                {title}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{subTitle}</p>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={activeSeq?.steps || []} strategy={verticalListSortingStrategy}>
              <div className="space-y-0 pb-32">
                {orderedNodes.map((node, idx) => {
                  const isInSequence = activeSeq?.steps.includes(node.id) ?? false;
                  return (
                      <div key={node.id} className="flex flex-col items-center">
                         <SortableNodeItem
                           node={node}
                           isSelected={selectedNodeId === node.id}
                           isSequenceMode={synopticMode === 'SEQUENCE' && isInSequence}
                           locale={locale}
                         />
                         {idx < orderedNodes.length - 1 && (
                           <div className="h-12 flex items-center justify-center">
                             <div className={clsx("h-full w-0.5 relative transition-colors", isInSequence && synopticMode === 'SEQUENCE' ? "bg-blue-300" : "bg-slate-200")}>
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
        </div>
      </div>
    </div>
  );
}