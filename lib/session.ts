import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionPayload, Omen } from "./types";
import { generateOmen } from "./omen";

const COOKIE_NAME = "shambala_session";
const ALG = "HS256";

function getSecret(): Uint8Array {
  const s = process.env.SESSION_SECRET || "shambala_default_session_secret_key_minimum_32_chars_kalyug";
  return new TextEncoder().encode(s);
}

/** Generate a random 128-bit hex session id. */
function generateSid(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Create a fresh session and set the cookie. Returns the session payload. */
export async function createSession(): Promise<SessionPayload> {
  const sid = generateSid();
  const omen = generateOmen(sid);
  const session: SessionPayload = {
    sid,
    omen,
    turns_left: 14,
    kali: 0,
    locked_until: null,
    burns: 0,
    consecutive_passes: 0,
    last_user_messages: [],
    created_at: Date.now(),
  };
  await persistSession(session);
  return session;
}

/** Encode a session into a signed JWT and write it to the response cookie. */
export async function persistSession(session: SessionPayload): Promise<void> {
  const token = await new SignJWT(session as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7200, // 2 hours
  });
}

/** Read and verify the session from the request cookie. Returns null if absent/invalid. */
export async function loadSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Destroy the session cookie. */
export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
