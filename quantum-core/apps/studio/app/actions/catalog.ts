'use server';

import { db } from '@repo/database';

export async function seedCatalog() {
  const items = [
    {
      domain: "WATER",
      category: "PUMP",
      name: "Pompe doseuse Grundfos DDA",
      // We map "specs" to "properties" for the DB
      properties: { flow: 30, power: 0.5, price: 1200 }
    },
    {
      domain: "WATER",
      category: "PUMP",
      name: "Pompe de transfert IWAKI MDX",
      properties: { flow: 15, power: 0.2, price: 850 }
    },
    {
      domain: "WATER",
      category: "TANK",
      name: "Cuve PEHD 1000L Standard",
      properties: { volume: 1000, price: 500, material: "PP" }
    }
  ];

  for (const item of items) {
    // We use ReferenceItem instead of CatalogItem
    // 'name' is unique in the schema, allowing upsert
    await db.referenceItem.upsert({
      where: { name: item.name },
      update: {
        category: item.category,
        properties: item.properties
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

export async function getCatalogItems(category: string) {
  const items = await db.referenceItem.findMany({
    where: { category, domain: "WATER" }
  });

  // UI Compatibility Layer:
  // The UI expects 'specs', but DB has 'properties'. We map it back.
  return items.map(item => ({
    ...item,
    specs: item.properties
  }));
}