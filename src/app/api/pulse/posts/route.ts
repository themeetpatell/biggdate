import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getPulseFeed, createPulsePost, getUserVerificationStatus } from "@/lib/repo";
import type { PulsePostType } from "@/lib/types";

// Expand this array as user count grows to unlock confession / question types
const ENABLED_TYPES: PulsePostType[] = ["prompt_response"];

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") ?? undefined;

  const posts = await getPulseFeed(auth.userId, cursor);
  const nextCursor = posts.length === 20 ? posts[posts.length - 1].createdAt : null;

  return NextResponse.json({ posts, nextCursor });
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { type, promptId, content } = (await req.json()) as {
    type: PulsePostType;
    promptId?: string;
    content: string;
  };

  if (!ENABLED_TYPES.includes(type)) {
    return NextResponse.json({ error: "Post type not available yet" }, { status: 403 });
  }
  if (!content || String(content).trim().length < 5) {
    return NextResponse.json({ error: "Content too short" }, { status: 400 });
  }
  if (String(content).trim().length > 500) {
    return NextResponse.json({ error: "Max 500 characters" }, { status: 400 });
  }
  if (type === "prompt_response" && !promptId) {
    return NextResponse.json({ error: "promptId required" }, { status: 400 });
  }

  const isVerified = await getUserVerificationStatus(auth.userId);

  const id = await createPulsePost({
    userId: auth.userId,
    type,
    promptId,
    content: String(content).trim(),
    isVerified,
  });

  return NextResponse.json({ id });
}
