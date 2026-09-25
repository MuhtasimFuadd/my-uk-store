// Uses the Web Crypto API (available in both the Edge middleware runtime
// and Node route handlers) rather than Node's "crypto" module, which
// doesn't work inside Next.js middleware.

export const ADMIN_COOKIE_NAME = "threshold_admin";

function getPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD environment variable is not set.");
  }
  return password;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// The cookie never stores the password itself — just an HMAC derived from
// it, so the password isn't sitting in the browser's cookie jar.
export async function createAdminSessionToken(): Promise<string> {
  const password = getPassword();
  return hmacSha256Hex(password, "threshold-admin-session");
}

export function isCorrectPassword(candidate: string): boolean {
  const password = getPassword();
  return constantTimeEqual(candidate, password);
}

export async function isValidSessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  try {
    const expected = await createAdminSessionToken();
    return constantTimeEqual(token, expected);
  } catch {
    return false;
  }
}
