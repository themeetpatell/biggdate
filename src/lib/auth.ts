import { getDb } from "./db";
import { randomUUID, createHash } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "bd_session";
const SESSION_EXPIRY_DAYS = 30;

// Simple password hashing (use bcrypt in production)
function hashPassword(password: string): string {
  return createHash("sha256").update(password + "biggdate_salt_2026").digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createUser(email: string, password: string): { id: string; email: string } | null {
  const db = getDb();
  const id = `user_${randomUUID()}`;
  const hash = hashPassword(password);

  try {
    db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)").run(id, email.toLowerCase(), hash);
    return { id, email: email.toLowerCase() };
  } catch {
    return null; // duplicate email
  }
}

export function authenticateUser(email: string, password: string): { id: string; email: string } | null {
  const db = getDb();
  const row = db.prepare("SELECT id, email, password_hash FROM users WHERE email = ?").get(email.toLowerCase()) as
    | { id: string; email: string; password_hash: string }
    | undefined;

  if (!row || !verifyPassword(password, row.password_hash)) return null;
  return { id: row.id, email: row.email };
}

export function createSession(userId: string): string {
  const db = getDb();
  const id = `sess_${randomUUID()}`;
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 86400000).toISOString();

  db.prepare("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)").run(id, userId, token, expiresAt);
  return token;
}

export function validateSession(token: string): { userId: string } | null {
  const db = getDb();
  const row = db
    .prepare("SELECT user_id, expires_at FROM sessions WHERE token = ?")
    .get(token) as { user_id: string; expires_at: string } | undefined;

  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }
  return { userId: row.user_id };
}

export function deleteSession(token: string) {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export async function getSessionFromCookies(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return validateSession(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY_DAYS * 86400,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
