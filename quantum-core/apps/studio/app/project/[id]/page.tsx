import { db } from '@repo/database';
import { getProjectTopology } from '@/app/actions/stream';
import { BlueprintFlow } from '@/components/canvas/blueprint/blueprint-flow';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { AnalysisReport } from '@/components/domains/water/analysis-report';
import { getDomainConfig } from '@/lib/registry';

export default async function ProjectBlueprintPage(props: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ view?: string }> 
}) {
  const { id } = await props.params;
  const { view } = await props.searchParams;
  const currentView = view || 'map'; // 'map' (Blueprint) ou 'summary' (Bilan)

  const config = getDomainConfig();

  // 1. Fetch project details
  const project = await db.project.findUniqueOrThrow({
    where: { id },
    include: { systems: true, streams: true }
  });

  // 2. Fetch topology
  const { systems, streams } = await getProjectTopology(id);

  // 3. Prepare Nodes (Systems) avec positions DB
  const initialNodes = systems.map((sys) => ({
    id: sys.id,
    type: 'systemNode',
    position: { x: sys.positionX, y: sys.positionY }, // Persistance de la position
    data: { 
        id: sys.id,
        label: sys.name, 
        type: sys.type, 
        projectId: id,
        inputCount: sys.nodes.filter(n => n.inputStreamId).length,
        outputCount: sys.nodes.filter(n => n.outputStreamId).length,
    }
  }));

  // 4. Prepare Edges (Streams)
  const initialEdges = streams.map(stream => {
    const sourceSys = systems.find(s => s.nodes.some(n => n.outputStreamId === stream.id));
    const targetSys = systems.find(s => s.nodes.some(n => n.inputStreamId === stream.id));

    if (sourceSys && targetSys) {
      return {
        id: stream.id,
        source: sourceSys.id,
        target: targetSys.id,
        label: stream.name,
        animated: (stream.value as any)?.flow > 0,
        style: { stroke: '#3b82f6', strokeWidth: 4 },
        labelStyle: { fill: '#3b82f6', fontWeight: 800, fontSize: 10 }
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900">
      {/* BARRE LATÉRALE */}
      <SideNav projectId={id} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER UNIFIÉ (Gère les onglets Plan / Bilan) */}
        <UniversalHeader 
          projectName={project.name} 
          projectId={id}
          systems={project.systems}
        />

        <main className="flex-1 relative bg-slate-50 overflow-hidden">
           {currentView === 'summary' ? (
              // VUE BILAN PLEIN ÉCRAN
              <div className="h-full overflow-y-auto custom-scrollbar">
                 <AnalysisReport /> 
              </div>
           ) : (
              // VUE BLUEPRINT (CARTE)
              <BlueprintFlow 
                projectId={id} 
                initialNodes={initialNodes} 
                initialEdges={initialEdges} 
              />
           )}
        </main>
      </div>
    </div>
  );
}