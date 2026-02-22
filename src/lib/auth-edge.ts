/**
 * Edge-compatible auth helpers for middleware.
 * Uses Web Crypto API (available in Edge runtime).
 */

const COOKIE_NAME = "admin_auth";

async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${hex}`;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = JSON.parse(token.slice(0, lastDot));
    if (!payload.admin || !payload.exp) return false;
    if (Date.now() > payload.exp) return false;
    const expected = await signPayload(token.slice(0, lastDot), secret);
    const sigA = token.slice(lastDot + 1);
    const sigB = expected.slice(expected.lastIndexOf(".") + 1);
    if (sigA.length !== sigB.length) return false;
    const bufA = new Uint8Array(sigA.length / 2);
    const bufB = new Uint8Array(sigB.length / 2);
    for (let i = 0; i < sigA.length; i += 2) {
      bufA[i / 2] = parseInt(sigA.slice(i, i + 2), 16);
      bufB[i / 2] = parseInt(sigB.slice(i, i + 2), 16);
    }
    let diff = 0;
    for (let i = 0; i < bufA.length; i++) diff |= bufA[i] ^ bufB[i];
    return diff === 0;
  } catch {
    return false;
  }
}

export async function verifyAdminSession(request: Request): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match?.[1]?.trim();
  if (!token) return false;
  return verifyToken(token, secret);
}
