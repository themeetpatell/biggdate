import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getThreadById, getMessages, createMessage, markMessagesRead } from "@/lib/repo";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const MAX_MESSAGE_LEN = 4000;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { threadId } = await params;
  const thread = await getThreadById(threadId, auth.userId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const [messages] = await Promise.all([
    getMessages(threadId),
    markMessagesRead(threadId, auth.userId),
  ]);

  return NextResponse.json({ thread, messages });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // 60 messages/min/user — generous for real conversation, blocks spam bots.
  const rl = await checkRateLimit("messages:send", auth.userId, { limit: 60, windowSec: 60 });
  if (!rl.allowed) return rateLimitResponse(rl);

  const { threadId } = await params;
  const thread = await getThreadById(threadId, auth.userId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const parsed = (await req.json()) as { body?: unknown };
  const raw = typeof parsed.body === "string" ? parsed.body.trim() : "";
  if (!raw) {
    return NextResponse.json({ error: "Message body required" }, { status: 400 });
  }
  if (raw.length > MAX_MESSAGE_LEN) {
    return NextResponse.json({ error: `Message too long (max ${MAX_MESSAGE_LEN} chars)` }, { status: 400 });
  }

  const message = await createMessage(threadId, auth.userId, raw);
  return NextResponse.json(message);
}
