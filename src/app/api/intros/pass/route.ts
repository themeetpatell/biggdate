import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { createPass } from "@/lib/repo";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: { matchId?: unknown; matchName?: unknown; reason?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const matchId =
    typeof body.matchId === "string" ? body.matchId.trim() : "";
  const matchName =
    typeof body.matchName === "string" ? body.matchName.trim().slice(0, 120) : "";
  const reason =
    typeof body.reason === "string" ? body.reason.trim().slice(0, 280) : "";

  if (!UUID_RE.test(matchId)) {
    return NextResponse.json({ error: "Invalid matchId" }, { status: 400 });
  }
  if (!matchName) {
    return NextResponse.json({ error: "matchName is required" }, { status: 400 });
  }

  await createPass(auth.userId, matchId, matchName, reason);
  return NextResponse.json({ ok: true });
}
