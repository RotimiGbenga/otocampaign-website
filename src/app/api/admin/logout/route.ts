import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionCookieName, getSessionCookieOptions } from "@/lib/auth";

/**
 * POST /api/admin/logout
 * Route Handler - cookie modification is allowed here (Next.js 15).
 * Clears admin session cookie (expires immediately, same path as login).
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const opts = getSessionCookieOptions();
    cookieStore.set(getSessionCookieName(), "", {
      ...opts,
      maxAge: 0,
      expires: new Date(0),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[AUTH] Logout failed:", error);
    // Still return success - cookie may already be absent
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
