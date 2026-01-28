// 'use server' indique que ce code s'exécute uniquement côté serveur.
// Il a accès direct à la BDD et aux secrets, mais rien ne fuite vers le client.
'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";
import { z } from 'zod';
import { redirect } from 'next/navigation';
// 👇 Import des utilitaires dynamiques du registre (Étape cruciale pour la modularité)
import { isDomainValid } from '@/lib/registry';
// 👇 Import du logger de sécurité
import { logSecurityEvent } from './security';

// ====================================================================
// 1. SCHÉMAS DE VALIDATION (STRICTS)
// ====================================================================

const CreateProjectSchema = z.object({
  name: z.string().trim().min(3, "Le nom doit contenir au moins 3 caractères").max(50, "Nom trop long"),
  
  // L'utilisateur DOIT sélectionner un domaine dans l'interface.
  domain: z.string({ 
    required_error: "Le choix du domaine métier est obligatoire." 
  })
  .refine((val) => isDomainValid(val), {
    message: `Domaine technique inconnu ou non supporté.`, 
  }),
});

const RenameProjectSchema = z.string().trim().min(1, "Le nom ne peut pas être vide").max(100);

const ProjectSettingsSchema = z.object({
  hoursPerDay: z.number().min(1).max(24),
  daysPerWeek: z.number().min(1).max(7),
  weeksPerYear: z.number().min(1).max(52),
});

// ✅ NOUVEAU : Schema pour les paramètres spécifiques au domaine (Surface Treatment)
const SurfaceTreatmentSettingsSchema = z.object({
  workshopTemp: z.number().min(0).max(50).default(20),
  evapCoefficient: z.number().min(0).max(1).default(0.02),
  evapAgitationFactor: z.number().min(1).max(5).default(1.5),
  evapCoverReductionFactor: z.number().min(0).max(1).default(0.1),
  workshopHumidity: z.number().min(0).max(100).optional().default(60),
});

// ====================================================================
// 2. HELPER DE SÉCURITÉ (Middleware Interne)
// ====================================================================

/**
 * Vérifie l'authentification ET la propriété du projet.
 * Cette fonction est appelée au début de chaque action sensible.
 */
async function getAuthenticatedProject(projectId: string, userId: string | undefined) {
  if (!userId) {
    throw new Error("Non autorisé : Session utilisateur introuvable.");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Projet introuvable.");
  }

  // Protection IDOR (Insecure Direct Object Reference)
  if (project.userId !== userId) {
    // On loggue cette tentative d'accès illégal
    await logSecurityEvent('WARN', {
        action: 'UNAUTHORIZED_PROJECT_ACCESS',
        userId,
        metadata: { projectId, ownerId: project.userId }
    });
    throw new Error("Non autorisé : Vous n'êtes pas le propriétaire de ce projet.");
  }

  return project;
}

// ====================================================================
// 3. SERVER ACTIONS (API)
// ====================================================================

/**
 * ACTION : Initialiser une nouvelle étude
 */
export async function createProjectAction(formData: FormData) {
  const session = await auth();
  
  // 1. Sécurité de base
  if (!session?.user?.id) redirect('/login');

  // 2. Sécurité avancée : "Session Fantôme"
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect('/api/auth/signout'); 

  // 3. Préparation des données
  const rawData = {
    name: formData.get('name'),
    domain: formData.get('domain') || undefined, 
  };

  // 4. Validation
  const validation = CreateProjectSchema.safeParse(rawData);

  if (!validation.success) {
    return { 
      error: validation.error.errors[0]?.message || "Erreur de validation inconnue" 
    };
  }

  const { name, domain } = validation.data;

  // 5. Exécution DB
  try {
    // ✅ NOUVEAU : Initialisation des properties avec les paramètres par défaut du domaine
    let initialProperties = {};
    
    if (domain === 'SURFACE_TREATMENT') {
      const defaultSettings = SurfaceTreatmentSettingsSchema.parse({});
      initialProperties = {
        SURFACE_TREATMENT: defaultSettings
      };
    }
    // Ajouter d'autres domaines ici si nécessaire

    const project = await db.project.create({
      data: { 
        name, 
        domain, 
        userId: user.id,
        properties: initialProperties
      }
    });

    // Création automatique du premier système
    await db.system.create({
      data: { 
        name: "Système Principal", 
        type: "PRODUCTION", 
        projectId: project.id 
      }
    });

    // 🔍 AUDIT LOG
    await logSecurityEvent('INFO', {
        action: 'PROJECT_CREATED',
        userId: user.id,
        metadata: { projectId: project.id, domain, name }
    });

    revalidatePath('/dashboard');
    return { id: project.id };

  } catch (error) {
    console.error("Erreur création projet:", error);
    return { error: "Erreur serveur lors de la création du projet." };
  }
}

/**
 * ACTION : Supprimer une étude
 */
export async function deleteProjectAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorisé");

  try {
    // Utilisation d'une clause composite pour la sécurité atomique
    const deleted = await db.project.delete({
        where: { 
        id: projectId, 
        userId: session.user.id 
        }
    });

    // 🔍 AUDIT LOG
    await logSecurityEvent('WARN', {
        action: 'PROJECT_DELETED',
        userId: session.user.id,
        metadata: { projectId, name: deleted.name }
    });

    revalidatePath('/dashboard');
  } catch (error) {
      // Si le delete échoue (ex: IDOR), Prisma lève une erreur RecordNotFound
      throw new Error("Impossible de supprimer ce projet (Introuvable ou droits insuffisants).");
  }
}

