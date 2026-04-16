import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getPulseReplies, createPulseReply, getUserVerificationStatus } from "@/lib/repo";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const replies = await getPulseReplies(id);
  return NextResponse.json({ replies });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const { content } = await req.json();

  if (!content || String(content).trim().length < 3) {
    return NextResponse.json({ error: "Reply too short" }, { status: 400 });
  }
  if (String(content).trim().length > 300) {
    return NextResponse.json({ error: "Max 300 characters" }, { status: 400 });
  }

  const isVerified = await getUserVerificationStatus(auth.userId);
  const replyId = await createPulseReply({
    postId: id,
    userId: auth.userId,
    content: String(content).trim(),
    isVerified,
  });

  return NextResponse.json({ id: replyId });
}
