'use server';

import { db } from '@repo/database';

// apps/studio/app/actions/blog.ts

export async function getPostBySlug(slug: string, locale: string) {
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "SURFACE_TREATMENT";
  
  return await db.post.findFirst({
    where: { 
      slug: slug,
      language: locale, // 👈 Strict : l'article doit correspondre à la langue de l'URL
      domain: domain,
      published: true 
    },
    include: {
      author: true,
      tutorial: {
        include: {
          posts: {
            where: { language: locale, published: true }, // Les chapitres aussi
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  });
}

/**
 * NEW: Helper to find the slug of the SAME post in another language.
 * Used for the Language Switcher in the Header.
 */
export async function getTranslatedSlug(translationId: string, targetLocale: string) {
  const post = await db.post.findFirst({
    where: {
      translationId: translationId,
      language: targetLocale,
      published: true
    },
    select: { slug: true }
  });
  return post?.slug || null;
}