import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { blockUser, createReport, invalidateMatchCache } from "@/lib/repo";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // Cap reports at 5/hour per user — prevents flood-of-reports abuse used to
  // mass-block other accounts.
  const rl = await checkRateLimit("safety:report", auth.userId, { limit: 5, windowSec: 3600 });
  if (!rl.allowed) return rateLimitResponse(rl);

  const body = (await req.json()) as { reportedId?: unknown; reason?: unknown; extraNotes?: unknown };
  const reportedId = typeof body.reportedId === "string" ? body.reportedId.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  const extraNotes =
    typeof body.extraNotes === "string" ? body.extraNotes.trim().slice(0, 500) : undefined;

  if (!reportedId || !UUID_RE.test(reportedId)) {
    return NextResponse.json({ error: "Invalid reportedId" }, { status: 400 });
  }
  if (reportedId === auth.userId) {
    return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 });
  }
  if (!reason || reason.length > 100) {
    return NextResponse.json({ error: "Reason required (max 100 chars)" }, { status: 400 });
  }

  await Promise.all([
    blockUser(auth.userId, reportedId),
    createReport(auth.userId, reportedId, reason, extraNotes),
    invalidateMatchCache(auth.userId),
  ]);

  return NextResponse.json({ success: true });
}
