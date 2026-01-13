'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from "@/auth";

// --- SECURITY HELPER ---

async function requireAdmin() {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'ADMIN') {
    throw new Error("Non autorisé: Accès administrateur requis.");
  }
}

// --- ACTIONS DE RÉCUPÉRATION ---

export async function getLibrary(domain: string) {
  const allItems = await db.libraryItem.findMany({
    where: { domain },
    include: {
      components: {
        include: { child: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return allItems;
}

// --- ACTIONS DE MODIFICATION ---

export async function upsertLibraryItem(domain: string, data: any) {
  await requireAdmin();

  const LibraryItemSchema = z.object({
    id: z.string().optional().nullable(),
    name: z.string().min(1),
    category: z.string(),
    symbol: z.string().optional().nullable(),
    properties: z.record(z.any()).default({}),
    composition: z.array(z.object({
      childId: z.string(),
      quantity: z.number(),
      unit: z.string().optional().nullable(),
    })).optional(),
  });

  const validated = LibraryItemSchema.parse(data);
  const { name, category, symbol, properties, composition } = validated;

  return await db.$transaction(async (tx) => {
    // 1. Upsert de l'item principal
    const item = await tx.libraryItem.upsert({
      where: { name: name },
      update: {
        category,
        symbol,
        properties: properties || {},
        domain,
      },
      create: {
        domain,
        name,
        category,
        symbol,
        properties: properties || {},
        sourceType: 'MANUAL',
      }
    });

    // 2. Mise à jour de la nomenclature (Composition)
    if (composition !== undefined) {
      await tx.composition.deleteMany({ where: { parentId: item.id } });

      if (composition.length > 0) {
        await tx.composition.createMany({
          data: composition.map(c => ({
            parentId: item.id,
            childId: c.childId,
            quantity: c.quantity,
            unit: c.unit
          }))
        });
      }
    }

    revalidatePath('/library');
    return item;
  });
}

export async function deleteLibraryItem(id: string) {
  await requireAdmin();

  const usageCount = await db.composition.count({ where: { childId: id } });
  if (usageCount > 0) {
    throw new Error(`Cet élément est utilisé comme composant dans ${usageCount} autre(s) article(s). Supprimez les liens d'abord.`);
  }

  await db.libraryItem.delete({ where: { id } });
  revalidatePath('/library');
  return { success: true };
}

// --- LOGIQUE D'IMPORTATION JSON ---

export async function importLibraryAction(domain: string, jsonData: any) {
  await requireAdmin();

  const JSONImportSchema = z.array(z.object({
    name: z.string().min(1),
    category: z.string(),
    symbol: z.string().optional().nullable(),
    properties: z.record(z.any()).optional().default({}),
    composition: z.array(z.object({
      childName: z.string(),
      quantity: z.number(),
      unit: z.string().optional().nullable()
    })).optional()
  }));

  const validation = JSONImportSchema.safeParse(jsonData);
  
  if (!validation.success) {
    return { success: false, error: "Format JSON invalide : " + validation.error.message };
  }

  const items = validation.data;

  try {
    await db.$transaction(async (tx) => {
      // PASSE 1 : Création/Update des Items
      for (const item of items) {
        await tx.libraryItem.upsert({
          where: { name: item.name },
          update: {
            category: item.category,
            symbol: item.symbol,
            properties: item.properties || {}
          },
          create: {
            domain,
            name: item.name,
            category: item.category,
            symbol: item.symbol,
            properties: item.properties || {},
            sourceType: 'JSON_IMPORT'
          }
        });
      }

      // PASSE 2 : Création des Liens récursifs
      for (const item of items) {
        if (item.composition && item.composition.length > 0) {
          const parent = await tx.libraryItem.findUnique({ where: { name: item.name } });
          if (!parent) continue;

          await tx.composition.deleteMany({ where: { parentId: parent.id } });

          for (const comp of item.composition) {
            const child = await tx.libraryItem.findUnique({ where: { name: comp.childName } });
            if (child) {
              await tx.composition.create({
                data: {
                  parentId: parent.id,
                  childId: child.id,
                  quantity: comp.quantity,
                  unit: comp.unit
                }
              });
            }
          }
        }
      }
    }, { timeout: 30000 });

    revalidatePath('/library');
    return { success: true, count: items.length };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// --- EXPORTATION (La fonction qui manquait) ---

/**
 * Génère un dump JSON de la bibliothèque filtré par domaine et catégories
 */
export async function exportLibraryData(domain: string, categories?: string[]) {
  await requireAdmin();

  const whereCondition: any = { domain };
  if (categories && categories.length > 0) {
    whereCondition.category = { in: categories };
  }

  const items = await db.libraryItem.findMany({
    where: whereCondition,
    include: {
      components: {
        include: { child: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Transformation en format compatible avec importLibraryAction
  return items.map(item => ({
    name: item.name,
    category: item.category,
    symbol: item.symbol,
    properties: item.properties,
    composition: item.components.map(c => ({
      childName: c.child.name,
      quantity: c.quantity,
      unit: c.unit
    }))
  }));
}

// --- UTILITAIRES DE CALCUL ---

/**
 * Aplatit récursivement la nomenclature (BOM) d'un item
 * Utile pour le solveur afin de connaître la masse totale de chaque ion/composant
 */
export async function getFlattenedComposition(itemId: string): Promise<Record<string, number>> {
  const totals: Record<string, number> = {};
  const MAX_DEPTH = 10; 

  async function resolve(currentId: string, multiplier: number, depth: number, path: Set<string>) {
    if (depth > MAX_DEPTH || path.has(currentId)) return;

    const item = await db.libraryItem.findUnique({
      where: { id: currentId },
      include: { components: true }
    });

    if (!item) return;

    if (item.components.length === 0) {
      // Élément atomique (Feuille)
      totals[item.name] = (totals[item.name] || 0) + multiplier;
    } else {
      const newPath = new Set(path);
      newPath.add(currentId);
      for (const comp of item.components) {
        await resolve(comp.childId, multiplier * comp.quantity, depth + 1, newPath);
      }
    }
  }

  await resolve(itemId, 1, 0, new Set());
  return totals;
}