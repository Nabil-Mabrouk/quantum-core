import { db } from '@repo/database';
import { NodePalette } from '@/components/layout/node-palette';
import { Header } from '@/components/layout/header';
import { PropertiesPanel } from '@/components/layout/properties-panel';
import { ProjectInitializer } from '@/components/layout/project-initializer';
import { Workspace } from '@/components/layout/workspace'; // Import du nouveau composant

import { loadGraph } from '../../actions/graph';
import { getDomainConfig } from '@/lib/registry';

export default async function EngineeringStudio(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lineId?: string }>;
}) {  
  const { id: projectId } = await props.params;
  const { lineId: searchLineId } = await props.searchParams;
  const config = getDomainConfig();

  const project = await db.project.findUniqueOrThrow({ 
    where: { id: projectId },
    include: { lines: true }
  });
  
  const currentLineId = searchLineId || project.lines[0]?.id;
  if (!currentLineId) return <div>Erreur : Ligne introuvable</div>;

  const initialGraph = await loadGraph(currentLineId);
  const sequencesFromDb = await db.sequence.findMany({
    where: { lineId: currentLineId },
    include: { steps: { orderBy: { order: 'asc' } } }
  });

  const initialSequences = sequencesFromDb.map(s => ({
    id: s.id,
    name: s.name,
    properties: s.properties as Record<string, any>,
    steps: s.steps.map(step => step.nodeId)
  }));

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900">
      <ProjectInitializer 
        projectId={project.id} 
        lineId={currentLineId}
        initialNodes={initialGraph.nodes} 
        initialEdges={initialGraph.edges}
        initialSequences={initialSequences}
      />
      
      <Header 
        config={config} 
        lines={project.lines} 
        currentLineId={currentLineId} 
        projectId={project.id} 
      />

      <main className="flex-1 flex overflow-hidden">
        <NodePalette config={config} />
        
        {/* On utilise le Workspace qui gère le switch GRAPH/SYNOPTIC */}
        <Workspace config={config} />

        <PropertiesPanel config={config} />
      </main>
    </div>
  );
}