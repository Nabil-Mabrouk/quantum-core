// apps/studio/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@repo/database";
import { authConfig } from "./auth.config";
import Nodemailer from "next-auth/providers/nodemailer";

// C'est cette ligne qui manquait ou était incomplète
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  basePath: "/api/auth", // Force le chemin sans locale
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false // Autorise les certificats auto-signés en dev
        }
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
});