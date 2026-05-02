import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  getUserPlanByStripeCustomer,
  upsertUserPlan,
  recordStripeEvent,
  deleteStripeEvent,
} from "@/lib/repo";
import { log } from "@/lib/log";
import { getStripe, getStripeWebhookSecret, isStripeWebhookConfigured } from "@/lib/stripe";

// Stripe's newer API versions reorganized subscription period fields.
// We access them safely via dynamic lookup to avoid SDK version drift.
function getSubscriptionPeriodEnd(sub: Stripe.Subscription): string | null {
  const raw = (sub as unknown as Record<string, unknown>)["current_period_end"];
  if (typeof raw === "number") return new Date(raw * 1000).toISOString();
  return null;
}

async function handleSubscription(stripe: Stripe, subscription: Stripe.Subscription) {
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
  if (!isStripeWebhookConfigured()) {
    log.error("billing/webhook called but Stripe env vars are not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  const stripe = getStripe();
  const webhookSecret = getStripeWebhookSecret();

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    log.warn("stripe webhook signature verification failed", {
      error: err instanceof Error ? err.message : "unknown",
    });
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // Idempotency: Stripe retries on non-2xx with the same event.id. Insert
  // first; if the row already existed, this is a duplicate — ack and skip.
  const isFresh = await recordStripeEvent(event.id, event.type);
  if (!isFresh) {
    log.info("stripe webhook duplicate ignored", { eventId: event.id, type: event.type });
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscription(stripe, event.data.object as Stripe.Subscription);
        break;
      case "checkout.session.completed": {
        const session = event.data.object as unknown as Record<string, unknown>;
        if (session["mode"] === "subscription" && session["subscription"]) {
          const subscriptionId = typeof session["subscription"] === "string"
            ? session["subscription"]
            : (session["subscription"] as { id: string }).id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await handleSubscription(stripe, subscription);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    log.error("stripe webhook handler failed", err, {
      eventId: event.id,
      type: event.type,
    });
    // Clear the idempotency marker so Stripe retries can actually reprocess.
    await deleteStripeEvent(event.id);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
