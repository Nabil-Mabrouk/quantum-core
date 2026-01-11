import { db } from '@repo/database';
import { NodePalette } from '@/components/layout/node-palette';
import { PropertiesPanel } from '@/components/layout/properties-panel';
import { ProjectInitializer } from '@/components/layout/project-initializer';
import { Workspace } from '@/components/layout/workspace';

// Nouveaux composants de navigation Shell
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';

import { loadGraph } from '../../actions/graph';
import { getDomainConfig } from '@/lib/registry';

export default async function EngineeringStudio(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ systemId?: string }>;
}) {  
  const { id: projectId } = await props.params;
  const { systemId: searchSystemId } = await props.searchParams;
  const config = getDomainConfig();

  // 1. Chargement du projet et de ses systèmes
  const project = await db.project.findUniqueOrThrow({ 
    where: { id: projectId },
    include: { systems: true }
  });
  
  // 2. Détermination du système courant
  const currentSystemId = searchSystemId || project.systems[0]?.id;
  if (!currentSystemId) return <div>Erreur : Système introuvable</div>;

  // 3. Chargement du graphe et des séquences
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
      
      {/* BARRE LATÉRALE DE CONTEXTE (Navigation entre Blueprint / Conception / Library) */}
      <SideNav projectId={projectId} systemId={currentSystemId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER UNIFIÉ (Breadcrumbs interactifs et Sélecteur de système) */}
        <UniversalHeader 
          projectName={project.name}
          projectId={projectId}
          systems={project.systems}
          currentSystemId={currentSystemId}
          // Note : La logique de sauvegarde est gérée dans UniversalHeader via le store
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
          
          {/* Palette d'équipements */}
          <NodePalette config={config} />
          
          {/* Zone centrale (Graphe / Synoptique / Bilan) */}
          <Workspace config={config} />

          {/* Panneau des propriétés à droite */}
          <PropertiesPanel config={config} />
          
        </main>
      </div>
    </div>
  );
}