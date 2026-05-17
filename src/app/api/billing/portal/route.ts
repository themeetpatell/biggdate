import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserPlan } from "@/lib/repo";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { log } from "@/lib/log";

export async function POST(request: Request) {
  if (process.env.BILLING_MODE === "early_access") {
    return NextResponse.json(
      { error: "Stripe billing portal is disabled during early access." },
      { status: 503 },
    );
  }
  if (!isStripeConfigured()) {
    log.error("billing/portal called but STRIPE_SECRET_KEY is not set");
    return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const stripe = getStripe();

  const plan = await getUserPlan(session.userId);
  if (!plan?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 404 });
  }

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: plan.stripeCustomerId,
    return_url: `${origin}/profile`,
  });

  return NextResponse.json({ url: portalSession.url });
}
