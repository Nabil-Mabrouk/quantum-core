'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { FlowEditor } from '@/components/canvas/flow-editor';
import { SynopticEditor } from '@/components/canvas/synoptic-editor';
import { SequenceManager } from '@/components/layout/sequence-manager';
import { SummaryView } from '@/components/layout/summary-view';
// On supprime l'import de NetworkManager

export function Workspace({ config }: { config: any }) {
  const viewMode = useCanvasStore((state) => state.viewMode);
  const summaryData = useCanvasStore((state) => state.summaryData);

  return (
    <div className="flex-1 relative flex overflow-hidden">
       
       {/* CONTENU PRINCIPAL */}
       {/* pb-12 suffit maintenant (juste pour la barre SequenceManager) */}
       <div className="flex-1 h-full pb-12"> 
         {viewMode === 'GRAPH' && <FlowEditor />}
         {viewMode === 'SYNOPTIC' && <SynopticEditor />}
         {viewMode === 'SUMMARY' && <SummaryView summaryData={summaryData} />}
       </div>
       
       {/* BARRE DU BAS : UNIQUEMENT GAMMES */}
       {viewMode !== 'SUMMARY' && <SequenceManager />}
    </div>
  );
}