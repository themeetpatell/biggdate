import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserPlan, upsertUserPlan } from "@/lib/repo";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { log } from "@/lib/log";
import { getPostHogClient } from "@/lib/posthog-server";

async function getOrCreateCustomer(userId: string, email: string | null): Promise<string> {
  const existing = await getUserPlan(userId);
  if (existing?.stripeCustomerId) return existing.stripeCustomerId;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: { userId },
  });

  await upsertUserPlan(userId, { stripeCustomerId: customer.id });
  return customer.id;
}

export async function POST(request: Request) {
  if (process.env.BILLING_MODE === "early_access") {
    return NextResponse.json(
      { error: "Stripe checkout is disabled during early access." },
      { status: 503 },
    );
  }
  if (!isStripeConfigured()) {
    log.error("billing/checkout called but STRIPE_SECRET_KEY is not set");
    return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json() as { type?: unknown; priceId?: unknown };
  const type = body.type;
  const priceId = typeof body.priceId === "string" ? body.priceId.trim() : "";
  if (!priceId) {
    return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
  }

  // Only allow price IDs that are explicitly configured for this app — prevents
  // a client from passing an arbitrary (e.g. $0) price from the same Stripe account.
  const allowedPriceIds = [
    process.env.STRIPE_PRICE_ID_PREMIUM,
    process.env.STRIPE_PRICE_ID_PRO,
    process.env.STRIPE_PRICE_ID_PREMIUM_MONTHLY,
    process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
  ].filter(Boolean) as string[];
  if (allowedPriceIds.length > 0 && !allowedPriceIds.includes(priceId)) {
    return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
  }
  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const customerId = await getOrCreateCustomer(session.userId, session.email);
  const stripe = getStripe();

  if (type === "subscription") {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 7 },
      allow_promotion_codes: true,
      success_url: `${origin}/profile?upgraded=1`,
      cancel_url: `${origin}/profile`,
    });
    getPostHogClient().capture({
      distinctId: session.userId,
      event: "checkout_initiated",
      properties: { type: "subscription", price_id: priceId },
    });
    return NextResponse.json({ url: checkoutSession.url });
  }

  if (type === "payment") {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/profile?purchased=1`,
      cancel_url: `${origin}/profile`,
    });
    getPostHogClient().capture({
      distinctId: session.userId,
      event: "checkout_initiated",
      properties: { type: "payment", price_id: priceId },
    });
    return NextResponse.json({ url: checkoutSession.url });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
