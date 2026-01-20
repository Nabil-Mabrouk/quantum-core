// apps/studio/app/actions/upload.ts
'use server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { z } from 'zod';

// 1. Strict File Schema
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const UploadSchema = z.object({
  file: z.instanceof(File, { message: "Fichier requis" })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Taille max: 5Mo.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Format invalide. Seuls .jpg, .png et .webp sont acceptés."
    ),
});

export async function uploadImageAction(formData: FormData) {
  // 2. Validate
  const validation = UploadSchema.safeParse({
    file: formData.get('file'),
  });

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  const { file } = validation.data;

  // 3. Processing
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {
    // Silent ignore if exists
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${crypto.randomUUID()}.webp`;
  const filePath = path.join(uploadDir, fileName);

  // Resize and convert to WebP for optimization + security (strips metadata)
  await sharp(buffer)
    .resize(1200, 630, { fit: 'cover', withoutEnlargement: true }) 
    .webp({ quality: 80 })
    .toFile(filePath);

  return `/uploads/${fileName}`;
}