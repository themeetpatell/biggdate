import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { createPass } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { matchId, matchName, reason } = await req.json();
  createPass(auth.userId, matchId, matchName, reason || "");
  return NextResponse.json({ ok: true });
}
