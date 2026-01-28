'use server';

import { db } from '@repo/database';
import { headers } from 'next/headers';

type LogLevel = 'INFO' | 'WARN' | 'CRITICAL';

interface LogPayload {
  action: string;
  message?: string;
  metadata?: Record<string, any>;
  userId?: string;
}

export async function logSecurityEvent(level: LogLevel, payload: LogPayload) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Nettoyage préventif des métadonnées pour ne jamais logger de mots de passe
    const safeMetadata = { ...payload.metadata };
    if ('password' in safeMetadata) delete safeMetadata.password;
    if ('token' in safeMetadata) delete safeMetadata.token;

    await db.auditLog.create({
      data: {
        level: level as string,
        action: payload.action,
        domain: 'SECURITY',
        userId: payload.userId || null,
        ipAddress: ip,
        userAgent: userAgent,
        metadata: {
          message: payload.message,
          ...safeMetadata
        }
      }
    });
  } catch (error) {
    // Si le log échoue, on l'affiche juste dans la console serveur pour ne pas crasher l'app
    console.error("FAILED TO WRITE SECURITY LOG:", error);
  }
}