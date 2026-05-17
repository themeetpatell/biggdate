import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getThreadById, updateDateProposalStatus } from "@/lib/repo";
import { sql } from "@/lib/db";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

interface OriginRow {
  sender_id: string;
  kind: string;
  status: string | null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // 30 actions/min/user — generous; caps a runaway client loop without
  // gating real responses.
  const rl = await checkRateLimit("proposals:respond", auth.userId, { limit: 30, windowSec: 60 });
  if (!rl.allowed) return rateLimitResponse(rl);

  const { threadId } = await params;
  const thread = await getThreadById(threadId, auth.userId);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as
    | { messageId?: unknown; action?: unknown }
    | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const messageId = typeof body.messageId === "string" ? body.messageId : "";
  const action = body.action;
  if (!messageId) {
    return NextResponse.json({ error: "messageId is required" }, { status: 400 });
  }
  if (action !== "accept" && action !== "decline" && action !== "withdraw") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  // Find the proposal's original sender so we can enforce role rules:
  //   - withdraw → only the proposer
  //   - accept / decline → only the OTHER party
  const originRows = (await sql`
    SELECT sender_id::text AS sender_id, kind, meta->>'status' AS status
    FROM messages
    WHERE id = ${messageId} AND thread_id = ${threadId}
    LIMIT 1
  `) as unknown as OriginRow[];
  if (!originRows.length) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }
  const origin = originRows[0];
  if (origin.kind !== "date_proposal") {
    return NextResponse.json({ error: "Message is not a date proposal" }, { status: 400 });
  }
  if (origin.status && origin.status !== "pending") {
    return NextResponse.json({ error: "Proposal already resolved" }, { status: 409 });
  }

  const proposerId = origin.sender_id;
  if (action === "withdraw") {
    if (proposerId !== auth.userId) {
      return NextResponse.json({ error: "Only the proposer can withdraw" }, { status: 403 });
    }
  } else {
    if (proposerId === auth.userId) {
      return NextResponse.json({ error: "Proposer can't respond to their own proposal" }, { status: 403 });
    }
  }

  const newStatus =
    action === "accept" ? "accepted" : action === "decline" ? "declined" : "withdrawn";
  const updated = await updateDateProposalStatus(messageId, threadId, newStatus, auth.userId);
  if (!updated) {
    return NextResponse.json({ error: "Proposal could not be updated" }, { status: 409 });
  }

  return NextResponse.json(updated);
}
