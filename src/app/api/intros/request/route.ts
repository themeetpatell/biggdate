import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import {
  createIntro,
  getIntroByUserAndMatchedUser,
  requirePlanAtomic,
  updateIntroForSoulKnock,
  getProfileByUserId,
} from "@/lib/repo";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sendPushToUser } from "@/lib/push";
import { sendNotification } from "@/lib/notifications";
import { log } from "@/lib/log";
import { track, trackFirst } from "@/lib/analytics";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // Hard ceiling on Soul Knocks regardless of plan tier — abuse-prevention
  // backstop in case a plan misconfig hands premium someone unlimited intros.
  const rl = await checkRateLimit("intros:request", auth.userId, { limit: 10, windowSec: 3600 });
  if (!rl.allowed) return rateLimitResponse(rl);

  // Feature gate: soul knock limit (atomic check + increment)
  const gate = await requirePlanAtomic(auth.userId, "soul_knock");
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

  // Fetch sender name for notification
  const senderProfile = await getProfileByUserId(auth.userId);

  // Fire-and-forget notifications to receiver
  if (matchedUserId && senderProfile) {
    sendNotification({
      event: "soul_knock_received",
      toUserId: matchedUserId,
      senderName: senderProfile.name,
      question: soulKnockQuestion ?? "",
    }).catch((err) => {
      log.error("soul_knock_received notification failed", err, { toUserId: matchedUserId });
    });

    sendPushToUser(matchedUserId, {
      title: `${senderProfile.name} sent you a Soul Knock`,
      body: soulKnockQuestion ?? "Answer their question to open the conversation.",
      url: "/dashboard",
    }).catch((err) => {
      log.error("push failed (intros:request)", err, { toUserId: matchedUserId });
    });
  }

  // Funnel events — emit the first-time milestone separately so the cohort
  // dashboard can compute "% of signups who sent their first Soul Knock."
  await track({
    name: "soul_knock_sent",
    userId: auth.userId,
    properties: { matchId, recipientUserId: matchedUserId ?? null },
  });
  await trackFirst({
    name: "first_soul_knock_sent",
    userId: auth.userId,
    properties: { matchId },
  });

  return NextResponse.json(intro);
}
