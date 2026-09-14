import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySignedSessionToken } from "@/lib/auth/session-token";

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ["/login", "/unauthorized", "/api/auth", "/verify"];

// Routes that require specific admin roles
const ADMIN_ROUTES = ["/users", "/roles", "/organization", "/platform-admin", "/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and static assets
  if (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get("smart_sarabun_token");
  const sessionCookie = request.cookies.get("smart_sarabun_session");

  // Check for session cookie or signed token
  if (!tokenCookie?.value && !sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, verify cryptographic signature and roles
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    const adminRoles = ["SUPER_ADMIN", "ADMIN", "PLATFORM_ADMIN"];
    let isAuthorizedAdmin = false;

    if (tokenCookie?.value) {
      const verified = await verifySignedSessionToken(tokenCookie.value);
      if (verified && verified.roles.some((r) => adminRoles.includes(r))) {
        isAuthorizedAdmin = true;
      }
    } else {
      // Fallback for legacy session cookies
      const roleCookie = request.cookies.get("smart_sarabun_role");
      if (roleCookie?.value && adminRoles.includes(roleCookie.value)) {
        isAuthorizedAdmin = true;
      }
    }

    if (!isAuthorizedAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
