'use server';
import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createLine(projectId: string, name: string) {
  const newLine = await db.line.create({
    data: { name, projectId }
  });
  revalidatePath(`/editor/${projectId}`);
  redirect(`/editor/${projectId}?lineId=${newLine.id}`);
  return newLine;
}

export async function getLines(projectId: string) {
  return await db.line.findMany({ where: { projectId } });
}