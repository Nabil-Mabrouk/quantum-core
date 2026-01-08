import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protège tout sauf les assets, l'api et les pages publiques
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads|library).*)"],
};