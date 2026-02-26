import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminSession } from "@/lib/auth-edge";

/**
 * Protects /admin routes and /api/admin/* routes.
 * Reads cookies only - no modifications.
 * Validates admin_auth token (signature + expiry) via Edge-compatible auth.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const isAuthenticated = await verifyAdminSession(request);

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/login" &&
    pathname !== "/api/admin/logout"
  ) {
    const isAuthenticated = await verifyAdminSession(request);

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};