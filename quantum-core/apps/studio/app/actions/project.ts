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

// 1. Define strict Schema
const CreateProjectSchema = z.object({
  name: z.string().trim().min(3, "Le nom doit contenir au moins 3 caractères").max(50),
  domain: z.enum(["SURFACE_TREATMENT", "WATER", "ENERGY"])
    .optional()
    .default("SURFACE_TREATMENT"), // Fallback handled by Zod
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

  // 2. Parse FormData directly into an object for Zod
  const rawData = {
    name: formData.get('name'),
    domain: formData.get('domain') || undefined, // Allow default to trigger
  };

  // 3. Validate
  const validation = CreateProjectSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }
  // 4. Use SANITIZED data only
  const { name, domain } = validation.data;

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("Utilisateur non trouvé");

  // 1. Création du projet
  try {
    const project = await db.project.create({
      data: { 
        name, 
        domain, 
        userId: user.id 
      }
    });

    // Create default system
    await db.system.create({
      data: { 
        name: "Système Principal", 
        type: "PRODUCTION", 
        projectId: project.id 
      }
    });

    revalidatePath('/dashboard');
    return { id: project.id };
  } catch (error) {
    console.error("DB Error:", error);
    return { error: "Erreur lors de la création en base de données." };
  }
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