'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// --- HELPER DE SÉCURITÉ ---
/**
 * Vérifie que l'utilisateur connecté est bien le propriétaire du projet lié à ce système.
 * Renvoie le système si OK, throw une erreur sinon.
 */
async function getAuthenticatedSystem(systemId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Authentification requise pour accéder à cette ressource.");
  }

  // On cherche le système ET on vérifie que le projet parent appartient au user
  const system = await db.system.findFirst({
    where: { 
      id: systemId,
      project: {
        userId: session.user.id
      }
    },
    include: { project: true } // Optionnel
  });

  if (!system) {
    // On reste vague sur l'erreur pour la sécurité
    throw new Error("Accès refusé ou système introuvable.");
  }

  return system;
}

/**
 * Charge les noeuds et les liens pour un système donné.
 */
export async function loadGraph(systemId: string) {
  if (!systemId) return { nodes: [], edges: [] };

  try {
    // 1. VÉRIFICATION DE SÉCURITÉ
    await getAuthenticatedSystem(systemId);

    // 2. CHARGEMENT PARALLÈLE
    const [rawNodes, rawEdges] = await Promise.all([
      db.node.findMany({ where: { systemId } }),
      db.edge.findMany({ where: { systemId } })
    ]);

    // 3. MAPPING (inchangé, sauf adaptation des types si nécessaire)
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
    return { nodes: [], edges: [], error: error.message };
  }
}

/**
 * Sauvegarde complète du graphe par synchronisation (Batch)
 */
export async function saveGraph(
  systemId: string, 
  nodes: any[], 
  edges: any[], 
  sequences: any[]
) {
  if (!systemId) return { success: false, error: "ID de système manquant" };

  try {
    // 1. Verify ownership first
    await getAuthenticatedSystem(systemId);

    const nodeIds = nodes.map(n => n.id);
    const edgeIds = edges.map(e => e.id);
    const sequenceIds = sequences.map(s => s.id);

    await db.$transaction(async (tx) => {
      // --- NODES: DIFF SYNC ---
      // Delete nodes that are no longer present in the editor
      await tx.node.deleteMany({ 
        where: { systemId, id: { notIn: nodeIds } } 
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
            systemId, // Renommé de lineId à systemId
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
        where: { systemId, id: { notIn: edgeIds } } 
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
            systemId, // Renommé de lineId à systemId
            sourceId: edge.source,
            targetId: edge.target,
            properties: edge.data || {},
            category: 'PHYSICAL',
          },
        });
      }

      // --- SEQUENCES: CLEAN REORDERING ---
      // On supprime les steps des séquences appartenant à ce système
      await tx.sequenceStep.deleteMany({ where: { sequence: { systemId } } });
      
      // On supprime les séquences qui ne sont plus présentes
      await tx.sequence.deleteMany({ 
        where: { systemId, id: { notIn: sequenceIds } } 
      });

      for (const seq of sequences) {
        await tx.sequence.upsert({
          where: { id: seq.id },
          update: { name: seq.name, properties: seq.properties || {} },
          create: { id: seq.id, systemId, name: seq.name, properties: seq.properties || {} }
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

    // Revalidation du cache pour rafraîchir l'interface
    // Note: Assurez-vous que le chemin correspond à votre routing. 
    // Si vous êtes sur /editor/[projectId], revalidatePath('/editor/[projectId]') est mieux,
    // mais ici on garde la logique précédente adaptée.
    revalidatePath(`/editor/${systemId}`); 
    return { success: true };
  } catch (error: any) {
    console.error("Save Error:", error);
    return { success: false, error: error.message };
  }
}