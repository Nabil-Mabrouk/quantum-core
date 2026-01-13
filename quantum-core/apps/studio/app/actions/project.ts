'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";
import { z } from 'zod';

// --- ZOD SCHEMAS ---
const ProjectSchema = z.object({
  name: z.string().min(1, "Nom requis").max(100),
  domain: z.enum(["SURFACE_TREATMENT", "WATER", "ENERGY"]),
});

const ProjectSettingsSchema = z.object({
  hoursPerDay: z.number().min(1).max(24),
  daysPerWeek: z.number().min(1).max(7),
  weeksPerYear: z.number().min(1).max(52),
});

// --- SECURITY HELPER ---
/**
 * Checks if a user is authenticated and owns the specified project.
 * Throws an error if not authorized.
 * @returns The project if authorized.
 */
async function getAuthenticatedProject(projectId: string, userId: string | undefined) {
  if (!userId) {
    throw new Error("Non autorisé: Session utilisateur non trouvée.");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Projet introuvable.");
  }

  if (project.userId !== userId) {
    throw new Error("Non autorisé: Vous n'êtes pas le propriétaire de ce projet.");
  }

  return project;
}


/**
 * Initialise une nouvelle étude (Projet)
 * Retourne l'ID pour permettre une redirection côté client après le Toast
 */
export async function createProjectAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  const validation = ProjectSchema.safeParse({
    name: formData.get('name'),
    domain: formData.get('domain'),
  });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }
  const name = formData.get('name') as string;
  // Récupération du domaine depuis la modale, sinon fallback env ou valeur par défaut
  const domain = (formData.get('domain') as string) || process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "SURFACE_TREATMENT";

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("Utilisateur non trouvé dans la base de données");

  // 1. Création du projet
  const project = await db.project.create({
    data: { 
      name, 
      domain, 
      userId: user.id 
    }
  });

  // 2. Création automatique du premier système (indispensable pour l'éditeur)
  await db.system.create({
    data: { 
      name: "Système Principal", 
      type: "PRODUCTION", 
      projectId: project.id 
    }
  });

  // Purge du cache du dashboard pour afficher la nouvelle carte
  revalidatePath('/dashboard');

  // On retourne l'ID au composant client pour qu'il gère router.push()
  return { id: project.id };
}

/**
 * Supprime une étude
 */
export async function deleteProjectAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  // Sécurité : seul le propriétaire peut supprimer son projet
  // Cette méthode est aussi valide et sécurisée. On la laisse pour l'exemple.
  await db.project.delete({
    where: { 
      id: projectId, 
      userId: session.user.id 
    }
  });

  revalidatePath('/dashboard');
}

/**
 * Renomme une étude
 */
export async function renameProjectAction(projectId: string, newName: string) {
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);

  await db.project.update({
    where: { id: projectId },
    data: { name: newName }
  });

  revalidatePath('/dashboard');
}

/**
 * Partage un projet avec un collaborateur
 */
export async function shareProjectAction(projectId: string, email: string) {
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);
  
  const targetUser = await db.user.findUnique({ where: { email } });
  if (!targetUser) return { error: "Utilisateur non trouvé" };

  await db.projectCollaborator.create({
    data: { 
      projectId, 
      userId: targetUser.id, 
      role: "EDITOR" 
    }
  });

  return { success: true };
}

/**
 * Met à jour les réglages temporels de l'étude (Heures/Jour, etc.)
 */
export async function updateProjectSettingsAction(projectId: string, data: any) {
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);

  // Validation Zod des données entrantes
  const validation = ProjectSettingsSchema.safeParse({
    hoursPerDay: parseFloat(data.hoursPerDay),
    daysPerWeek: parseFloat(data.daysPerWeek),
    weeksPerYear: parseFloat(data.weeksPerYear),
  });

  if (!validation.success) {
    return { error: "Données invalides : " + validation.error.message };
  }

  await db.project.update({
    where: { id: projectId },
    data: validation.data
  });

  // Revalide le layout pour mettre à jour les calculs de simulation
  revalidatePath('/editor/[id]', 'page');
  revalidatePath('/project/[id]', 'page');
}