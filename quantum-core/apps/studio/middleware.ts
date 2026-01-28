import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

const locales = ['fr', 'en'];
const defaultLocale = 'fr';

// 1. TYPAGE INTERNE POUR LA SÉCURITÉ DU CODE
interface NextAuthRequest extends NextRequest {
  auth: {
    user?: {
      id?: string;
      role?: string;
    }
  } | null;
}

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

// 2. LOGIQUE DU MIDDLEWARE
// Note : On ne met pas 'export default' ici directement pour éviter l'erreur d'inférence
const middleware = auth((req) => {
  // On cast 'req' pour avoir l'autocomplétion sur 'req.auth' à l'intérieur
  const request = req as NextAuthRequest;
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // A. EXCLUSION
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // B. LOCALE
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const search = nextUrl.search;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${search}`, request.url)
    );
  }

  // C. SÉCURITÉ
  const isLoggedIn = !!request.auth;
  const userRole = request.auth?.user?.role; 

  const currentLocale = pathname.split('/')[1] || defaultLocale;
  const isAdminRoute = pathname.startsWith(`/${currentLocale}/admin`);

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/${currentLocale}/login?callbackUrl=${callbackUrl}`, nextUrl.origin)
      );
    }
    
    if (userRole !== "ADMIN") {
      console.warn(JSON.stringify({
        level: "WARN",
        type: "SECURITY_AUDIT",
        event: "UNAUTHORIZED_ADMIN_ACCESS",
        userId: request.auth?.user?.id || "unknown",
        role: userRole || "unknown",
        path: pathname,
        ip: request.headers.get('x-forwarded-for') || "unknown",
        timestamp: new Date().toISOString()
      }));

      return NextResponse.redirect(
        new URL(`/${currentLocale}/dashboard`, nextUrl.origin)
      );
    }
  }

  return NextResponse.next();
});

// 3. EXPORT FINAL AVEC CAST
// C'est cette ligne qui corrige l'erreur "The inferred type..."
// On dit à TypeScript : "C'est bon, exporte ça comme un objet générique, ne cherche pas plus loin."
export default middleware as any; 

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};