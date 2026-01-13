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
export async function saveGraph(systemId: string, nodes: any[], edges: any[], sequences: any[]) {
  if (!systemId) return { success: false, error: "ID manquant" };

  try {
    await getAuthenticatedSystem(systemId);

    return await db.$transaction(async (tx) => {
      // 1. Suppression parallèle de l'ancien état pour ce système
      await Promise.all([
        tx.edge.deleteMany({ where: { systemId } }),
        tx.sequenceStep.deleteMany({ where: { sequence: { systemId } } }),
        tx.sequence.deleteMany({ where: { systemId } }),
        tx.node.deleteMany({ where: { systemId } })
      ]);

      // 2. Ré-insertion massive des NODES
      if (nodes.length > 0) {
        await tx.node.createMany({
          data: nodes.map(node => ({
            id: node.id,
            systemId,
            positionX: node.position.x,
            positionY: node.position.y,
            type: node.type,
            label: node.data.label,
            role: node.data.role || 'PROCESS',
            properties: node.data.properties || {},
          }))
        });
      }

      // 3. Ré-insertion massive des EDGES
      if (edges.length > 0) {
        await tx.edge.createMany({
          data: edges.map(edge => ({
            id: edge.id,
            systemId,
            sourceId: edge.source,
            targetId: edge.target,
            properties: edge.data || {},
            category: 'PHYSICAL',
          }))
        });
      }

      // 4. Ré-insertion optimisée des SEQUENCES (Gammes)
      if (sequences.length > 0) {
        // 4a. Création de toutes les séquences en un seul batch
        await tx.sequence.createMany({
          data: sequences.map(seq => ({
            id: seq.id,
            systemId,
            name: seq.name,
            properties: seq.properties || {},
          }))
        });

        // 4b. Préparation de toutes les étapes de toutes les séquences
        const allSteps = sequences.flatMap(seq => 
          seq.steps.map((nodeId: string, index: number) => ({
            sequenceId: seq.id,
            nodeId,
            order: index
          }))
        );
        
        // 4c. Création de toutes les étapes en un seul batch
        if (allSteps.length > 0) {
          await tx.sequenceStep.createMany({
            data: allSteps
          });
        }
      }

      return { success: true };
    }, {
      timeout: 20000 // Timeout augmenté à 20s pour les grosses transactions
    });
  } catch (error: any) {
    console.error("Save Error:", error);
    return { success: false, error: error.message };
  }
}