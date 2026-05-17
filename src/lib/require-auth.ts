import { NextResponse } from "next/server";
import { getSession } from "./auth";

/**
 * Helper to require auth in API routes.
 * Accepts both web cookie sessions and native Bearer tokens.
 * Returns userId or sends 401 response.
 */
export async function requireAuth(): Promise<
  { userId: string; error?: never } | { userId?: never; error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }
  return { userId: session.userId };
}
