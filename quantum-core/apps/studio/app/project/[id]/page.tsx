import { db } from '@repo/database';
import { getProjectTopology } from '@/app/actions/stream';
import { BlueprintFlow } from '@/components/canvas/blueprint/blueprint-flow';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
// NOUVEAU : Import du viewer générique
import { GenericReportViewer } from '@/components/layout/generic-report-viewer';
import { auth } from "@/auth";
export default async function ProjectBlueprintPage(props: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ view?: string }> 
}) {
  const { id } = await props.params;
  const session = await auth();

  const { view } = await props.searchParams;
  const currentView = view || 'map'; 

  // 1. Fetch project details
  const project = await db.project.findUniqueOrThrow({
    where: { id,userId: session?.user?.id,},
    include: { systems: true, streams: true }
  });

  if (!project) {
    // Si le projet n'existe pas OU ne m'appartient pas -> 404 (pour ne pas confirmer l'existence de l'ID)
    return <div>Projet introuvable ou accès refusé.</div>;
  }
  // 2. Fetch topology
  const { systems, streams } = await getProjectTopology(id);

  // 3. Prepare Nodes (Systems)
  const initialNodes = systems.map((sys) => ({
    id: sys.id,
    type: 'systemNode',
    position: { x: sys.positionX, y: sys.positionY },
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
      <SideNav projectId={id} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <UniversalHeader 
          projectName={project.name} 
          projectId={id}
          systems={project.systems}
        />

        <main className="flex-1 relative bg-slate-50 overflow-hidden">
           {currentView === 'summary' ? (
              // VUE BILAN : Rendu Générique via le Wrapper Client
              <div className="h-full overflow-y-auto custom-scrollbar">
                 <GenericReportViewer domain={project.domain} /> 
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