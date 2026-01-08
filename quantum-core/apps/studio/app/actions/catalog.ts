'use server';

import { db } from '@repo/database';


export async function seedCatalog() {
  const items = [
    {
      domain: "WATER",
      category: "PUMP",
      name: "Pompe doseuse Grundfos DDA",
      specs: { flow: 30, power: 0.5, price: 1200 }
    },
    {
      domain: "WATER",
      category: "PUMP",
      name: "Pompe de transfert IWAKI MDX",
      specs: { flow: 15, power: 0.2, price: 850 }
    },
    {
      domain: "WATER",
      category: "TANK",
      name: "Cuve PEHD 1000L Standard",
      specs: { volume: 1000, price: 500, material: "PP" }
    }
  ];

  for (const item of items) {
    await db.catalogItem.upsert({
      where: { id: item.name }, // On utilise le nom comme ID temporaire pour le seed
      update: {},
      create: { ...item, id: item.name }
    });
  }
  return { success: true };
}

export async function getCatalogItems(category: string) {
  return await db.catalogItem.findMany({
    where: { category, domain: "WATER" }
  });
}