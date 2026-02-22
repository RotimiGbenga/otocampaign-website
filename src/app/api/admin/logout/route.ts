import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_auth";

/**
 * POST /api/admin/logout
 * Route Handler - cookie modification is allowed here (Next.js 15).
 * Safely clears the admin_auth session cookie.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[AUTH] Logout failed:", error);
    // Still return success - cookie may already be absent
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
