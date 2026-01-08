'use server';

import { db } from '@repo/database'; // L'import magique du Monorepo

export async function getOrCreateDefaultProject() {
  // On cherche un projet existant ou on en crée un
  // Dans une vraie app, on utiliserait l'ID de l'utilisateur connecté
  const project = await db.project.findFirst({
    where: { name: "Projet Démo" }
  });

  if (project) return project;

  // Création du user par défaut si besoin (pour la FK)
  const user = await db.user.upsert({
    where: { email: "demo@quantum.core" },
    update: {},
    create: { email: "demo@quantum.core", name: "Demo User" }
  });

  return await db.project.create({
    data: {
      name: "Projet Démo",
      domain: "WATER",
      userId: user.id
    }
  });
}