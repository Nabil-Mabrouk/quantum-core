// apps/studio/app/[locale]/project/[id]/page.tsx
import { db } from '@repo/database';
import { getProjectTopology } from '@/app/actions/stream'; // Vérifiez que le chemin inclut [locale] si vous avez déplacé les actions
import { BlueprintFlow } from '@/components/canvas/blueprint/blueprint-flow';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { GenericReportViewer } from '@/components/layout/generic-report-viewer';
import { auth } from "@/auth";
import { getDictionary, Locale } from '@/lib/i18n';

export default async function ProjectBlueprintPage(props: { 
  params: Promise<{ id: string; locale: string }>; // Correction : ajout de locale
  searchParams: Promise<{ view?: string }>; 
}) {
  // 1. Extraction asynchrone des paramètres
  const { id, locale } = await props.params;
  const searchParams = await props.searchParams;
  const view = searchParams?.view; // Utilisation sécurisée
  
  const dict = getDictionary(locale as Locale);
  const session = await auth();
  const currentView = view || 'map'; 

  // 2. Récupération sécurisée du projet (findUnique pour gérer l'erreur nous-même)
  const project = await db.project.findUnique({
    where: { 
      id,
      userId: session?.user?.id, // Sécurité : propriétaire uniquement
    },
    include: { systems: true, streams: true }
  });

  if (!project) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-200">
          <p className="text-slate-900 font-black text-xl">
            {locale === 'fr' ? "Projet introuvable ou accès refusé." : "Project not found or access denied."}
          </p>
        </div>
      </div>
    );
  }

  // 3. Fetch topology
  const { systems, streams } = await getProjectTopology(id);

  // 4. Prepare Nodes (Systems)
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

  // 5. Prepare Edges (Streams)
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
  }).filter((e): e is NonNullable<typeof e> => e !== null); // Type-guard pour TypeScript

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900">
      {/* On passe le locale à la SideNav si elle en a besoin, 
          sinon elle utilisera useParams() côté client */}
      <SideNav projectId={id} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <UniversalHeader 
          projectName={project.name} 
          projectId={id}
          systems={project.systems}
        />

        <main className="flex-1 relative bg-slate-50 overflow-hidden">
           {currentView === 'summary' ? (
              <div className="h-full overflow-y-auto custom-scrollbar">
                 <GenericReportViewer domain={project.domain} /> 
              </div>
           ) : (
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