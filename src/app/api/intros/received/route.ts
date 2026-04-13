import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getIntrosReceivedByUser, requirePlan } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // "See who liked you" is gated at premium+
  const gate = await requirePlan(auth.userId, "soul_knock");
  if (gate.plan === "free") {
    return NextResponse.json({ locked: true, gate });
  }

  const intros = await getIntrosReceivedByUser(auth.userId);
  return NextResponse.json({ intros });
}
