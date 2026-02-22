import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_auth";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }
  return secret;
}

async function signPayload(payload: string): Promise<string> {
  const secret = getSecret();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${hex}`;
}

async function verifyPayload(signed: string): Promise<boolean> {
  try {
    const lastDot = signed.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = signed.slice(0, lastDot);
    const expected = await signPayload(payload);
    const sigA = signed.slice(lastDot + 1);
    const sigB = expected.slice(expected.lastIndexOf(".") + 1);
    if (sigA.length !== sigB.length) return false;
    const bufA = new Uint8Array(sigA.length / 2);
    const bufB = new Uint8Array(sigB.length / 2);
    for (let i = 0; i < sigA.length; i += 2) {
      bufA[i / 2] = parseInt(sigA.slice(i, i + 2), 16);
      bufB[i / 2] = parseInt(sigB.slice(i, i + 2), 16);
    }
    if (bufA.length !== bufB.length) return false;
    let diff = 0;
    for (let i = 0; i < bufA.length; i++) diff |= bufA[i] ^ bufB[i];
    return diff === 0;
  } catch {
    return false;
  }
}

export function createSessionPayload(): string {
  return JSON.stringify({
    admin: true,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
}

export async function createSessionToken(): Promise<string> {
  const payload = createSessionPayload();
  return signPayload(payload);
}

export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = JSON.parse(token.slice(0, lastDot));
    if (!payload.admin || !payload.exp) return false;
    if (Date.now() > payload.exp) return false;
    return verifyPayload(token);
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return !!token && (await verifySessionToken(token));
}

export async function setAdminSession(): Promise<string> {
  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return token;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}
