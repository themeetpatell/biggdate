import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getPulseFeed, createPulsePost, getUserVerificationStatus } from "@/lib/repo";
import type { PulsePostType, PulseSort } from "@/lib/types";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const ENABLED_TYPES: PulsePostType[] = ["prompt_response", "confession", "question"];

function isSort(v: string | null): v is PulseSort {
  return v === "hot" || v === "new";
}

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const sortParam = searchParams.get("sort");
  const sort: PulseSort = isSort(sortParam) ? sortParam : "hot";
  const cursor = searchParams.get("cursor") ?? undefined;
  const promptId = searchParams.get("promptId") ?? undefined;

  const posts = await getPulseFeed(auth.userId, { sort, cursor, promptId });
  // Cursor: hot uses _hotScore, new uses createdAt.
  const last = posts[posts.length - 1];
  const nextCursor = posts.length === 20 && last
    ? (sort === "hot" ? String(last._hotScore ?? 0) : last.createdAt)
    : null;

  // Strip internal _hotScore before returning to client
  const sanitized = posts.map((p) => {
    const rest: Omit<typeof p, "_hotScore"> & { _hotScore?: number | null } = { ...p };
    delete rest._hotScore;
    return rest;
  });

  return NextResponse.json({ posts: sanitized, nextCursor });
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // 5 posts/hour/user — Pulse is a thoughtful feed, not a firehose.
  const rl = await checkRateLimit("pulse:post", auth.userId, { limit: 5, windowSec: 3600 });
  if (!rl.allowed) return rateLimitResponse(rl);

  const body = (await req.json()) as { type?: unknown; promptId?: unknown; content?: unknown };
  const type = typeof body.type === "string" ? (body.type as PulsePostType) : undefined;
  const promptId = typeof body.promptId === "string" && body.promptId.trim().length > 0
    ? body.promptId.trim().slice(0, 100)
    : undefined;
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!type || !ENABLED_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid post type" }, { status: 400 });
  }
  if (content.length < 5) {
    return NextResponse.json({ error: "Content too short" }, { status: 400 });
  }
  if (content.length > 500) {
    return NextResponse.json({ error: "Max 500 characters" }, { status: 400 });
  }
  if (type === "prompt_response" && !promptId) {
    return NextResponse.json({ error: "promptId required for prompt_response" }, { status: 400 });
  }

  const isVerified = await getUserVerificationStatus(auth.userId);

  const id = await createPulsePost({
    userId: auth.userId,
    type,
    promptId,
    content,
    isVerified,
  });

  return NextResponse.json({ id });
}
