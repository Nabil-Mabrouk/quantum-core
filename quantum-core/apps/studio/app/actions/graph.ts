'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';

/**
 * Sécurité : Vérifie que l'utilisateur possède bien la ligne
 * (Simulé pour l'instant, à lier à votre système Auth)
 */
async function verifyLineOwnership(lineId: string) {
  // Simulé : dans une version finale, on récupère l'ID via await auth()
  const demoUserId = (await db.user.findFirst({ where: { email: "demo@quantum.core" } }))?.id;
  
  if (!demoUserId) throw new Error("Utilisateur démo introuvable.");

  const line = await db.line.findFirst({
    where: { 
      id: lineId,
      project: { userId: demoUserId }
    }
  });

  if (!line) throw new Error("Accès non autorisé à cette ligne.");
  return line;
}

/**
 * Charge les noeuds et les liens pour une ligne donnée.
 */
export async function loadGraph(lineId: string) {
  if (!lineId) return { nodes: [], edges: [] };

  const rawNodes = await db.node.findMany({
    where: { lineId },
  });

  const rawEdges = await db.edge.findMany({
    where: { lineId },
  });

  // Transformation des données Prisma vers le format React Flow
  const nodes = rawNodes.map(node => ({
    id: node.id,
    type: 'genericNode',
    position: { x: node.positionX, y: node.positionY },
    data: {
      type: node.type,
      label: node.label,
      role: node.role,
      properties: node.properties as Record<string, any>,
    },
  }));

  const edges = rawEdges.map(edge => ({
    id: edge.id,
    source: edge.sourceId,
    target: edge.targetId,
    type: 'default',
    data: edge.properties as Record<string, any>,
  }));

  return { nodes, edges };
}

/**
 * Sauvegarde complète du graphe par synchronisation (Batch)
 */
export async function saveGraph(
  lineId: string, 
  nodes: any[], 
  edges: any[], 
  sequences: any[] // <--- On ajoute les séquences ici !
) {
  if (!lineId) return { success: false, error: "ID de ligne manquant" };

  try {
    const nodeIds = nodes.map(n => n.id);
    const edgeIds = edges.map(e => e.id);

    await db.$transaction(async (tx) => {
      // 1. Suppression des anciens Edges et Sequences (Nettoyage propre)
      // On supprime TOUT ce qui appartient à la ligne pour réécrire l'état propre de Zustand
      await tx.edge.deleteMany({ where: { lineId } });
      await tx.sequenceStep.deleteMany({ where: { sequence: { lineId } } });
      await tx.sequence.deleteMany({ where: { lineId } });
      
      // 2. Suppression des Noeuds qui ne sont plus là
      await tx.node.deleteMany({ where: { lineId, id: { notIn: nodeIds } } });

      // 3. Upsert des Noeuds restants/nouveaux
      for (const node of nodes) {
        await tx.node.upsert({
          where: { id: node.id },
          update: {
            positionX: node.position.x,
            positionY: node.position.y,
            label: node.data.label,
            properties: node.data.properties || {},
          },
          create: {
            id: node.id,
            lineId,
            positionX: node.position.x,
            positionY: node.position.y,
            type: node.data.type,
            label: node.data.label,
            role: node.data.role || 'PROCESS',
            properties: node.data.properties || {},
          },
        });
      }

      // 4. Création des Edges (Plus besoin d'upsert car on a tout supprimé au début)
      if (edges.length > 0) {
        await tx.edge.createMany({
          data: edges.map(e => ({
            id: e.id,
            lineId,
            sourceId: e.source,
            targetId: e.target,
            properties: e.data || {},
            category: 'PHYSICAL',
          }))
        });
      }

      // 5. Création des Séquences (Nettoyées et Réordonnées par le Front)
      for (const seq of sequences) {
        const newSeq = await tx.sequence.create({
          data: {
            id: seq.id,
            lineId,
            name: seq.name,
            properties: seq.properties || {},
          }
        });

        // On réinsère les étapes dans le bon ordre (0, 1, 2, 3...)
        if (seq.steps.length > 0) {
          await tx.sequenceStep.createMany({
            data: seq.steps.map((nodeId: string, index: number) => ({
              sequenceId: newSeq.id,
              nodeId,
              order: index
            }))
          });
        }
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Critical Save Error:", error);
    return { success: false, error: error.message };
  }
}