'use server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

export async function uploadImageAction(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error("Aucun fichier reçu");

  // 1. Sécurité : Vérification du type (uniquement images)
  if (!file.type.startsWith('image/')) {
    throw new Error("Le fichier doit être une image.");
  }

  // 2. Préparation du répertoire (local au Studio)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {
    // Le dossier existe déjà, c'est OK
  }

  // 3. Traitement de l'image (Sharp)
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${crypto.randomUUID()}.webp`; // Nom unique aléatoire
  const filePath = path.join(uploadDir, fileName);

  await sharp(buffer)
    .resize(1200, 630, { fit: 'cover' }) // Format standard
    .webp({ quality: 80 })               // Compression WebP
    .toFile(filePath);

  // 4. On retourne l'URL publique utilisable par Next.js
  return `/uploads/${fileName}`;
}