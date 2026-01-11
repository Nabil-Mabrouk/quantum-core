// FILE: apps/studio/app/actions/system.ts
'use server';
import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSystem(projectId: string, name: string, type: string = "PRODUCTION") {
  const newSystem = await db.system.create({
    data: { 
      name, 
      projectId,
      type, // "PRODUCTION" ou "TREATMENT"
      positionX: 100,
      positionY: 100 
    }
  });
  
  // On revalide et on redirige vers le nouveau système
  revalidatePath(`/editor/${projectId}`);
  redirect(`/editor/${projectId}?systemId=${newSystem.id}`);
}

export async function getSystems(projectId: string) {
  return await db.system.findMany({ 
    where: { projectId },
    orderBy: { createdAt: 'asc' }
  });
}

export async function deleteSystem(systemId: string, projectId: string) {
  await db.system.delete({ where: { id: systemId } });
  revalidatePath(`/editor/${projectId}`);
}

/**
 * ACTION MANQUANTE : Sauvegarde la position sur le Blueprint
 * Appelé lors du "Drag Stop" sur la vue Master Plan
 */
export async function updateSystemPositionAction(systemId: string, x: number, y: number) {
  try {
    await db.system.update({
      where: { id: systemId },
      data: { 
        positionX: x, 
        positionY: y 
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur DB updateSystemPosition:", error);
    return { success: false, error: "Impossible de sauvegarder la position" };
  }
}