// apps/studio/app/page.tsx

import { NodePalette } from '@/components/layout/node-palette';
import { FlowEditor } from '@/components/canvas/flow-editor';
import { Header } from '@/components/layout/header';
import { PropertiesPanel } from '@/components/layout/properties-panel';
import { ProjectInitializer } from '@/components/layout/project-initializer';

// Actions Server
import { getOrCreateDefaultProject } from './actions/project';
import { loadGraph } from './actions/graph';

// Configuration Dynamique (Quantum Core Strategy)
import { getDomainConfig } from '@/lib/registry';

export default async function EngineeringStudio() {
  // 1. DÉTERMINATION DU DOMAINE (Le "Cœur" de l'abstraction)
  // On récupère la config métier (WATER, ENERGY, etc.) sans coder en dur
  const config = getDomainConfig();

  // 2. RÉCUPÉRATION DES DONNÉES (Persistance PostgreSQL)
  // On récupère ou crée un projet par défaut
  const project = await getOrCreateDefaultProject();
  
  // On charge le graphe associé (Nodes & Edges avec propriétés JSONB)
  const initialGraph = await loadGraph(project.id);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900">
      
      {/* 3. INITIALISATION DU STORE CLIENT (Hydratation) */}
      {/* Ce composant invisible injecte les données serveur dans le Store Zustand */}
      <ProjectInitializer 
        projectId={project.id} 
        initialNodes={initialGraph.nodes} 
        initialEdges={initialGraph.edges} 
      />
      
      {/* 4. INTERFACE UTILISATEUR GÉNÉRIQUE */}
      {/* On passe l'objet 'config' aux composants pour qu'ils s'adaptent au métier */}
      <Header config={config} />

      <main className="flex-1 flex overflow-hidden">
        {/* La Palette génère ses boutons selon config.nodeTypes */}
        <NodePalette config={config} />
        
        {/* La zone centrale de dessin (Canvas) */}
        <div className="flex-1 relative">
           <FlowEditor />
        </div>

        {/* Le Panneau de droite génère ses formulaires selon config.nodeTypes[type].fields */}
        <PropertiesPanel config={config} />
      </main>
      
      {/* Indicateur de domaine discret en bas à gauche */}
      <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 px-2 py-1 rounded-md shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
            Quantum Core Engine <span className="text-blue-600">v1.0</span> | Mode : {config.id}
          </p>
        </div>
      </div>
    </div>
  );
}