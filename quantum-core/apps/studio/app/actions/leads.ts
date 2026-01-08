'use server';

import { db } from '@repo/database';

export async function registerLeadAction(email: string, source: string) {
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "CORE";
  
  try {
    await db.lead.upsert({
      where: { email },
      update: { domain, source }, // Met à jour s'il existe déjà
      create: { email, domain, source }
    });
    return { success: true };
  } catch (error) {
    console.error("Lead Error:", error);
    return { success: false, error: "Email invalide ou déjà enregistré." };
  }
}