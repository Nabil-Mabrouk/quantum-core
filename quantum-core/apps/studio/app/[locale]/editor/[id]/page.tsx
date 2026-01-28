import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { ProjectInitializer } from '@/components/layout/project-initializer';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { EditorClientLayout } from '@/components/layout/editor-client-layout'; // Import du nouveau wrapper
import { loadGraph } from '@/app/actions/graph';
import { getDomainConfig } from '@/lib/registry';

export default async function EngineeringStudio(props: {
  params: Promise<{ id: string, locale: string }>;
  searchParams: Promise<{ systemId?: string }>;
}) {  
  // 1. Résolution des paramètres (Pattern Next.js 15)
  const { id: projectId } = await props.params;
  const { systemId: searchSystemId } = await props.searchParams;

  // 2. Chargement du projet
  const project = await db.project.findUnique({ 
    where: { id: projectId },
    include: { systems: true }
  });
  
  if (!project) notFound();

  // 3. Détermination du système courant
  const currentSystemId = searchSystemId || project.systems[0]?.id;
  
  if (!currentSystemId) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
            <p className="text-slate-500 font-bold">Aucun système trouvé pour cette étude.</p>
        </div>
    );
  }

  // 4. Configuration métier
  const config = getDomainConfig(project.domain);

  // 5. Chargement initial des données (Graphe + Séquences)
  // loadGraph a déjà été optimisé dans notre étape précédente
  const initialGraph = await loadGraph(currentSystemId);

  // Mapping des séquences (On s'assure d'avoir un tableau propre)
  const initialSequences = initialGraph.sequences || [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900">
      
      {/* BARRE LATÉRALE (Statique au niveau layout) */}
      <SideNav projectId={projectId} systemId={currentSystemId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER (Nécessite domainId pour son propre filtrage) */}
        <UniversalHeader 
          projectName={project.name}
          projectId={projectId}
          domainId={project.domain} // 🚩 Requis par notre Header dynamique
          systems={project.systems}
          currentSystemId={currentSystemId}
        />

        {/* INITIALISATION DU STORE (Passerelle Serveur -> Client) */}
        <ProjectInitializer 
          projectId={project.id} 
          systemId={currentSystemId}
          initialNodes={initialGraph.nodes} 
          initialEdges={initialGraph.edges}
          initialSequences={initialSequences}
        />

        {/* 🚩 LE WRAPPER CLIENT
            C'est lui qui décidera d'afficher ou non les colonnes 
            NodePalette et PropertiesPanel en fonction de viewMode */}
        <EditorClientLayout config={config} />

      </div>
    </div>
  );
}