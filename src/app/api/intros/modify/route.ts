import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getUserPlan, modifySoulKnockQuestion } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const plan = await getUserPlan(auth.userId);
  const isPaidTier =
    (plan?.plan === "premium" || plan?.plan === "pro")
    && (plan?.status === "active" || plan?.status === "trialing");

  if (!isPaidTier) {
    return NextResponse.json({ error: "Modify is available on Premium or Pro" }, { status: 403 });
  }

  const body = (await req.json()) as {
    introId?: unknown;
    soulKnockQuestion?: unknown;
  };

  const introId = typeof body.introId === "string" ? body.introId.trim() : "";
  const soulKnockQuestion =
    typeof body.soulKnockQuestion === "string"
      ? body.soulKnockQuestion.trim().slice(0, 280)
      : "";

  if (!introId || !soulKnockQuestion) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const ok = await modifySoulKnockQuestion(auth.userId, introId, soulKnockQuestion);
  if (!ok) {
    return NextResponse.json({ error: "Unable to modify Soul Knock" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, soulKnockQuestion });
}
