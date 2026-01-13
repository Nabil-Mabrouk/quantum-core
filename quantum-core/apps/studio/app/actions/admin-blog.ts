'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import JSZip from 'jszip';
import matter from 'gray-matter';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const PostSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "Titre requis").max(200),
  content: z.string().min(1, "Contenu requis"),
  excerpt: z.string().max(500).optional(),
  tags: z.string().optional(),
  published: z.boolean().default(false),
});

export async function exportBlogToZipAction() {
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  const posts = await db.post.findMany({ where: { domain } });
  const zip = new JSZip();

  posts.forEach((post) => {
    const fileContent = matter.stringify(post.content, {
      title: post.title,
      slug: post.slug,
      published: post.published,
      excerpt: post.excerpt || "",
      tags: post.tags || "",
    });
    zip.file(`${post.slug}.md`, fileContent);
  });

  const content = await zip.generateAsync({ type: "nodebuffer" });
  return Buffer.from(content).toString('base64');
}

export async function importBlogFromZipAction(base64Zip: string) {
  const session = await auth();
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Non autorisé" };

  try {
    // On récupère l'utilisateur en base pour être sûr de l'ID
    const user = await db.user.findUnique({ where: { email: session.user.email! } });
    if (!user) return { success: false, error: "Utilisateur non trouvé" };

    const zip = await JSZip.loadAsync(Buffer.from(base64Zip, 'base64'));
    
    for (const [filename, file] of Object.entries(zip.files)) {
      if (!filename.endsWith('.md')) continue;

      const rawContent = await file.async("string");
      const { data, content } = matter(rawContent);
      const slug = (data.slug || filename.replace('.md', ''))
        .replace(/[^a-z0-9-]/gi, '_') // Remove any non-alphanumeric chars
        .toLowerCase();

      await db.post.upsert({
        where: { 
          domain_slug: { domain, slug } 
        },
        update: {
          title: data.title || "Sans titre",
          content: content,
          excerpt: data.excerpt || "",
          published: data.published ?? true,
          tags: data.tags || "",
        },
        create: {
          domain,
          slug,
          title: data.title || "Sans titre",
          content,
          excerpt: data.excerpt || "",
          published: data.published ?? true,
          tags: data.tags || "",
          authorId: user.id
        }
      });
    }

    revalidatePath('/blog');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Erreur lors du traitement ZIP" };
  }
}

// apps/studio/app/actions/admin-blog.ts
// apps/studio/app/actions/admin-blog.ts

export async function updatePostAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Non autorisé" };
  }

  // Validation Zod
  const validation = PostSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    tags: formData.get('tags'),
    published: formData.get('published') === 'on',
  });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const data = validation.data;

  try {
    await db.post.update({
      where: { id: data.id! },
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        tags: data.tags,
        published: data.published,
      }
    });
    
    // Revalidation
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
  } catch (error) {
    return { error: "Échec de la mise à jour en base de données" };
  }

  // Redirection après succès
  redirect('/admin/blog');
}

export async function deletePostAction(postId: string) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        return { error: "Non autorisé" };
    }

    if (!postId) return { error: "ID de post manquant" };
  
    await db.post.delete({
      where: { id: postId },
    });
  
    revalidatePath(`/admin/blog`);
    revalidatePath(`/blog`);
    return { success: true };
}

// apps/studio/app/actions/admin-blog.ts

export async function createPostAction() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Non autorisé");

  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  const user = await db.user.findUnique({ where: { email: session.user?.email! } });

  // Création d'un post "Brouillon" avec un titre temporaire
  const post = await db.post.create({
    data: {
      title: "Nouvel article sans titre",
      slug: `temp-${Date.now()}`, // Slug temporaire
      content: "# Commencez à rédiger ici...",
      domain: domain,
      authorId: user!.id,
      published: false,
    }
  });

  // On redirige immédiatement vers la page d'édition de ce nouveau post
  redirect(`/admin/blog/${post.id}`);
}