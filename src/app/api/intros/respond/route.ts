import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import {
  getIntroById,
  processSoulKnockResponse,
  getProfileByUserId,
} from "@/lib/repo";
import { sendPushToUser } from "@/lib/push";
import { sendNotification } from "@/lib/notifications";
import { log } from "@/lib/log";
import { track, trackFirst } from "@/lib/analytics";

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

  const { mutual, thread } = await processSoulKnockResponse(
    introId,
    auth.userId,
    response,
    isSender ? "sender" : "receiver",
  );

  if (mutual && intro.userId && intro.matchedUserId) {
    // Funnel events — emitted for both sides so first_thread_unlocked is
    // accurate per-user regardless of who answered last.
    await track({
      name: "thread_unlocked",
      userId: auth.userId,
      properties: { threadId: thread?.id ?? null, introId },
    });
    await trackFirst({
      name: "first_thread_unlocked",
      userId: intro.userId,
      properties: { threadId: thread?.id ?? null },
    });
    await trackFirst({
      name: "first_thread_unlocked",
      userId: intro.matchedUserId,
      properties: { threadId: thread?.id ?? null },
    });

    // Notify both users
    const [senderProfile, receiverProfile] = await Promise.all([
      getProfileByUserId(intro.userId),
      getProfileByUserId(intro.matchedUserId),
    ]);

    if (senderProfile && receiverProfile) {
      sendNotification({
        event: "mutual_match",
        toUserId: intro.userId,
        otherName: receiverProfile.name,
        threadId: thread?.id ?? "",
      }).catch((err) => {
        log.error("notification failed", err, { event: "mutual_match", toUserId: intro.userId });
      });

      sendNotification({
        event: "mutual_match",
        toUserId: intro.matchedUserId,
        otherName: senderProfile.name,
        threadId: thread?.id ?? "",
      }).catch((err) => {
        log.error("notification failed", err, { event: "mutual_match", toUserId: intro.matchedUserId });
      });

      sendPushToUser(intro.userId, {
        title: `You and ${receiverProfile.name} are connected`,
        body: "Your chat is now open.",
        url: thread?.id ? `/messages/${thread.id}` : "/dashboard",
      }).catch((err) => {
        log.error("push failed", err, { toUserId: intro.userId });
      });

      sendPushToUser(intro.matchedUserId, {
        title: `You and ${senderProfile.name} are connected`,
        body: "Your chat is now open.",
        url: thread?.id ? `/messages/${thread.id}` : "/dashboard",
      }).catch((err) => {
        log.error("push failed", err, { toUserId: intro.matchedUserId });
      });
    }
  } else if (!mutual) {
    // Notify the other person that this user answered
    const otherUserId = isSender ? intro.matchedUserId : intro.userId;
    const myProfile = await getProfileByUserId(auth.userId);

    if (otherUserId && myProfile) {
      sendNotification({
        event: "soul_knock_answered",
        toUserId: otherUserId,
        responderName: myProfile.name,
      }).catch((err) => {
        log.error("notification failed", err, { event: "soul_knock_answered", toUserId: otherUserId });
      });

      sendPushToUser(otherUserId, {
        title: `${myProfile.name} answered your question`,
        body: "Answer their question too to unlock the chat.",
        url: "/dashboard",
      }).catch((err) => {
        log.error("push failed", err, { toUserId: otherUserId });
      });
    }
  }

  return NextResponse.json({ success: true, mutual: Boolean(mutual), thread });
}
