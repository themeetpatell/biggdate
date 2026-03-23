import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { createIntro } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { matchId, matchName } = await req.json();
  const intro = createIntro(auth.userId, matchId, matchName);
  return NextResponse.json(intro);
}
