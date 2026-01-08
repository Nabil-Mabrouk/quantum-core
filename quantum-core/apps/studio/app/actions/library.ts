'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';

// --- GESTION DES UNITÉS DE BASE (ex: Ions) ---
export async function upsertBaseUnit(domain: string, data: any) {
  const { id, name, symbol, properties } = data;
  await db.baseUnit.upsert({
    where: { id: id || 'new_id' },
    update: { name, symbol, properties },
    create: { name, symbol, properties, domain }
  });
  revalidatePath('/library');
}

// --- GESTION DES ARTICLES (ex: Produits Chimiques) ---
export async function upsertReferenceItem(domain: string, data: any) {
  const { id, name, category, properties, composition } = data;

  return await db.$transaction(async (tx) => {
    const item = await tx.referenceItem.upsert({
      where: { id: id || 'new_item' },
      update: { name, category, properties },
      create: { name, category, properties, domain }
    });

    // Mise à jour de la composition (Dissociation)
    await tx.itemComposition.deleteMany({ where: { referenceItemId: item.id } });
    
    if (composition && composition.length > 0) {
      await tx.itemComposition.createMany({
        data: composition.map((c: any) => ({
          referenceItemId: item.id,
          baseUnitId: c.baseUnitId,
          coefficient: parseFloat(c.coefficient)
        }))
      });
    }
    return item;
  });
}

export async function getLibrary(domain: string) {
  const baseUnits = await db.baseUnit.findMany({ where: { domain } });
  const referenceItems = await db.referenceItem.findMany({
    where: { domain },
    include: { composition: { include: { baseUnit: true } } }
  });
  return { baseUnits, referenceItems };
}



export async function importLibraryJson(domain: string, jsonData: any) {
  try {
    await db.$transaction(async (tx) => {
      // 1. Import des Unités de Base (Ions)
      if (jsonData.ions) {
        for (const ion of jsonData.ions) {
          await tx.baseUnit.upsert({
            where: { id: ion.symbol || ion.name }, // On utilise le symbole comme identifiant
            update: { 
              name: ion.name, 
              symbol: ion.symbol, 
              properties: { molarMass: ion.molarMass, charge: ion.charge } 
            },
            create: { 
              id: ion.symbol || ion.name,
              domain,
              name: ion.name, 
              symbol: ion.symbol, 
              properties: { molarMass: ion.molarMass, charge: ion.charge } 
            }
          });
        }
      }

      // 2. Import des Articles de Référence (Produits)
      if (jsonData.products) {
        for (const prod of jsonData.products) {
          const item = await tx.referenceItem.upsert({
            where: { name: prod.name },
            update: { 
              category: "REAGENT", 
              properties: { density: prod.density, purity: prod.purity, fds: prod.fds } 
            },
            create: { 
              domain,
              name: prod.name, 
              category: "REAGENT", 
              properties: { density: prod.density, purity: prod.purity, fds: prod.fds } 
            }
          });

          // Nettoyage de l'ancienne composition
          await tx.itemComposition.deleteMany({ where: { referenceItemId: item.id } });

          // Création de la nouvelle composition (Liens vers les BaseUnits créés juste avant)
          if (prod.composition) {
            for (const comp of prod.composition) {
              const baseUnit = await tx.baseUnit.findFirst({ 
                where: { symbol: comp.ionSymbol, domain } 
              });
              
              if (baseUnit) {
                await tx.itemComposition.create({
                  data: {
                    referenceItemId: item.id,
                    baseUnitId: baseUnit.id,
                    coefficient: comp.coefficient
                  }
                });
              }
            }
          }
        }
      }
    });

    revalidatePath('/library');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erreur lors de l'import" };
  }
}






export async function getWaterLibrary() {
  return await db.referenceItem.findMany({
    where: { domain: "WATER" },
    include: { composition: { include: { baseUnit: true } } }
  });
}

