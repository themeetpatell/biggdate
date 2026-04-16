import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getTodayPulsePrompt } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const prompt = await getTodayPulsePrompt();
  return NextResponse.json({ prompt });
}
