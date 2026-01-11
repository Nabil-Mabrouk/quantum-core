// apps/studio/app/actions/blog.ts
'use server';

import { db } from '@repo/database';

export async function getPostBySlug(slug: string) {
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  
  return await db.post.findFirst({
    where: { 
      slug: slug,
      domain: domain,
      published: true 
    }
  });
}