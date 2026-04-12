import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionFromCookies } from "@/lib/auth";
import { getUserPlan, upsertUserPlan } from "@/lib/repo";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function getOrCreateCustomer(userId: string, email: string | null): Promise<string> {
  const existing = await getUserPlan(userId);
  if (existing?.stripeCustomerId) return existing.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: { userId },
  });

  await upsertUserPlan(userId, { stripeCustomerId: customer.id });
  return customer.id;
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { type, priceId } = await request.json() as { type: "subscription" | "payment"; priceId: string };
  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const customerId = await getOrCreateCustomer(session.userId, session.email);

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
    return NextResponse.json({ url: checkoutSession.url });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
