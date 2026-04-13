import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getThreadById, getMessages, createMessage, markMessagesRead } from "@/lib/repo";

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

  const { threadId } = await params;
  const thread = await getThreadById(threadId, auth.userId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const { body }: { body: string } = await req.json();
  if (!body?.trim()) {
    return NextResponse.json({ error: "Message body required" }, { status: 400 });
  }

  const message = await createMessage(threadId, auth.userId, body.trim());
  return NextResponse.json(message);
}
