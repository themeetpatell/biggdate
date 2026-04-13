import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import {
  createIntro,
  requirePlan,
  incrementUsage,
  updateIntroForSoulKnock,
  getProfileByUserId,
} from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // Feature gate: soul knock limit
  const gate = await requirePlan(auth.userId, "soul_knock");
  if (!gate.allowed) {
    return NextResponse.json({ error: "Soul Knock limit reached", gate }, { status: 403 });
  }

  const { matchId, matchName, matchedUserId, soulKnockQuestion } = await req.json();

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
