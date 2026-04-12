import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserPlanByStripeCustomer, upsertUserPlan } from "@/lib/repo";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe's newer API versions reorganized subscription period fields.
// We access them safely via dynamic lookup to avoid SDK version drift.
function getSubscriptionPeriodEnd(sub: Stripe.Subscription): string | null {
  const raw = (sub as unknown as Record<string, unknown>)["current_period_end"];
  if (typeof raw === "number") return new Date(raw * 1000).toISOString();
  return null;
}

async function handleSubscription(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id;

  const existing = await getUserPlanByStripeCustomer(customerId);
  if (!existing) return;

  const status: "active" | "trialing" | "canceled" | "inactive" =
    subscription.status === "active" ? "active"
    : subscription.status === "trialing" ? "trialing"
    : subscription.status === "canceled" ? "canceled"
    : "inactive";

  const trialEndsAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;

  await upsertUserPlan(existing.userId, {
    plan: status === "active" || status === "trialing" ? "premium" : "free",
    status,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
    trialEndsAt,
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscription(event.data.object as Stripe.Subscription);
      break;
    case "checkout.session.completed": {
      const session = event.data.object as unknown as Record<string, unknown>;
      if (session["mode"] === "subscription" && session["subscription"]) {
        const subscriptionId = typeof session["subscription"] === "string"
          ? session["subscription"]
          : (session["subscription"] as { id: string }).id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await handleSubscription(subscription);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
