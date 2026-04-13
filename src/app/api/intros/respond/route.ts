import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import {
  getIntroById,
  saveSoulKnockResponse,
  markIntroAnswered,
  createThread,
  unlockPhotosForBothUsers,
  getProfileByUserId,
} from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { introId, response }: { introId: string; response: string } = await req.json();

  if (!introId || !response) {
    return NextResponse.json({ error: "introId and response required" }, { status: 400 });
  }
  if (response.length > 280) {
    return NextResponse.json({ error: "Response must be 280 characters or less" }, { status: 400 });
  }

  const intro = await getIntroById(introId);
  if (!intro) {
    return NextResponse.json({ error: "Intro not found" }, { status: 404 });
  }

  // Determine if current user is sender or receiver
  const isSender = intro.userId === auth.userId;
  const isReceiver = intro.matchedUserId === auth.userId;

  if (!isSender && !isReceiver) {
    return NextResponse.json({ error: "Not authorized for this intro" }, { status: 403 });
  }

  // Save the response
  await saveSoulKnockResponse(introId, auth.userId, response);
  await markIntroAnswered(introId, isSender ? "sender" : "receiver");

  // Re-fetch intro to check if mutual
  const updatedIntro = await getIntroById(introId);
  const mutual = updatedIntro?.senderAnswered && updatedIntro?.receiverAnswered;

  let thread = null;

  if (mutual && intro.userId && intro.matchedUserId) {
    // Create thread (idempotent — ON CONFLICT DO NOTHING)
    thread = await createThread(intro.userId, intro.matchedUserId, introId);

    // Unlock photos for both sides
    await unlockPhotosForBothUsers(introId);

    // Notify both users
    const [senderProfile, receiverProfile] = await Promise.all([
      getProfileByUserId(intro.userId),
      getProfileByUserId(intro.matchedUserId),
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (baseUrl) {
      if (senderProfile && receiverProfile) {
        fetch(`${baseUrl}/api/notifications/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "mutual_match",
            toUserId: intro.userId,
            otherName: receiverProfile.name,
            threadId: thread.id,
          }),
        }).catch(() => {});

        fetch(`${baseUrl}/api/notifications/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "mutual_match",
            toUserId: intro.matchedUserId,
            otherName: senderProfile.name,
            threadId: thread.id,
          }),
        }).catch(() => {});
      }
    }
  } else if (!mutual) {
    // Notify the other person that this user answered
    const otherUserId = isSender ? intro.matchedUserId : intro.userId;
    const myProfile = await getProfileByUserId(auth.userId);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (otherUserId && myProfile && baseUrl) {
      fetch(`${baseUrl}/api/notifications/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "soul_knock_answered",
          toUserId: otherUserId,
          responderName: myProfile.name,
        }),
      }).catch(() => {});
    }
  }

  return NextResponse.json({ success: true, mutual: Boolean(mutual), thread });
}
