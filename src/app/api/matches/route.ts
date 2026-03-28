import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getCachedMatches, getMatchesForUser } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const today = new Date().toISOString().slice(0, 10);
  const cached = await getCachedMatches(auth.userId, today);
  if (cached) return NextResponse.json(cached);
  const saved = await getMatchesForUser(auth.userId);
  return NextResponse.json(saved);
}
