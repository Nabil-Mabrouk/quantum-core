'use server';

import { db } from '@repo/database';

export async function seedH2OLibrary() {
  const domain = "WATER";
  console.log("🧪 Démarrage de l'import Chimie H2O...");

  // 1. LISTE DES IONS (BaseUnit)
  const ions = [
    { symbol: "H+", name: "Proton", charge: 1, molarMass: 1.008 },
    { symbol: "OH-", name: "Hydroxyde", charge: -1, molarMass: 17.007 },
    { symbol: "Na+", name: "Sodium", charge: 1, molarMass: 22.99 },
    { symbol: "Ca++", name: "Calcium", charge: 2, molarMass: 40.078 },
    { symbol: "Cl-", name: "Chlorure", charge: -1, molarMass: 35.45 },
    { symbol: "SO4--", name: "Sulfate", charge: -2, molarMass: 96.06 },
    { symbol: "PO4---", name: "Phosphate", charge: -3, molarMass: 94.97 },
    { symbol: "Ni++", name: "Nickel", charge: 2, molarMass: 58.69 },
    { symbol: "Zn++", name: "Zinc", charge: 2, molarMass: 65.38 },
    { symbol: "CN-", name: "Cyanure", charge: -1, molarMass: 26.02 },
    { symbol: "CrVI", name: "Chrome VI", charge: 6, molarMass: 51.996 },
  ];

  // Insertion des Ions
  for (const ion of ions) {
    await db.baseUnit.upsert({
      where: { id: ion.symbol }, // On utilise le symbole comme ID
      update: { 
        name: ion.name, 
        properties: { charge: ion.charge, molarMass: ion.molarMass } 
      },
      create: {
        id: ion.symbol,
        domain,
        name: ion.name,
        symbol: ion.symbol,
        properties: { charge: ion.charge, molarMass: ion.molarMass }
      }
    });
  }

  // 2. LISTE DES PRODUITS CHIMIQUES (ReferenceItem)
  const products = [
    {
      name: "Acide Sulfurique 98%",
      category: "REAGENT", // Acide
      properties: { density: 1.84, purity: 98, fds: "Corrosif" },
      composition: [
        { ion: "H+", coeff: 2 },
        { ion: "SO4--", coeff: 1 }
      ]
    },
    {
      name: "Soude Caustique 30%",
      category: "REAGENT", // Base
      properties: { density: 1.33, purity: 30, fds: "Corrosif" },
      composition: [
        { ion: "Na+", coeff: 1 },
        { ion: "OH-", coeff: 1 }
      ]
    },
    {
      name: "Chlorure de Nickel (Sel)",
      category: "REAGENT",
      properties: { density: 1.92, purity: 100, fds: "Toxique" },
      composition: [
        { ion: "Ni++", coeff: 1 },
        { ion: "Cl-", coeff: 2 }
      ]
    }
  ];

  // Insertion des Produits
  for (const prod of products) {
    const item = await db.referenceItem.upsert({
      where: { name: prod.name },
      update: { 
        category: prod.category, 
        properties: prod.properties 
      },
      create: {
        domain,
        name: prod.name,
        category: prod.category,
        properties: prod.properties
      }
    });

    // On efface l'ancienne composition pour la recréer proprement
    await db.itemComposition.deleteMany({ where: { referenceItemId: item.id } });

    for (const comp of prod.composition) {
      // On lie le produit à l'ion (BaseUnit)
      // Note: comp.ion correspond à l'ID (symbol) qu'on a mis juste avant
      await db.itemComposition.create({
        data: {
          referenceItemId: item.id,
          baseUnitId: comp.ion, 
          coefficient: comp.coeff
        }
      });
    }
  }
  
  return { success: true };
}