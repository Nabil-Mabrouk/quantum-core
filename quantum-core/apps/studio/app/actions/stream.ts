'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';

export async function updateSystemPosition(systemId: string, x: number, y: number) {
  return await db.system.update({
    where: { id: systemId },
    data: { 
      positionX: x,
      positionY: y
    }
  });
}

export async function getProjectTopology(projectId: string) {
  // 1. Récupérer les systèmes avec leurs nœuds connectés au bus
  const systems = await db.system.findMany({
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
  });

  // 2. Récupérer les flux (Streams)
  const streams = await db.projectStream.findMany({
    where: { projectId }
  });

  return { systems, streams };
}


export async function createStreamAction(projectId: string, name: string) {
  const stream = await db.projectStream.create({
    data: { projectId, name }
  });
  revalidatePath(`/project/${projectId}`);
  return stream;
}

export async function getProjectStreams(projectId: string) {
  return await db.projectStream.findMany({
    where: { projectId },
    include: {
      inputs: { include: { system: true } },  // Qui lit ?
      outputs: { include: { system: true } } // Qui écrit ?
    }
  });
}

export async function deleteStreamAction(streamId: string, projectId: string) {
  await db.projectStream.delete({ where: { id: streamId } });
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