'use server';

import { db } from '@repo/database';
import { auth } from "@/auth";

// --- SECURITY HELPER ---

async function requireAdmin() {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'ADMIN') {
    throw new Error("Non autorisé: Accès administrateur requis.");
  }
}

export async function seedCatalog() {
  await requireAdmin();
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "SURFACE_TREATMENT";
  
  const items = [
    {
      domain,
      category: "PUMP",
      name: "Pompe doseuse Grundfos DDA",
      properties: { flow: 30, power: 0.5, price: 1200 }
    },
    {
      domain,
      category: "PUMP",
      name: "Pompe de transfert IWAKI MDX",
      properties: { flow: 15, power: 0.2, price: 850 }
    },
    {
      domain,
      category: "TANK",
      name: "Cuve PEHD 1000L Standard",
      properties: { volume: 1000, price: 500, material: "PP" }
    }
  ];

  for (const item of items) {
    await db.libraryItem.upsert({
      where: { name: item.name },
      update: {
        category: item.category,
        properties: item.properties,
        domain: item.domain
      },
      create: {
        domain: item.domain,
        category: item.category,
        name: item.name,
        properties: item.properties
      }
    });
  }
  return { success: true };
}

// --- CORRECTION DU TYPE ET DE LA LOGIQUE PRISMA ---
export async function getCatalogItems(category: string | string[]) {
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "SURFACE_TREATMENT";
  
  // 1. Construction dynamique de la clause Where
  const where: any = { domain };

  if (Array.isArray(category)) {
    // Si on reçoit un tableau ["REAGENT", "ION"], on utilise l'opérateur IN de Prisma
    where.category = { in: category };
  } else {
    // Sinon on fait une égalité simple
    where.category = category;
  }

  const items = await db.libraryItem.findMany({
    where
  });

  return items.map(item => ({
    ...item,
    specs: item.properties
  }));
}