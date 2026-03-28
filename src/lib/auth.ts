import { sql } from "./db";
import { randomUUID, createHash } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "bd_session";
const SESSION_EXPIRY_DAYS = 30;

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "biggdate_salt_2026").digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function createUser(email: string, password: string): Promise<{ id: string; email: string } | null> {
  const id = `user_${randomUUID()}`;
  const hash = hashPassword(password);
  try {
    await sql`INSERT INTO users (id, email, password_hash) VALUES (${id}, ${email.toLowerCase()}, ${hash})`;
    return { id, email: email.toLowerCase() };
  } catch {
    return null; // duplicate email
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ id: string; email: string } | null> {
  const rows = await sql`
    SELECT id, email, password_hash FROM users WHERE email = ${email.toLowerCase()}
  `;
  if (!rows.length) return null;
  const row = rows[0] as { id: string; email: string; password_hash: string };
  if (!verifyPassword(password, row.password_hash)) return null;
  return { id: row.id, email: row.email };
}

export async function createSession(userId: string): Promise<string> {
  const id = `sess_${randomUUID()}`;
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 86400000).toISOString();
  await sql`INSERT INTO sessions (id, user_id, token, expires_at) VALUES (${id}, ${userId}, ${token}, ${expiresAt})`;
  return token;
}

export async function validateSession(token: string): Promise<{ userId: string } | null> {
  const rows = await sql`
    SELECT user_id, expires_at FROM sessions WHERE token = ${token}
  `;
  if (!rows.length) return null;
  const row = rows[0] as { user_id: string; expires_at: string };
  if (new Date(row.expires_at) < new Date()) {
    await sql`DELETE FROM sessions WHERE token = ${token}`;
    return null;
  }
  return { userId: row.user_id };
}

export async function deleteSession(token: string) {
  await sql`DELETE FROM sessions WHERE token = ${token}`;
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
