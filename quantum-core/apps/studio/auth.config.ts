// apps/studio/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // 1. On ajoute le rôle au JWT lors de la connexion
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // 2. On transmet le rôle du JWT vers la session accessible par le Middleware/UI
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // <--- CRUCIAL
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      
      // Si on tente d'aller sur /admin...
      if (isAdminRoute) {
        // @ts-ignore
        if (isLoggedIn && auth.user.role === "ADMIN") return true;
        return false; // Bloque et redirige
      }
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;