import { NextResponse } from "next/server";
import { getSessionFromCookies } from "./auth";
import { log } from "./log";

const ADMIN_USER_IDS = new Set(
  (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean),
);

/**
 * Require admin access in API routes. Returns userId or a 401/403 response.
 * Also logs the admin action to Sentry/log for audit trail.
 */
export async function requireAdmin(action: string): Promise<
  { userId: string; error?: never } | { userId?: never; error: NextResponse }
> {
  const session = await getSessionFromCookies();
  if (!session) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }

  if (!ADMIN_USER_IDS.has(session.userId)) {
    log.warn("unauthorized admin access attempt", { userId: session.userId, action });
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  log.info("admin action", { userId: session.userId, action });
  return { userId: session.userId };
}
