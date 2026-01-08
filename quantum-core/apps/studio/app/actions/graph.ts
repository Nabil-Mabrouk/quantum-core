'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';

// Types simplifiés pour l'entrée (ce qui vient de ReactFlow)
type GraphData = {
  nodes: any[];
  edges: any[];
};

export async function saveGraph(projectId: string, data: GraphData) {
  try {
    console.log(`💾 Sauvegarde du projet ${projectId}...`);

    await db.$transaction(async (tx) => {
      // 1. Nettoyage radical (Stratégie "Full Replace" pour simplifier le MVP)
      // On supprime d'abord les liens, puis les nœuds pour éviter les erreurs de contrainte
      await tx.edge.deleteMany({ where: { projectId } });
      await tx.node.deleteMany({ where: { projectId } });

      // 2. Insertion des Nœuds
      if (data.nodes.length > 0) {
        await tx.node.createMany({
          data: data.nodes.map((n) => ({
            id: n.id, // On garde l'UUID généré par le front
            projectId,
            type: n.data.type, // "TANK", "PUMP"
            label: n.data.label || "Sans nom",
            positionX: n.position.x,
            positionY: n.position.y,
            // C'est ici que le JSONB brille : on stocke tout le reste brut
            properties: n.data.properties || {}, 
          })),
        });
      }

      // 3. Insertion des Liens
      if (data.edges.length > 0) {
        await tx.edge.createMany({
          data: data.edges.map((e) => ({
            id: e.id,
            projectId,
            sourceId: e.source,
            targetId: e.target,
            type: "STANDARD", // Pour l'instant générique
            properties: e.data || {},
          })),
        });
      }
    });

    revalidatePath('/'); // Rafraîchir le cache Next.js
    return { success: true };
  } catch (error) {
    console.error("Erreur de sauvegarde:", error);
    return { success: false, error: "Echec de la sauvegarde DB" };
  }
}

export async function loadGraph(projectId: string) {
  const nodes = await db.node.findMany({ where: { projectId } });
  const edges = await db.edge.findMany({ where: { projectId } });

  // On retransforme au format ReactFlow
  return {
    nodes: nodes.map(n => ({
      id: n.id,
      type: 'genericNode', // Important pour le rendu visuel
      position: { x: n.positionX, y: n.positionY },
      data: { 
        type: n.type, // "TANK" (pour l'icône)
        label: n.label,
        properties: n.properties 
      }
    })),
    edges: edges.map(e => ({
      id: e.id,
      source: e.sourceId,
      target: e.targetId,
      data: e.properties
    }))
  };
}