import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Fonction pour instancier le client avec l'adaptateur
const createPrismaClient = () => {
  // 1. On crée un Pool de connexion PostgreSQL classique
  const pool = new Pool({ connectionString });
  
  // 2. On crée l'adaptateur Prisma qui utilise ce pool
  const adapter = new PrismaPg(pool);
  
  // 3. On passe l'adaptateur au client
  return new PrismaClient({ adapter });
};

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export * from '@prisma/client';