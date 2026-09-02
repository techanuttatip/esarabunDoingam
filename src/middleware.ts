import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname.startsWith('/login');
  const isPublicPage =
    pathname.startsWith('/verify') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/platform-admin');

  // Check for active session cookies
  const hasSessionCookie =
    req.cookies.has('smart_sarabun_session') ||
    req.cookies.has('smart_sarabun_role') ||
    req.cookies.has('authjs.session-token') ||
    req.cookies.has('next-auth.session-token') ||
    req.cookies.has('__Secure-next-auth.session-token') ||
    req.cookies.has('__Secure-authjs.session-token');

  const isLoggedIn = hasSessionCookie;

  // Helper to attach hardened security headers
  const applySecurityHeaders = (res: NextResponse) => {
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    return res;
  };

  // If already logged in and visiting /login -> redirect to dashboard /
  if (isAuthPage && isLoggedIn) {
    return applySecurityHeaders(NextResponse.redirect(new URL('/', req.url)));
  }

  // Allow public pages & auth page
  if (isPublicPage || isAuthPage) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Protect dashboard routes when unauthenticated -> redirect to /login
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
