import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextRequest, NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

const locales = ['fr', 'en'];
const defaultLocale = 'fr';

/**
 * Détermine la locale préférée de l'utilisateur
 */
function getLocale(request: NextRequest): string {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0]);
    for (const lang of languages) {
      if (locales.includes(lang)) {
        return lang;
      }
    }
  }
  return defaultLocale;
}

export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // 1. EXCLUSION CRITIQUE POUR LES API ET ASSETS
  // Cette partie empêche l'erreur "Unexpected token <" (NextAuth reçoit du JSON et non du HTML)
  if (
    pathname.startsWith('/api') ||      // Ne pas toucher aux routes API
    pathname.startsWith('/_next') ||   // Ne pas toucher aux fichiers internes Next.js
    pathname.includes('.')             // Ne pas toucher aux fichiers (favicon, images, etc.)
  ) {
    return NextResponse.next();
  }

  // 2. VÉRIFICATION DE LA PRÉSENCE DE LA LOCALE DANS L'URL
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 3. REDIRECTION i18n SI LA LOCALE EST MANQUANTE
  if (!pathnameHasLocale) {
    const locale = getLocale(req);
    // On conserve impérativement les paramètres de recherche (?systemId=...)
    const search = nextUrl.search;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${search}`, req.url)
    );
  }

  // 4. LOGIQUE D'AUTORISATION ET SÉCURITÉ
  const isLoggedIn = !!req.auth;
  // On cast l'utilisateur pour accéder au rôle défini dans auth.config.ts
  const user = req.auth?.user as { role?: string } | undefined;
  const userRole = user?.role;

  // On extrait la locale actuelle de l'URL pour les redirections de sécurité
  const currentLocale = pathname.split('/')[1] || defaultLocale;
  const isAdminRoute = pathname.startsWith(`/${currentLocale}/admin`);

  if (isAdminRoute) {
    // Si l'utilisateur n'est pas connecté
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/login`, nextUrl.origin)
      );
    }
    // Si connecté mais n'est pas ADMIN
    if (userRole !== "ADMIN") {
      console.warn(`[Middleware] Accès refusé à ${pathname} pour le rôle: ${userRole}`);
      return NextResponse.redirect(
        new URL(`/${currentLocale}/dashboard`, nextUrl.origin)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  // On applique le middleware à toutes les routes sauf celles explicitement listées
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};