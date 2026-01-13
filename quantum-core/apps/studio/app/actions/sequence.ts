'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// --- SECURITY HELPERS ---

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

async function getAuthenticatedSequence(sequenceId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");

  const sequence = await db.sequence.findUnique({
    where: { id: sequenceId },
    include: { system: { include: { project: true } } }
  });

  if (!sequence) throw new Error("Séquence introuvable.");
  if (sequence.system.project.userId !== userId) throw new Error("Non autorisé: Vous n'êtes pas le propriétaire de ce projet.");

  return sequence;
}


/**
 * Crée une nouvelle séquence (gamme) pour un système donné.
 */
export async function createSequenceAction(systemId: string, name: string, properties: Record<string, any>) {
  const session = await auth();
  await getAuthenticatedSystem(systemId, session?.user?.id);

  const newSequence = await db.sequence.create({
    data: {
      systemId,
      name,
      properties,
    }
  });
  revalidatePath('/'); // Revalide la page pour refléter le changement
  return newSequence;
}

/**
 * Met à jour les métadonnées d'une séquence (nom, propriétés).
 */
export async function updateSequenceMetaAction(sequenceId: string, data: { name?: string; properties?: any; }) {
  const session = await auth();
  await getAuthenticatedSequence(sequenceId, session?.user?.id);

  await db.sequence.update({
    where: { id: sequenceId },
    data: {
      name: data.name,
      properties: data.properties as any,
    }
  });
  revalidatePath('/');
}

/**
 * Met à jour les étapes d'une séquence.
 */
export async function updateSequenceStepsAction(sequenceId: string, steps: string[]) {
  const session = await auth();
  await getAuthenticatedSequence(sequenceId, session?.user?.id);

  // On supprime les anciennes étapes et on crée les nouvelles en une seule transaction
  await db.$transaction([
    db.sequenceStep.deleteMany({ where: { sequenceId } }),
    db.sequenceStep.createMany({
      data: steps.map((nodeId, index) => ({
        sequenceId: sequenceId,
        nodeId: nodeId,
        order: index,
      })),
    }),
  ]);
  revalidatePath('/');
}

/**
 * Supprime une séquence.
 */
export async function deleteSequenceAction(sequenceId: string) {
  const session = await auth();
  await getAuthenticatedSequence(sequenceId, session?.user?.id);
  
  const deletedSequence = await db.sequence.delete({
    where: { id: sequenceId },
  });
  revalidatePath('/');
  return deletedSequence;
}