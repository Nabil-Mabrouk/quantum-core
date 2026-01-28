'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from "@/auth";

/**
 * Interface étendue pour NextAuth
 */
interface ExtendedUser {
  role?: string;
  id?: string;
}

// --- SECURITY HELPER ---

async function requireAdmin() {
  const session = await auth();
  const user = session?.user as ExtendedUser;
  
  if (user?.role !== 'ADMIN') {
    throw new Error("Non autorisé: Accès administrateur requis.");
  }
  return user;
}

// --- ACTIONS DE RÉCUPÉRATION ---

export async function getLibrary(domain: string) {
  // Récupération optimisée avec tri
  return await db.libraryItem.findMany({
    where: { domain },
    include: {
      components: {
        include: { child: true }
      }
    },
    orderBy: { name: 'asc' }
  });
}

// --- ACTIONS DE MODIFICATION ---

export async function upsertLibraryItem(domain: string, data: any) {
  await requireAdmin();

  const LibraryItemSchema = z.object({
    id: z.string().optional().nullable(),
    name: z.string().min(1, "Le nom est requis"),
    category: z.string(),
    symbol: z.string().optional().nullable(),
    properties: z.record(z.any()).default({}),
    composition: z.array(z.object({
      childId: z.string(),
      quantity: z.number().positive(),
      unit: z.string().optional().nullable(),
    })).optional(),
  });

  const validated = LibraryItemSchema.parse(data);
  const { name, category, symbol, properties, composition } = validated;

  const result = await db.$transaction(async (tx) => {
    // 1. Upsert de l'item principal (Clé unique sur 'name' assurée par le schéma)
    const item = await tx.libraryItem.upsert({
      where: { name },
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

    // 2. Synchronisation de la composition (Delete + Create)
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
    return item;
  });

  revalidatePath('/[locale]/library', 'page');
  return result;
}

export async function deleteLibraryItem(id: string) {
  await requireAdmin();

  // Empêcher la suppression si l'item est une dépendance
  const usageCount = await db.composition.count({ where: { childId: id } });
  if (usageCount > 0) {
    throw new Error(`Cet élément est utilisé dans ${usageCount} autre(s) composition(s).`);
  }

  await db.libraryItem.delete({ where: { id } });
  revalidatePath('/[locale]/library', 'page');
  return { success: true };
}

// --- LOGIQUE D'IMPORTATION JSON (OPTIMISÉE) ---

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
      // ÉTAPE 1 : Création des items parents (Bulk possible si on gère les conflits)
      // On utilise une boucle mais on évite les findUnique redondants
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

      // ÉTAPE 2 : Reconstruction des liens (Composition)
      // On récupère tous les IDs en une seule fois pour le mapping name -> id
      const allItemsInDomain = await tx.libraryItem.findMany({
        where: { domain },
        select: { id: true, name: true }
      });
      const nameToIdMap = new Map(allItemsInDomain.map(i => [i.name, i.id]));

      for (const item of items) {
        const parentId = nameToIdMap.get(item.name);
        if (!parentId || !item.composition) continue;

        await tx.composition.deleteMany({ where: { parentId } });
        
        const validCompositions = item.composition
          .filter(c => nameToIdMap.has(c.childName))
          .map(c => ({
            parentId,
            childId: nameToIdMap.get(c.childName)!,
            quantity: c.quantity,
            unit: c.unit
          }));

        if (validCompositions.length > 0) {
          await tx.composition.createMany({ data: validCompositions });
        }
      }
    }, { timeout: 60000 }); // Augmentation du timeout pour les gros imports

    revalidatePath('/[locale]/library', 'page');
    return { success: true, count: items.length };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// --- EXPORTATION ---

export async function exportLibraryData(domain: string, categories?: string[]) {
  await requireAdmin();

  const items = await db.libraryItem.findMany({
    where: { 
      domain,
      ...(categories && categories.length > 0 ? { category: { in: categories } } : {})
    },
    include: {
      components: {
        include: { child: true }
      }
    },
    orderBy: { name: 'asc' }
  });

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

// --- UTILITAIRES DE CALCUL (ALGORITHME OPTIMISÉ) ---

/**
 * Aplatit récursivement la nomenclature (BOM) en minimisant les appels DB.
 * Stratégie : Chargement de l'arbre de dépendance complet en une fois.
 */
export async function getFlattenedComposition(itemId: string): Promise<Record<string, number>> {
  // 1. On récupère d'abord l'item racine pour connaître son domaine
  const root = await db.libraryItem.findUnique({ where: { id: itemId } });
  if (!root) return {};

  // 2. On charge TOUS les liens de composition du domaine pour construire le graphe en mémoire
  // Cela évite le N+1 récursif en base de données.
  const allLinks = await db.composition.findMany({
    where: { parent: { domain: root.domain } },
    include: { 
      parent: { select: { id: true, name: true } },
      child: { select: { id: true, name: true } }
    }
  });

  const graph = new Map<string, { childId: string, name: string, qty: number }[]>();
  const idToName = new Map<string, string>();

  allLinks.forEach(link => {
    const children = graph.get(link.parentId) || [];
    children.push({ childId: link.childId, name: link.child.name, qty: link.quantity });
    graph.set(link.parentId, children);
    idToName.set(link.childId, link.child.name);
  });

  const totals: Record<string, number> = {};
  
  // 3. Parcours DFS en mémoire (Ultra rapide)
  function traverse(currentId: string, multiplier: number, path: Set<string>) {
    if (path.has(currentId)) return; // Protection contre les cycles
    
    const children = graph.get(currentId);
    if (!children || children.length === 0) {
      const name = idToName.get(currentId) || root?.name || "Unknown";
      totals[name] = (totals[name] || 0) + multiplier;
      return;
    }

    const newPath = new Set(path);
    newPath.add(currentId);
    for (const child of children) {
      traverse(child.childId, multiplier * child.qty, newPath);
    }
  }

  traverse(itemId, 1, new Set());
  return totals;
}