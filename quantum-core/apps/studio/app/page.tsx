// apps/studio/app/page.tsx

import { NodePalette } from '@/components/layout/node-palette';
import { FlowEditor } from '@/components/canvas/flow-editor';
import { Header } from '@/components/layout/header';
import { PropertiesPanel } from '@/components/layout/properties-panel'; // <--- AJOUT
import { getOrCreateDefaultProject } from './actions/project';
import { loadGraph } from './actions/graph';
import { ProjectInitializer } from '@/components/layout/project-initializer';

export default async function EngineeringStudio() {
  const project = await getOrCreateDefaultProject();
  const initialGraph = await loadGraph(project.id);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900">
      <ProjectInitializer 
        projectId={project.id} 
        initialNodes={initialGraph.nodes} 
        initialEdges={initialGraph.edges} 
      />
      
      <Header />

      <main className="flex-1 flex overflow-hidden">
        <NodePalette />
        
        {/* Le Canvas prend tout l'espace central */}
        <div className="flex-1 relative">
           <FlowEditor />
        </div>

        {/* Le Panneau de propriétés à droite */}
        <PropertiesPanel />
      </main>
    </div>
  );
}