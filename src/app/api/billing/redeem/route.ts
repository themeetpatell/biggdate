import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { upsertUserPlan, getUserPlan } from "@/lib/repo";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/rate-limit";
import { log } from "@/lib/log";

// Early-access redemption endpoint.
//
// During pre-launch we hand out coupon codes via email instead of charging
// through Stripe. Each code is validated against EARLY_ACCESS_CODES (a
// comma-separated env list) and grants premium on the user's plan row.
//
// Stripe billing code is intentionally preserved untouched — we'll flip back
// to it by changing BILLING_MODE later.

function getValidCodes(): Set<string> {
  return new Set(
    (process.env.EARLY_ACCESS_CODES ?? "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
  );
}

export async function POST(request: Request) {
  if (process.env.BILLING_MODE !== "early_access") {
    return NextResponse.json(
      { error: "Coupon redemption is not available right now." },
      { status: 503 },
    );
  }

  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const ip = clientIp(request);
  const rl = await checkRateLimit("billing:redeem", ip, { limit: 5, windowSec: 3600 });
  if (!rl.allowed) return rateLimitResponse(rl);

  let body: { code?: unknown };
  try {
    body = (await request.json()) as { code?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!code || code.length > 64) {
    return NextResponse.json({ error: "Enter your access code." }, { status: 400 });
  }

  const validCodes = getValidCodes();
  if (validCodes.size === 0) {
    log.error("billing/redeem called but EARLY_ACCESS_CODES is empty");
    return NextResponse.json({ error: "Redemption is not configured." }, { status: 503 });
  }

  if (!validCodes.has(code)) {
    log.warn("billing/redeem invalid code", { userId: auth.userId });
    return NextResponse.json(
      { error: "That code didn't work. Double-check or email us at meet@biggventures.com." },
      { status: 400 },
    );
  }

  const existing = await getUserPlan(auth.userId);
  if (existing?.plan === "premium" && existing.status === "active") {
    return NextResponse.json({ ok: true, alreadyActive: true });
  }

  await upsertUserPlan(auth.userId, {
    plan: "premium",
    status: "active",
    // No Stripe subscription, so no period end. Re-evaluate when we flip to
    // paid — the webhook handler will overwrite these fields anyway.
    stripeSubscriptionId: null,
    currentPeriodEnd: null,
    trialEndsAt: null,
  });

  log.info("billing/redeem success", { userId: auth.userId });
  return NextResponse.json({ ok: true });
}
