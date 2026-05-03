import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import {
  createIntro,
  getIntroByUserAndMatchedUser,
  requirePlan,
  incrementUsage,
  updateIntroForSoulKnock,
  getProfileByUserId,
} from "@/lib/repo";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // Hard ceiling on Soul Knocks regardless of plan tier — abuse-prevention
  // backstop in case a plan misconfig hands premium someone unlimited intros.
  const rl = await checkRateLimit("intros:request", auth.userId, { limit: 10, windowSec: 3600 });
  if (!rl.allowed) return rateLimitResponse(rl);

  // Feature gate: soul knock limit
  const gate = await requirePlan(auth.userId, "soul_knock");
  if (!gate.allowed) {
    return NextResponse.json({ error: "Soul Knock limit reached", gate }, { status: 403 });
  }

  const body = (await req.json()) as {
    matchId?: unknown;
    matchName?: unknown;
    matchedUserId?: unknown;
    soulKnockQuestion?: unknown;
  };
  const matchId = typeof body.matchId === "string" ? body.matchId.trim() : "";
  const matchName = typeof body.matchName === "string" ? body.matchName.trim().slice(0, 120) : "";
  const matchedUserId =
    typeof body.matchedUserId === "string" && UUID_RE.test(body.matchedUserId)
      ? body.matchedUserId
      : undefined;
  const soulKnockQuestion =
    typeof body.soulKnockQuestion === "string"
      ? body.soulKnockQuestion.trim().slice(0, 280)
      : undefined;

  if (!matchId || matchId.length > 200) {
    return NextResponse.json({ error: "Invalid matchId" }, { status: 400 });
  }

  if (matchedUserId) {
    const existing = await getIntroByUserAndMatchedUser(auth.userId, matchedUserId);
    if (existing) {
      return NextResponse.json({ ...existing, alreadySent: true });
    }
  }

  const intro = await createIntro(auth.userId, matchId, matchName);

  // If this is a real-user match, store the link + question
  if (matchedUserId && soulKnockQuestion) {
    await updateIntroForSoulKnock(intro.id, matchedUserId, soulKnockQuestion);
  }

  await incrementUsage(auth.userId, "soul_knock");

  // Fetch sender name for notification
  const senderProfile = await getProfileByUserId(auth.userId);

  // Fire-and-forget email notification to receiver
  if (matchedUserId && senderProfile) {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "soul_knock_received",
        toUserId: matchedUserId,
        senderName: senderProfile.name,
        question: soulKnockQuestion,
      }),
    }).catch(() => {});
  }

  return NextResponse.json(intro);
}
