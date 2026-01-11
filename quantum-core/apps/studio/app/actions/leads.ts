// apps/studio/app/actions/leads.ts
'use server';

import { db } from '@repo/database';
import { z } from 'zod'; // Install with: pnpm add zod

// 1. Define the schema
const LeadSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  source: z.string().min(1).max(50).optional(),
});

export async function registerLeadAction(email: string, source: string) {
  // 2. Validate input
  const validation = LeadSchema.safeParse({ email, source });
  
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "CORE";
  
  try {
    await db.lead.upsert({
      where: { email: validation.data.email },
      update: { domain, source: validation.data.source },
      create: { email: validation.data.email, domain, source: validation.data.source }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur lors de l'enregistrement." };
  }
}