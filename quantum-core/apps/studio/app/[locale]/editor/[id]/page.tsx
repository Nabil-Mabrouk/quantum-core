import { db } from '@repo/database';
import { notFound } from 'next/navigation'; // <--- Import pour la gestion 404
import { NodePalette } from '@/components/layout/node-palette';
import { PropertiesPanel } from '@/components/layout/properties-panel';
import { ProjectInitializer } from '@/components/layout/project-initializer';
import { Workspace } from '@/components/layout/workspace';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';

import { loadGraph } from '@/app/actions/graph';
import { getDomainConfig } from '@/lib/registry';

export default async function EngineeringStudio(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ systemId?: string }>;
}) {  
  const { id: projectId } = await props.params;
  const { systemId: searchSystemId } = await props.searchParams;

  // 1. Chargement sécurisé du projet
  // On utilise findUnique au lieu de findUniqueOrThrow
  const project = await db.project.findUnique({ 
    where: { id: projectId },
    include: { systems: true }
  });
  
  // 2. Si le projet n'existe pas, on affiche la page 404 de Next.js
  if (!project) {
    notFound();
  }

  // 3. Détermination du système courant
  // On prend soit l'ID dans l'URL, soit le premier système du projet
  const currentSystemId = searchSystemId || project.systems[0]?.id;
  
  if (!currentSystemId) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <p className="text-slate-500 font-bold">Aucun système trouvé pour cette étude.</p>
            </div>
        </div>
    );
  }

  // 4. Chargement de la configuration du domaine spécifique au projet
  const config = getDomainConfig(project.domain);

  // 5. Chargement des données du graphe et des séquences
  const initialGraph = await loadGraph(currentSystemId);
  const sequencesFromDb = await db.sequence.findMany({
    where: { systemId: currentSystemId },
    include: { steps: { orderBy: { order: 'asc' } } }
  });

  const initialSequences = sequencesFromDb.map(s => ({
    id: s.id,
    name: s.name,
    properties: s.properties as Record<string, any>,
    steps: s.steps.map(step => step.nodeId)
  }));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900">
      
      {/* BARRE LATÉRALE (Navigation Contextuelle) */}
      <SideNav projectId={projectId} systemId={currentSystemId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER UNIFIÉ */}
        <UniversalHeader 
          projectName={project.name}
          projectId={projectId}
          systems={project.systems}
          currentSystemId={currentSystemId}
        />

        {/* INITIALISATION DU STORE CLIENT (Données du serveur vers Zustand) */}
        <ProjectInitializer 
          projectId={project.id} 
          systemId={currentSystemId}
          initialNodes={initialGraph.nodes} 
          initialEdges={initialGraph.edges}
          initialSequences={initialSequences}
        />

        {/* ESPACE DE TRAVAIL ÉDITEUR */}
        <main className="flex-1 flex overflow-hidden bg-slate-50">
          
          {/* Palette d'équipements (Draggable) */}
          <NodePalette config={config} />
          
          {/* Zone centrale (Graphe / Synoptique / Bilan) */}
          <Workspace config={config} />

          {/* Panneau des propriétés à droite (Resizable) */}
          <PropertiesPanel config={config} />
          
        </main>
      </div>
    </div>
  );
}