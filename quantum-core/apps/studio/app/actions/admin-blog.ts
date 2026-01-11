'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import JSZip from 'jszip';
import matter from 'gray-matter';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

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
  
  if (!session?.user?.email) return { success: false, error: "Non authentifié" };

  try {
    // On récupère l'utilisateur en base pour être sûr de l'ID
    const user = await db.user.findUnique({ where: { email: session.user.email } });
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

export async function updatePostAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Non autorisé");

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const tags = formData.get('tags') as string;
  
  // LOGIQUE CRUCIALE : En HTML, une checkbox n'envoie "on" que si elle est cochée.
  // Si elle est décochée, formData.get('published') renvoie null.
  const published = formData.get('published') === 'on';

  try {
    await db.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        tags,
        published,
      }
    });
  } catch (error) {
    console.error("Erreur update post:", error);
    return { error: "Échec de la mise à jour" };
  }

  // On rafraîchit les pages pour voir les changements
  revalidatePath('/blog');
  revalidatePath(`/blog/${formData.get('slug')}`);
  revalidatePath('/admin/blog');
  
  // On redirige vers la liste des articles
  redirect('/admin/blog');
}

export async function deletePostAction(postId: string) {
    if (!postId) return { error: "ID de post manquant" };
  
    await db.post.delete({
      where: { id: postId },
    });
  
    revalidatePath(`/admin/blog`);
    revalidatePath(`/blog`);
    return { success: true };
}