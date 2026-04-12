import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionFromCookies } from "@/lib/auth";
import { getUserPlan } from "@/lib/repo";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

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
