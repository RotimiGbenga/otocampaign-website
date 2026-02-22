import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  COOKIE_NAME,
  getSessionCookieOptions,
} from "@/lib/auth";
import type { LoginRequestBody, LoginResponse } from "@/lib/types/api";

function parseLoginBody(body: unknown): { password: string } {
  if (typeof body !== "object" || body === null) {
    return { password: "" };
  }
  const { password } = body as LoginRequestBody;
  return { password: typeof password === "string" ? password : "" };
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<LoginResponse>> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { password } = parseLoginBody(body);

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("[AUTH] ADMIN_PASSWORD is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = await createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, getSessionCookieOptions());

    return NextResponse.json({
      success: true,
      redirect: "/admin",
    });
  } catch (error) {
    console.error("[AUTH] Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