/**
 * ACTION : Renommer une étude
 */
export async function renameProjectAction(projectId: string, newName: string) {
  const session = await auth();
  
  // 1. Vérification des droits
  await getAuthenticatedProject(projectId, session?.user?.id);

  // 2. Validation
  const validation = RenameProjectSchema.safeParse(newName);
  
  if (!validation.success) {
    throw new Error(validation.error.errors[0]?.message);
  }

  // 3. Mise à jour
  await db.project.update({
    where: { id: projectId },
    data: { name: validation.data }
  });

  revalidatePath('/dashboard');
}

/**
 * ACTION : Partager un projet (Ajout collaborateur)
 */
export async function shareProjectAction(projectId: string, email: string) {
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);
  
  const targetUser = await db.user.findUnique({ where: { email } });
  
  if (!targetUser) {
    return { error: "Utilisateur introuvable avec cet email." };
  }

  try {
    await db.projectCollaborator.create({
      data: { 
        projectId, 
        userId: targetUser.id, 
        role: "EDITOR" 
      }
    });

    // 🔍 AUDIT LOG
    await logSecurityEvent('INFO', {
        action: 'PROJECT_SHARED',
        userId: session?.user?.id,
        metadata: { projectId, targetEmail: email, targetUserId: targetUser.id }
    });

    return { success: true };
  } catch (error) {
    return { error: "Cet utilisateur est déjà collaborateur sur ce projet." };
  }
}

/**
 * ACTION : Paramètres temporels (Global settings)
 */
export async function updateProjectSettingsAction(projectId: string, data: any) {
  const session = await auth();
  await getAuthenticatedProject(projectId, session?.user?.id);

  const validation = ProjectSettingsSchema.safeParse({
    hoursPerDay: Number(data.hoursPerDay),
    daysPerWeek: Number(data.daysPerWeek),
    weeksPerYear: Number(data.weeksPerYear),
  });

  if (!validation.success) {
    return { error: "Paramètres invalides : " + validation.error.errors[0]?.message };
  }

  try {
    await db.project.update({
      where: { id: projectId },
      data: validation.data
    });

    // 🔍 AUDIT LOG
    await logSecurityEvent('INFO', {
        action: 'PROJECT_SETTINGS_UPDATED',
        userId: session?.user?.id,
        metadata: { projectId, changes: validation.data }
    });

    revalidatePath('/editor/[id]', 'page');
    revalidatePath('/project/[id]', 'page');
    
    return { success: true }; // ✅ AJOUTER CECI
    
  } catch (error: any) {
    return { error: "Erreur base de données : " + error.message }; // ✅ Retourner l'erreur aussi en cas de catch
  }
}

/**
 * ✅ NOUVEAU ACTION : Paramètres spécifiques au domaine (ex: Surface Treatment)
 * Sauvegarde les réglages d'évaporation, température, etc. dans project.properties
 */
export async function updateProjectDomainSettingsAction(
  projectId: string, 
  domain: string, 
  domainSettings: any
) {
  const session = await auth();
  const project = await getAuthenticatedProject(projectId, session?.user?.id);

  // Vérification que le domaine correspond bien au projet
  if (project.domain !== domain) {
    return { error: "Le domaine ne correspond pas au projet." };
  }

  // Validation selon le domaine
  let validatedSettings;
  try {
    if (domain === 'SURFACE_TREATMENT') {
      validatedSettings = SurfaceTreatmentSettingsSchema.parse(domainSettings);
    } else {
      // Pour d'autres domaines, accepter les données telles quelles (ou ajouter des schémas)
      validatedSettings = domainSettings;
    }
  } catch (error: any) {
    return { error: "Paramètres de domaine invalides : " + error.message };
  }

  // Récupération des properties actuelles
  const currentProperties = (project.properties as any) || {};
  
  // Mise à jour des properties pour ce domaine spécifique (namespacing)
  const updatedProperties = {
    ...currentProperties,
    [domain]: {
      ...(currentProperties[domain] || {}),
      ...validatedSettings
    }
  };

  // Sauvegarde en DB
  await db.project.update({
    where: { id: projectId },
    data: { properties: updatedProperties }
  });

  // 🔍 AUDIT LOG
  await logSecurityEvent('INFO', {
      action: 'PROJECT_DOMAIN_SETTINGS_UPDATED',
      userId: session?.user?.id,
      metadata: { projectId, domain, settings: validatedSettings }
  });

  revalidatePath('/editor/[id]', 'page');
  return { success: true };
}

/**
 * ✅ NOUVEAU ACTION : Récupérer les paramètres d'un domaine
 * Utile pour pré-remplir le formulaire de settings
 */
export async function getProjectDomainSettingsAction(projectId: string, domain: string) {
  const session = await auth();
  const project = await getAuthenticatedProject(projectId, session?.user?.id);

  if (project.domain !== domain) {
    return { error: "Domaine incompatible avec le projet." };
  }

  const properties = (project.properties as any) || {};
  const domainSettings = properties[domain] || {};

  // Retourner les valeurs avec les défauts si manquantes
  if (domain === 'SURFACE_TREATMENT') {
    const defaults = SurfaceTreatmentSettingsSchema.parse({});
    return { 
      success: true, 
      data: { ...defaults, ...domainSettings } 
    };
  }

  return { success: true, data: domainSettings };
}