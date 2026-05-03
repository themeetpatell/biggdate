import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { withdrawPendingIntro } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = (await req.json()) as { introId?: unknown };
  const introId = typeof body.introId === "string" ? body.introId.trim() : "";
  if (!introId) {
    return NextResponse.json({ error: "Invalid introId" }, { status: 400 });
  }

  const ok = await withdrawPendingIntro(auth.userId, introId);
  if (!ok) {
    return NextResponse.json({ error: "Unable to withdraw intro" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
