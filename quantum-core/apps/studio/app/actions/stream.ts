'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// --- SECURITY HELPERS ---

async function getAuthenticatedProject(projectId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projet introuvable.");
  if (project.userId !== userId) throw new Error("Non autorisé: Vous n'êtes pas le propriétaire de ce projet.");
  return project;
}

async function getAuthenticatedSystem(systemId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");
  const system = await db.system.findUnique({
    where: { id: systemId },
    include: { project: true }
  });
  if (!system) throw new Error("Système introuvable.");
  if (system.project.userId !== userId) throw new Error("Non autorisé: Vous n'êtes pas le propriétaire de ce projet.");
  return system;
}

async function getAuthenticatedNode(nodeId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");
  const node = await db.node.findUnique({
    where: { id: nodeId },
    include: { system: { include: { project: true } } }
  });
  if (!node) throw new Error("Nœud introuvable.");
  if (node.system.project.userId !== userId) throw new Error("Non autorisé: Vous n'êtes pas le propriétaire de ce projet.");
  return node;
}

// --- ACTIONS ---

export async function updateSystemPosition(systemId: string, x: number, y: number) {
  const session = await auth();
  await getAuthenticatedSystem(systemId, session?.user?.id);

  return await db.system.update({
    where: { id: systemId },
    data: { 
      positionX: x,
      positionY: y
    }
  });
}

export async function getProjectTopology(projectId: string) {
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);

  const [systems, streams] = await Promise.all([
    db.system.findMany({
      where: { projectId },
      include: {
        nodes: {
          where: {
            OR: [
              { inputStreamId: { not: null } },
              { outputStreamId: { not: null } }
            ]
          }
        }
      }
    }),
    db.projectStream.findMany({
      where: { projectId }
    })
  ]);

  return { systems, streams };
}


export async function createStreamAction(projectId: string, name: string) {
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);

  const stream = await db.projectStream.create({
    data: { projectId, name }
  });
  revalidatePath(`/project/${projectId}`);
  return stream;
}

export async function getProjectStreams(projectId: string) {
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);

  return await db.projectStream.findMany({
    where: { projectId },
    include: {
      inputs: { include: { system: true } },
      outputs: { include: { system: true } }
    }
  });
}

export async function deleteStreamAction(streamId: string, projectId: string) {
  const session = await auth();
  const project = await getAuthenticatedProject(projectId, session?.user?.id);

  // Sécurité : on s'assure que le stream appartient bien au projet vérifié
  await db.projectStream.delete({ 
    where: { 
      id: streamId,
      projectId: project.id,
    } 
  });
  revalidatePath(`/project/${projectId}`);
}

/**
 * Connecte un nœud à un flux global
 */
export async function connectNodeToStreamAction(
  nodeId: string, 
  streamId: string | null, 
  direction: 'INPUT' | 'OUTPUT'
) {
  const session = await auth();
  await getAuthenticatedNode(nodeId, session?.user?.id);
  
  if (direction === 'INPUT') {
    return await db.node.update({
      where: { id: nodeId },
      data: { inputStreamId: streamId }
    });
  } else {
    return await db.node.update({
      where: { id: nodeId },
      data: { outputStreamId: streamId }
    });
  }
}