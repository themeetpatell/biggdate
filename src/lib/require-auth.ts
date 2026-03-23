import { NextResponse } from "next/server";
import { getSessionFromCookies } from "./auth";

/**
 * Helper to require auth in API routes.
 * Returns userId or sends 401 response.
 */
export async function requireAuth(): Promise<
  { userId: string; error?: never } | { userId?: never; error: NextResponse }
> {
  const session = await getSessionFromCookies();
  if (!session) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }
  return { userId: session.userId };
}
