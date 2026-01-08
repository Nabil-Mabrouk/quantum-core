'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';

/**
 * Crée une nouvelle séquence (gamme) pour une ligne donnée.
 */
export async function createSequenceAction(lineId: string, name: string, properties: Record<string, any>) {
  const newSequence = await db.sequence.create({
    data: {
      lineId,
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
  const deletedSequence = await db.sequence.delete({
    where: { id: sequenceId },
  });
  revalidatePath('/');
  return deletedSequence;
}
