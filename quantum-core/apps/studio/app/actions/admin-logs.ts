'use server';

import { db } from '@repo/database';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// Verify Admin privileges
async function requireAdmin() {
  const session = await auth();
  // @ts-ignore - 'role' is injected via auth.config.ts
  if (session?.user?.role !== 'ADMIN') {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function getLogsAction(filters: { action?: string; search?: string } = {}) {
  await requireAdmin();

  const where: any = {};

  // Filter by Action Type (Dropdown)
  if (filters.action && filters.action !== 'ALL') {
    where.action = filters.action;
  }

  // Filter by Search (User ID, Domain, or ID)
  if (filters.search) {
    where.OR = [
      { userId: { contains: filters.search, mode: 'insensitive' } },
      { domain: { contains: filters.search, mode: 'insensitive' } },
      { id: { contains: filters.search } }
    ];
  }

  // Fetch logs (Limit 100 for performance, could add pagination later)
  const logs = await db.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return logs;
}

export async function deleteLogAction(logId: string) {
  await requireAdmin();
  await db.auditLog.delete({ where: { id: logId } });
  revalidatePath('/admin/logs');
}

export async function clearOldLogsAction(daysToKeep: number = 30) {
  await requireAdmin();
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await db.auditLog.deleteMany({
    where: {
      createdAt: { lt: cutoffDate }
    }
  });
  
  revalidatePath('/admin/logs');
  return { deleted: result.count };
}