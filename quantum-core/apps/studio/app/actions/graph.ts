'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// ====================================================================
// 1. SÉCURITÉ
// ====================================================================

async function getAuthenticatedSystem(systemId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Authentification requise.");
  }

  // Vérification stricte : le système doit appartenir à un projet de l'utilisateur
  const system = await db.system.findFirst({
    where: { 
      id: systemId,
      project: { userId: session.user.id }
    }
  });

  if (!system) {
    throw new Error("Accès refusé ou système introuvable.");
  }

  return system;
}

// ====================================================================
// 2. CHARGEMENT (LOAD) - CORRIGÉ
// ====================================================================

export async function loadGraph(systemId: string) {
  if (!systemId) return { nodes: [], edges: [], sequences: [] };

  try {
    await getAuthenticatedSystem(systemId);

    // ✅ CORRECTION : On charge TOUT (Nodes, Edges, ET Séquences)
    // On utilise une seule requête relationnelle puissante plutôt que Promise.all
    const system = await db.system.findUnique({
      where: { id: systemId },
      include: {
        nodes: true,
        edges: true,
        sequences: {
          include: {
            steps: { orderBy: { order: 'asc' } } // Important pour l'ordre des étapes
          }
        }
      }
    });

    if (!system) throw new Error("Système introuvable");

    // Mapping Nodes
    const nodes = system.nodes.map(node => ({
      id: node.id,
      type: node.type, 
      position: { x: node.positionX, y: node.positionY },
      data: {
        type: node.type,
        label: node.label,
        role: node.role,
        properties: node.properties as Record<string, any>,
        // On réinjecte les IDs de streams pour le front
        inputStreamId: node.inputStreamId,
        outputStreamId: node.outputStreamId
      },
    }));

    // Mapping Edges
    const edges = system.edges.map(edge => ({
      id: edge.id,
      source: edge.sourceId,
      target: edge.targetId,
      type: 'default',
      data: edge.properties as Record<string, any>,
    }));

    // ✅ CORRECTION : Mapping Séquences
    const sequences = system.sequences.map(seq => ({
      id: seq.id,
      name: seq.name,
      properties: seq.properties as Record<string, any>,
      steps: seq.steps.map(s => s.nodeId) // Le front veut juste un tableau d'IDs
    }));

    return { nodes, edges, sequences };

  } catch (error: any) {
    console.error("Load Error:", error.message);
    return { nodes: [], edges: [], sequences: [], error: error.message };
  }
}

// ====================================================================
// 3. SAUVEGARDE (SAVE) - CORRIGÉ
// ====================================================================

export async function saveGraph(systemId: string, nodes: any[], edges: any[], sequences: any[]) {
  if (!systemId) return { success: false, error: "ID manquant" };

  try {
    await getAuthenticatedSystem(systemId);

    return await db.$transaction(async (tx) => {
      
      // ✅ CORRECTION : Suppression SÉQUENTIELLE (Pas de Promise.all)
      // Pour éviter les verrous mortels (Deadlocks) et les erreurs de Clés Étrangères
      
      // 1. D'abord les petits enfants (Steps)
      await tx.sequenceStep.deleteMany({ where: { sequence: { systemId } } });
      // 2. Puis les parents (Sequences)
      await tx.sequence.deleteMany({ where: { systemId } });
      // 3. Puis les dépendances (Edges)
      await tx.edge.deleteMany({ where: { systemId } });
      // 4. Enfin les maîtres (Nodes)
      await tx.node.deleteMany({ where: { systemId } });


      // --- RECRÉATION ---

      if (nodes.length > 0) {
        await tx.node.createMany({
          data: nodes.map(node => ({
            id: node.id,
            systemId,
            positionX: Math.round(node.position.x), // Arrondi pour propreté
            positionY: Math.round(node.position.y),
            type: node.type,
            label: node.data.label || "",
            role: node.data.role || 'PROCESS',
            properties: node.data.properties || {},
            
            // ✅ CORRECTION : Mapping des colonnes relationnelles (Streams)
            // C'est vital pour que le solveur Python puisse relier les systèmes entre eux
            inputStreamId: node.data.properties?.inputStreamId || null,
            outputStreamId: node.data.properties?.outputStreamId || null,
          }))
        });
      }

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

      if (sequences.length > 0) {
        await tx.sequence.createMany({
          data: sequences.map((seq: any) => ({
            id: seq.id,
            systemId,
            name: seq.name,
            properties: seq.properties || {},
          }))
        });

        // Aplanissement des steps (Flatten)
        const allSteps = sequences.flatMap((seq: any) => 
          (seq.steps || []).map((nodeId: string, index: number) => ({
            sequenceId: seq.id,
            nodeId,
            order: index
          }))
        );
        
        if (allSteps.length > 0) {
          await tx.sequenceStep.createMany({ data: allSteps });
        }
      }

      return { success: true };
    }, {
      timeout: 20000 // On garde ton timeout de sécurité
    });
  } catch (error: any) {
    console.error("Save Error:", error);
    return { success: false, error: error.message };
  }
}