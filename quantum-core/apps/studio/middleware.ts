import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextMiddleware, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as { role?: string } | undefined)?.role;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (userRole !== "ADMIN") {
        console.log("Accès refusé : rôle actuel =", userRole);
        // Rediriger vers le dashboard plutôt que l'accueil pour comprendre que tu es bloqué
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }
  return NextResponse.next();
}) as unknown as NextMiddleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads|library).*)"],
};