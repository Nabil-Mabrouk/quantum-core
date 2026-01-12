'use server';

import { db } from '@repo/database';
import { auth } from '@/auth'; // Pour récupérer l'ID utilisateur

export async function recordAuditLog(action: string, domain?: string, details?: Record<string, any>) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    await db.auditLog.create({
      data: {
        action,
        domain: domain || 'N/A',
        userId: userId, // Peut être null si non connecté
        details: details || {},
      },
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
    // Ne pas rejeter l'erreur pour ne pas bloquer l'action principale
  }
}