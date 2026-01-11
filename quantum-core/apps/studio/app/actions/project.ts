'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from "@/auth"; // <--- Import Auth

export async function createProjectAction(formData: FormData) {
  const session = await auth(); // 🔒 Récupère l'utilisateur réel
  if (!session?.user?.id) throw new Error("Non autorisé");

  const name = formData.get('name') as string;
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("Utilisateur non trouvé");
  

  const project = await db.project.create({
    data: { name, domain, userId: user.id }
  });

  // On crée la ligne par défaut immédiatement
  await db.line.create({
    data: { name: "Ligne Principale", projectId: project.id }
  });

  revalidatePath('/dashboard');
  redirect(`/editor/${project.id}`);
}

export async function deleteProjectAction(projectId: string) {
    const session = await auth();
    // Seul le propriétaire peut supprimer
    await db.project.delete({
      where: { id: projectId, userId: session.user.id }
    });
    revalidatePath('/dashboard');
  }
  
  export async function renameProjectAction(projectId: string, newName: string) {
    await db.project.update({
      where: { id: projectId },
      data: { name: newName }
    });
    revalidatePath('/dashboard');
  }
  
  export async function shareProjectAction(projectId: string, email: string) {
    const targetUser = await db.user.findUnique({ where: { email } });
    if (!targetUser) return { error: "Utilisateur non trouvé" };
  
    await db.projectCollaborator.create({
      data: { projectId, userId: targetUser.id, role: "EDITOR" }
    });
    return { success: true };
  }

  export async function updateProjectSettingsAction(projectId: string, data: any) {
  await db.project.update({
    where: { id: projectId },
    data: {
      hoursPerDay: parseFloat(data.hoursPerDay),
      daysPerWeek: parseFloat(data.daysPerWeek),
      weeksPerYear: parseFloat(data.weeksPerYear),
    }
  });
  revalidatePath('/editor/[id]', 'page'); // Revalider le layout éditeur
}
