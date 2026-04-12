import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getUserPlan } from "@/lib/repo";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const plan = await getUserPlan(session.userId);
  const isPremium = plan?.status === "active" || plan?.status === "trialing";

  return NextResponse.json({
    plan: plan?.plan ?? "free",
    status: plan?.status ?? "inactive",
    isPremium,
    currentPeriodEnd: plan?.currentPeriodEnd ?? null,
    trialEndsAt: plan?.trialEndsAt ?? null,
  });
}
