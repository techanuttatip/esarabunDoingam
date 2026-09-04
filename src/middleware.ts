import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ["/login", "/unauthorized", "/api/auth", "/verify"];

// Routes that require specific admin roles (checked client-side, but at least block unauthenticated)
const ADMIN_ROUTES = ["/users", "/roles", "/organization", "/platform-admin", "/settings"];

export function middleware(request: NextRequest) {
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

  // Check for session cookie — server-side gate
  const sessionCookie = request.cookies.get("smart_sarabun_session");

  if (!sessionCookie?.value) {
    // No session cookie → redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, check the role cookie as an additional layer
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    const roleCookie = request.cookies.get("smart_sarabun_role");
    const role = roleCookie?.value || "";
    const adminRoles = ["SUPER_ADMIN", "ADMIN", "PLATFORM_ADMIN"];

    if (!adminRoles.includes(role)) {
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
