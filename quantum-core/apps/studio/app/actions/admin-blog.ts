'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import JSZip from 'jszip';
import matter from 'gray-matter';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

const UpdatePostSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Titre requis").max(200),
  content: z.string().min(1, "Contenu requis"),
  excerpt: z.string().max(500).optional().nullable(),
  tags: z.string().optional().nullable(),
  image: z.string().optional().nullable().or(z.literal('')),
  published: z.preprocess((val) => val === 'on' || val === 'true', z.boolean()),
  language: z.string().length(2).optional(), 
  tutorialId: z.string().optional().nullable().or(z.literal('')), 
  order: z.coerce.number().optional().default(0), 
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
      language: post.language,
      translationId: post.translationId,
      order: post.order
    });
    zip.file(`${post.slug}.${post.language}.md`, fileContent);
  });

  const content = await zip.generateAsync({ type: "nodebuffer" });
  return Buffer.from(content).toString('base64');
}

export async function importBlogFromZipAction(base64Zip: string) {
  const session = await auth();
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Non autorisé" };

  try {
    const user = await db.user.findUnique({ where: { email: session.user.email! } });
    if (!user) return { success: false, error: "Utilisateur non trouvé" };

    const zip = await JSZip.loadAsync(Buffer.from(base64Zip, 'base64'));
    
    for (const [filename, file] of Object.entries(zip.files)) {
      if (!filename.endsWith('.md') || filename.startsWith('__MACOSX')) continue;

      const rawContent = await file.async("string");
      const { data, content } = matter(rawContent);
      
      const slug = (data.slug || filename.replace('.md', ''))
        .replace(/[^a-z0-9-]/gi, '-')
        .toLowerCase();
      
      const language = data.language || 'fr';
      const translationId = data.translationId || uuidv4();

      let tutorialId = null;
      if (data.tutorial) {
        const tutorialSlug = data.tutorial.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        
        const tutorial = await db.tutorial.upsert({
          where: { 
            language_slug: { language, slug: tutorialSlug } 
          },
          update: {},
          create: {
            title: data.tutorial,
            slug: tutorialSlug,
            language,
            translationId: uuidv4(),
            domain,
            published: true
          }
        });
        tutorialId = tutorial.id;
      }

      await db.post.upsert({
        where: { 
          language_slug: { language, slug } 
        },
        update: {
          title: data.title || "Sans titre",
          content: content,
          excerpt: data.excerpt || "",
          published: data.published ?? true,
          tags: data.tags || "",
          image: data.image,
          tutorialId: tutorialId,
          order: data.order || 0,
          translationId: translationId 
        },
        create: {
          domain,
          slug,
          language,        
          translationId,   
          tutorialId,      
          order: data.order || 0, 
          title: data.title || "Sans titre",
          content,
          excerpt: data.excerpt || "",
          published: data.published ?? true,
          tags: data.tags || "",
          image: data.image,
          authorId: user.id
        }
      });
    }

    revalidatePath('/blog');
    return { success: true };
  } catch (err: any) {
    console.error("Import Error:", err);
    return { success: false, error: err.message || "Erreur inconnue" };
  }
}

export async function updatePostAction(prevState: any, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Non autorisé" };
  }

  const validation = UpdatePostSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    tags: formData.get('tags'),
    image: formData.get('image'),
    published: formData.get('published'),
    language: formData.get('language'),
    tutorialId: formData.get('tutorialId'),
    order: formData.get('order'),
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
        excerpt: data.excerpt || "",
        tags: data.tags || "",
        published: data.published,
        image: data.image === '' ? null : data.image,
        language: data.language || 'fr',
        tutorialId: data.tutorialId === '' ? null : data.tutorialId,
        order: data.order,
      }
    });
    
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
  } catch (error) {
    return { error: "Échec de la mise à jour en base de données" };
  }

  redirect('/admin/blog');
}

export async function deletePostAction(postId: string) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Non autorisé" };
    if (!postId) return { error: "ID manquant" };
  
    await db.post.delete({ where: { id: postId } });
  
    revalidatePath(`/admin/blog`);
    revalidatePath(`/blog`);
    return { success: true };
}

export async function createPostAction() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Non autorisé");

  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  
  // FIX: Fetch the user first
  const user = await db.user.findUnique({ where: { email: session.user?.email! } });
  if (!user) throw new Error("User not found");

  const post = await db.post.create({
    data: {
      title: "Nouvel article sans titre",
      slug: `temp-${Date.now()}`,
      content: "# Commencez à rédiger ici...",
      domain: domain,
      language: "fr", 
      translationId: uuidv4(),
      published: false,
      // FIX: Use 'connect' syntax for relations
      author: {
        connect: { id: user.id }
      }
    }
  });

  redirect(`/admin/blog/${post.id}`);
}

export async function createTranslationAction(originalPostId: string, targetLanguage: string) {
  const original = await db.post.findUnique({ where: { id: originalPostId } });
  if (!original) throw new Error("Original not found");

  const existing = await db.post.findFirst({
    where: { 
      translationId: original.translationId, 
      language: targetLanguage 
    }
  });

  if (existing) return { id: existing.id };

  const newPost = await db.post.create({
    data: {
      translationId: original.translationId,
      language: targetLanguage,
      domain: original.domain,
      title: `${original.title} (${targetLanguage})`,
      slug: `${original.slug}-${targetLanguage}`,
      content: original.content, 
      published: false,
      // FIX: Connect the same author
      author: {
        connect: { id: original.authorId }
      }
    }
  });

  return { id: newPost.id };
}

export async function createTutorialAction(title: string, language: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  const slug = title.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  try {
    await db.tutorial.create({
      data: {
        title,
        slug,
        language,
        domain,
        published: true,
        translationId: uuidv4()
      }
    });
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (e) {
    return { error: "Failed to create tutorial. Slug might exist." };
  }
}
export async function deleteTutorialAction(tutorialId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Non autorisé" };

  try {
    // 1. On détache d'abord tous les articles liés (pour éviter les erreurs de contrainte)
    await db.post.updateMany({
      where: { tutorialId: tutorialId },
      data: { tutorialId: null, order: 0 }
    });

    // 2. On supprime le tutoriel
    await db.tutorial.delete({
      where: { id: tutorialId }
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { success: true };
  } catch (e) {
    return { error: "Erreur lors de la suppression du tutoriel." };
  }
}