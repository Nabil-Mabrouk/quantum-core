'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
  // DÉPLACEMENT DU SCHÉMA A L'INTÉRIEUR DE LA FONCTION
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
  const { id, name, category, symbol, properties, composition } = validated;

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

    // 2. Mise à jour de la nomenclature
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
  const usageCount = await db.composition.count({ where: { childId: id } });
  if (usageCount > 0) {
    throw new Error(`Cet élément est utilisé comme composant dans ${usageCount} autre(s) article(s). Supprimez les liens d'abord.`);
  }

  await db.libraryItem.delete({ where: { id } });
  revalidatePath('/library');
  return { success: true };
}

// --- LOGIQUE D'IMPORTATION INTELLIGENTE ---

export async function importLibraryAction(domain: string, jsonData: any) {
  // DÉPLACEMENT DU SCHÉMA A L'INTÉRIEUR DE LA FONCTION (CRUCIAL POUR TURBOPACK)
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

  // Parsing sécurisé
  const validation = JSONImportSchema.safeParse(jsonData);
  
  if (!validation.success) {
    console.error("Zod Validation Error:", validation.error.format());
    return { success: false, error: "Format JSON invalide : " + validation.error.message };
  }

  const items = validation.data;

  try {
    await db.$transaction(async (tx) => {
      // PASSE 1 : Items
      for (const item of items) {
        await tx.libraryItem.upsert({
          where: { name: item.name },
          update: {
            category: item.category,
            symbol: item.symbol,
            properties: item.properties
          },
          create: {
            domain,
            name: item.name,
            category: item.category,
            symbol: item.symbol,
            properties: item.properties,
            sourceType: 'JSON_IMPORT'
          }
        });
      }

      // PASSE 2 : Liens
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
    console.error("Database Transaction Error:", e);
    return { success: false, error: e.message };
  }
}

// --- UTILITAIRES DE CALCUL (PERFORMANCE) ---
// --- UTILITAIRES DE CALCUL SÉCURISÉS ---

/**
 * Aplatit récursivement une structure BOM avec Protection Anti-Boucle
 */
export async function getFlattenedComposition(itemId: string): Promise<Record<string, number>> {
  const totals: Record<string, number> = {};
  const MAX_DEPTH = 20; // Sécurité pour éviter une explosion de la pile

  async function resolve(currentId: string, multiplier: number, depth: number, path: Set<string>) {
    // 1. Protection Profondeur
    if (depth > MAX_DEPTH) {
      console.warn(`[BOM] Profondeur max atteinte pour l'item ${currentId}. Arrêt.`);
      return;
    }

    // 2. Protection Cyclique (Le serpent qui se mord la queue)
    if (path.has(currentId)) {
      throw new Error(`Boucle infinie détectée dans la nomenclature (Circular Dependency) sur l'item : ${currentId}`);
    }

    const item = await db.libraryItem.findUnique({
      where: { id: currentId },
      include: { components: true }
    });

    if (!item) return;

    if (item.components.length === 0) {
      // Élément atomique (Feuille)
      totals[item.name] = (totals[item.name] || 0) + multiplier;
    } else {
      // Élément composite (Branche)
      // On ajoute l'ID courant au chemin pour les enfants
      const newPath = new Set(path);
      newPath.add(currentId);

      for (const comp of item.components) {
        await resolve(comp.childId, multiplier * comp.quantity, depth + 1, newPath);
      }
    }
  }

  // Démarrage avec un chemin vide et profondeur 0
  await resolve(itemId, 1, 0, new Set());
  return totals;
}

/**
 * EXPORT JSON
 * Génère un dump complet de la bibliothèque compatible avec l'import
 */
/**
 * EXPORT JSON (Avec filtre optionnel)
 * categories: tableau de strings (ex: ['PUMP', 'TANK']) ou null pour tout exporter
 */
export async function exportLibraryData(domain: string, categories?: string[]) {
  // Construction du filtre dynamique
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

  // Transformation (Nettoyage pour JSON portable)
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