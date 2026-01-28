'use client';

import { useEffect } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { FlowEditor } from '@/components/canvas/flow-editor';
import { SynopticEditor } from '@/components/canvas/synoptic-editor';
import { SequenceManager } from '@/components/layout/sequence-manager'; // Utilisé comme vue full page
import { SummaryView } from '@/components/layout/summary-view';
import { DomainManifest } from '@/lib/domain-config';

export function Workspace({ config }: { config: DomainManifest }) {
  const viewMode = useCanvasStore((state) => state.viewMode);
  const setViewMode = useCanvasStore((state) => state.setViewMode);
  const summaryData = useCanvasStore((state) => state.summaryData);

  // SÉCURITÉ : Fallback si la vue n'est pas supportée par le domaine
  useEffect(() => {
    if (!config.ui.enabledViews.includes(viewMode)) {
      setViewMode(config.ui.defaultView);
    }
  }, [viewMode, config, setViewMode]);

  const isEnabled = (view: any) => config.ui.enabledViews.includes(view);

  return (
    <div className="flex-1 relative flex overflow-hidden bg-white">
       <div className="flex-1 h-full"> 
         {viewMode === 'GRAPH' && isEnabled('GRAPH') && <FlowEditor />}
         
         {viewMode === 'SYNOPTIC' && isEnabled('SYNOPTIC') && <SynopticEditor />}
         
         {/* 🚩 NOUVEAU : La vue Séquence occupe maintenant tout l'espace */}
         {viewMode === 'SEQUENCES' && isEnabled('SEQUENCES') && <SequenceManager isFullPage={true} />}
         
         {viewMode === 'SUMMARY' && isEnabled('SUMMARY') && (
            <SummaryView summaryData={summaryData} domain={config.id} />
         )}

         {!isEnabled(viewMode) && (
            <div className="h-full flex items-center justify-center italic text-slate-400">
               Chargement du mode de vue...
            </div>
         )}
       </div>
    </div>
  );
}