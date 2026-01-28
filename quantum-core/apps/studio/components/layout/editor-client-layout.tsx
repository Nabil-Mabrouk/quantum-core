'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { NodePalette } from '@/components/layout/node-palette';
import { PropertiesPanel } from '@/components/layout/properties-panel';
import { Workspace } from '@/components/layout/workspace';
import { DomainManifest } from '@/lib/domain-config';

export function EditorClientLayout({ config }: { config: DomainManifest }) {
  // Ici, on est côté client, on peut utiliser Zustand !
  const viewMode = useCanvasStore((s) => s.viewMode);

  return (
    <main className="flex-1 flex overflow-hidden bg-slate-50">
      {/* 🚩 On cache la palette si on est en mode Séquences ou Bilan */}
      {viewMode !== 'SEQUENCES' && viewMode !== 'SUMMARY' && (
        <NodePalette config={config} />
      )}
      
      <Workspace config={config} />

      {/* 🚩 On cache le panneau de propriétés si on est en mode Séquences ou Bilan */}
      {viewMode !== 'SEQUENCES' && viewMode !== 'SUMMARY' && (
        <PropertiesPanel config={config} />
      )}
    </main>
  );
}