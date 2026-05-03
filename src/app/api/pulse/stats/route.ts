import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getPulseUserStats } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const stats = await getPulseUserStats(auth.userId);
  return NextResponse.json({ stats });
}
