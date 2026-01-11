'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// --- HELPER DE SÉCURITÉ ---
/**
 * Vérifie que l'utilisateur connecté est bien le propriétaire du projet lié à cette ligne.
 * Renvoie la ligne si OK, throw une erreur sinon.
 */
async function getAuthenticatedLine(lineId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Authentification requise pour accéder à cette ressource.");
  }

  // On cherche la ligne ET on vérifie que le projet parent appartient au user
  const line = await db.line.findFirst({
    where: { 
      id: lineId,
      project: {
        userId: session.user.id
      }
    },
    include: { project: true } // Optionnel, si on a besoin d'infos projet
  });

  if (!line) {
    // On reste vague sur l'erreur pour ne pas confirmer l'existence de l'ID
    throw new Error("Accès refusé ou ligne introuvable.");
  }

  return line;
}

/**
 * Charge les noeuds et les liens pour une ligne donnée.
 */
export async function loadGraph(lineId: string) {
  if (!lineId) return { nodes: [], edges: [] };

  try {
    // 1. VÉRIFICATION DE SÉCURITÉ
    await getAuthenticatedLine(lineId);

    // 2. CHARGEMENT PARALLÈLE
    const [rawNodes, rawEdges] = await Promise.all([
      db.node.findMany({ where: { lineId } }),
      db.edge.findMany({ where: { lineId } })
    ]);

    // 3. MAPPING (inchangé)
    const nodes = rawNodes.map(node => ({
      id: node.id,
      type: node.type, 
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

  } catch (error: any) {
    console.error("Security/Load Error:", error.message);
    // On renvoie un graphe vide en cas d'erreur pour ne pas faire planter l'UI, 
    // mais idéalement on devrait gérer l'erreur côté client.
    return { nodes: [], edges: [], error: error.message };
  }
}

/**
 * Sauvegarde complète du graphe par synchronisation (Batch)
 */
export async function saveGraph(
  lineId: string, 
  nodes: any[], 
  edges: any[], 
  sequences: any[]
) {
  if (!lineId) return { success: false, error: "ID de ligne manquant" };

  try {
    // 1. Verify ownership first (using the secure function we fixed in the previous step)
    await getAuthenticatedLine(lineId);

    const nodeIds = nodes.map(n => n.id);
    const edgeIds = edges.map(e => e.id);
    const sequenceIds = sequences.map(s => s.id);

  await db.$transaction(async (tx) => {
      // --- NODES: DIFF SYNC ---
      // Delete nodes that are no longer present in the editor
      await tx.node.deleteMany({ 
        where: { lineId, id: { notIn: nodeIds } } 
      });

      // Upsert nodes (Update if exists, Create if new)
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

      // --- EDGES: DIFF SYNC ---
      await tx.edge.deleteMany({ 
        where: { lineId, id: { notIn: edgeIds } } 
      });

      for (const edge of edges) {
        await tx.edge.upsert({
          where: { id: edge.id },
          update: {
            sourceId: edge.source,
            targetId: edge.target,
            properties: edge.data || {},
          },
          create: {
            id: edge.id,
            lineId,
            sourceId: edge.source,
            targetId: edge.target,
            properties: edge.data || {},
            category: 'PHYSICAL',
          },
        });
      }

      // --- SEQUENCES: CLEAN REORDERING ---
      // Sequences are logic-heavy, so we clean steps but KEEP sequence metadata where possible
      await tx.sequenceStep.deleteMany({ where: { sequence: { lineId } } });
      await tx.sequence.deleteMany({ 
        where: { lineId, id: { notIn: sequenceIds } } 
      });

      for (const seq of sequences) {
        await tx.sequence.upsert({
          where: { id: seq.id },
          update: { name: seq.name, properties: seq.properties || {} },
          create: { id: seq.id, lineId, name: seq.name, properties: seq.properties || {} }
        });

        if (seq.steps.length > 0) {
          await tx.sequenceStep.createMany({
            data: seq.steps.map((nodeId: string, index: number) => ({
              sequenceId: seq.id,
              nodeId,
              order: index
            }))
          });
        }
      }
    });

    // Target revalidation instead of global '/'
    revalidatePath(`/editor/${lineId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Save Error:", error);
    return { success: false, error: error.message };
  }
}