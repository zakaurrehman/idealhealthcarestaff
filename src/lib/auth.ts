// Server-side only: imported exclusively from server actions / server components.
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import type { AdminSession, StaffUser } from "@/types";

/* ====================================================================
   Signed admin sessions + password hashing (Node built-ins only)
   ==================================================================== */

const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours
const DEV_FALLBACK_SECRET = "ihs-dev-only-session-secret";

function clean(val?: string): string | undefined {
  if (!val) return undefined;
  let v = val.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1).trim();
  }
  return v || undefined;
}

/**
 * Key used to sign session cookies. Prefers ADMIN_SECRET_TOKEN; otherwise it
 * is derived from the Super Admin password so existing deployments keep
 * working (and rotating that password invalidates every session).
 */
function getSessionKey(): Buffer | null {
  const token = clean(process.env.ADMIN_SECRET_TOKEN) || clean(process.env.SESSION_SECRET);
  if (token) return createHash("sha256").update(`ihs-session:${token}`).digest();

  const adminPass =
    clean(process.env.ADMIN_PASSWORD) ||
    clean(process.env.ADMIN_PASS) ||
    clean(process.env.SUPER_ADMIN_PASSWORD) ||
    clean(process.env.ADMIN_SECRET);
  if (adminPass) return createHash("sha256").update(`ihs-session-derived:${adminPass}`).digest();

  if (process.env.NODE_ENV !== "production") {
    return createHash("sha256").update(DEV_FALLBACK_SECRET).digest();
  }
  return null;
}

const b64url = (buf: Buffer) => buf.toString("base64url");

function sign(data: string, key: Buffer): string {
  return b64url(createHmac("sha256", key).update(data).digest());
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Serialise and sign a session. Returns null if no signing key is available. */
export function createSessionToken(session: AdminSession): string | null {
  const key = getSessionKey();
  if (!key) return null;
  const payload = { ...session, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  return `${body}.${sign(body, key)}`;
}

/** Verify signature and expiry. Any tampering, legacy or unsigned value → null. */
export function verifySessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const key = getSessionKey();
  if (!key) return null;

  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!safeEqual(sig, sign(body, key))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof parsed.exp !== "number" || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    if (parsed.role !== "super_admin" && parsed.role !== "staff_admin") return null;
    delete parsed.exp;
    return parsed as AdminSession;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;

/* ── Passwords ─────────────────────────────────────────────────── */

const SCRYPT_PREFIX = "scrypt";
const SCRYPT_KEYLEN = 64;

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, SCRYPT_KEYLEN);
  return `${SCRYPT_PREFIX}$${b64url(salt)}$${b64url(hash)}`;
}

export function isHashedPassword(stored: string | undefined): boolean {
  return Boolean(stored && stored.startsWith(`${SCRYPT_PREFIX}$`));
}

/**
 * Check a password against a stored value. Supports legacy plain-text values
 * (created before hashing was added) so the caller can upgrade them on login.
 */
export function verifyPassword(plain: string, stored: string | undefined): boolean {
  if (!stored || !plain) return false;
  if (!isHashedPassword(stored)) return safeEqual(plain, stored);

  const [, saltB64, hashB64] = stored.split("$");
  if (!saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64url");
  const actual = scryptSync(plain, Buffer.from(saltB64, "base64url"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Timing-safe comparison for the Super Admin passcode. */
export function passcodeMatches(input: string, expected: string): boolean {
  return safeEqual(input, expected);
}

/** Never send password data to the browser. */
export function toPublicStaff(staff: StaffUser): StaffUser {
  const rest = { ...staff };
  delete rest.password;
  return rest;
}
