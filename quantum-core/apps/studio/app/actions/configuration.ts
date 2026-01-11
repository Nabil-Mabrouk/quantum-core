'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation du format du JSON de configuration
const ConfigImportSchema = z.record(
  z.string(), // La clé est la catégorie (ex: "PUMP")
  z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(['string', 'number', 'boolean', 'textarea', 'select']).optional().default('string'),
      unit: z.string().optional(),
      options: z.array(z.string()).optional() // Pour les selects
    })
  )
);

/**
 * Importe un JSON de configuration des champs
 * Format attendu : { "PUMP": [ ...fields ], "TANK": [ ...fields ] }
 * Si une catégorie contient un tableau vide [], la configuration est supprimée (Reset).
 */
export async function importCategorySchemas(domain: string, jsonData: any) {
  const validation = ConfigImportSchema.safeParse(jsonData);
  
  if (!validation.success) {
    return { success: false, error: "Format invalide : " + validation.error.message };
  }

  const categories = validation.data;

  try {
    await db.$transaction(async (tx) => {
      for (const [category, fields] of Object.entries(categories)) {
        
        // LOGIQUE DE RESET : Si le tableau de champs est vide, on supprime la config en base
        if (fields.length === 0) {
          await tx.categorySchema.deleteMany({
            where: { domain, category }
          });
        } else {
          // Sinon, on met à jour (Upsert standard)
          await tx.categorySchema.upsert({
            where: { 
              domain_category: { domain, category } 
            },
            update: { fields },
            create: { domain, category, fields }
          });
        }
      }
    });

    revalidatePath('/library');
    return { success: true, count: Object.keys(categories).length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Récupère les schémas dynamiques pour l'éditeur
 */
export async function getDynamicSchemas(domain: string) {
  const schemas = await db.categorySchema.findMany({
    where: { domain }
  });

  // On transforme le tableau DB en objet { "PUMP": fields, ... }
  const schemaMap: Record<string, any[]> = {};
  schemas.forEach(s => {
    schemaMap[s.category] = s.fields as any[];
  });
  
  return schemaMap;
}