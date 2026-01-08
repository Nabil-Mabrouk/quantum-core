// apps/studio/app/editor/[id]/page.tsx
// apps/studio/app/editor/[id]/page.tsx

import { NodePalette } from '@/components/layout/node-palette';
import { FlowEditor } from '@/components/canvas/flow-editor';
import { Header } from '@/components/layout/header';
import { PropertiesPanel } from '@/components/layout/properties-panel';
import { ProjectInitializer } from '@/components/layout/project-initializer';
import { SequenceManager } from '@/components/layout/sequence-manager';

// Actions Server
import { loadGraph } from '../../actions/graph';
import { db } from '@repo/database';
// Configuration Dynamique (Quantum Core Strategy)
import { getDomainConfig } from '@/lib/registry';

export default async function EngineeringStudio(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lineId?: string }>;
}) {  
  // 1. RÉSOLUTION DES PARAMÈTRES ASYNC (Obligatoire Next.js 15+)
  // On attend que les promesses soient résolues pour obtenir les valeurs réelles
  const resolvedParams = await props.params;
  const resolvedSearchParams = await props.searchParams;
  
  const projectId = resolvedParams.id;
  const searchLineId = resolvedSearchParams.lineId;

  // Détermination du domaine actif
  const config = getDomainConfig();

  // 2. RÉCUPÉRATION DES DONNÉES (Persistance PostgreSQL)
  // Utilisation du projectId résolu pour éviter l'erreur Prisma validation
  const project = await db.project.findUniqueOrThrow({ 
    where: { id: projectId },
    include: { lines: true }
  });
  
  let lines = project.lines;

  // 3. LOGIQUE DE SÉCURITÉ : S'assurer qu'une ligne existe
  if (lines.length === 0) {
    const newLine = await db.line.create({ 
        data: { name: "Ligne Principale", projectId: project.id } 
    });
    lines = [newLine];
  }

  // Définition de la ligne active (URL ou première de la liste)
  const currentLineId = searchLineId || lines[0].id;

  // 4. CHARGEMENT DU CONTENU DE LA LIGNE
  const initialGraph = await loadGraph(currentLineId);
  
  // Chargement des gammes (séquences) associées à la ligne
  const sequencesFromDb = await db.sequence.findMany({
    where: { lineId: currentLineId },
    include: {
      steps: {
        orderBy: { order: 'asc' }
      }
    }
  });

  // Transformation des données du format Prisma vers le format du Store Zustand
  const initialSequences = sequencesFromDb.map(s => ({
    ...s,
    properties: s.properties as Record<string, any>,
    steps: s.steps.map(step => step.nodeId)
  }));

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900">
      
      {/* 5. INITIALISATION DU STORE CLIENT */}
      <ProjectInitializer 
        projectId={project.id} 
        lineId={currentLineId}
        initialNodes={initialGraph.nodes} 
        initialEdges={initialGraph.edges}
        initialSequences={initialSequences}
      />
      
      {/* HEADER : On passe les données nécessaires au pilotage */}
      <Header 
        config={config} 
        lines={lines} 
        currentLineId={currentLineId} 
      />

      <main className="flex-1 flex overflow-hidden">
        {/* Barre d'outils dynamique selon le domaine */}
        <NodePalette config={config} />
        
        {/* Espace de travail principal */}
        <div className="flex-1 relative">
           <FlowEditor />
           
           {/* GESTIONNAIRE DE GAMMES (ESCÀMOTABLE) */}
           <SequenceManager />
        </div>

        {/* Panneau de configuration à droite */}
        <PropertiesPanel config={config} />
      </main>

      {/* FOOTER : Indicateur de contexte discret */}
      <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            {project.name} <span className="text-slate-300 mx-2">|</span> Mode {config.id}
          </p>
        </div>
      </div>
    </div>
  );
}