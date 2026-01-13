// FILE: apps/studio/app/actions/system.ts
'use server';
import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

// --- ACTIONS ---

export async function createSystem(projectId: string, name: string, type: string = "PRODUCTION") {
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);

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
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);

  return await db.system.findMany({ 
    where: { projectId },
    orderBy: { createdAt: 'asc' }
  });
}

export async function deleteSystem(systemId: string, projectId: string) {
  const session = await auth();
  const project = await getAuthenticatedProject(projectId, session?.user?.id);

  await db.system.delete({ 
    where: { 
      id: systemId,
      projectId: project.id // Ensure system belongs to the authenticated project
    } 
  });
  revalidatePath(`/editor/${projectId}`);
}

/**
 * ACTION MANQUANTE : Sauvegarde la position sur le Blueprint
 * Appelé lors du "Drag Stop" sur la vue Master Plan
 */
export async function updateSystemPositionAction(systemId: string, x: number, y: number) {
  const session = await auth();
  await getAuthenticatedSystem(systemId, session?.user?.id);
  
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