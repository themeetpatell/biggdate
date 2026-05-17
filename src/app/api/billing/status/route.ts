import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserPlan, getActiveAddons } from "@/lib/repo";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [plan, addons] = await Promise.all([
    getUserPlan(session.userId),
    getActiveAddons(session.userId),
  ]);
  const isPremium = plan?.status === "active" || plan?.status === "trialing";

  return NextResponse.json({
    plan: plan?.plan ?? "free",
    status: plan?.status ?? "inactive",
    isPremium,
    currentPeriodEnd: plan?.currentPeriodEnd ?? null,
    trialEndsAt: plan?.trialEndsAt ?? null,
    addons: addons.map((a) => ({
      addonId: a.addonId,
      usesRemaining: a.usesRemaining,
      expiresAt: a.expiresAt,
    })),
  });
}
