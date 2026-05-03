import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import {
  getTodayDashboardCheckin,
  upsertTodayDashboardCheckin,
  type DashboardCheckinMood,
} from "@/lib/repo";

const ALLOWED_MOODS: DashboardCheckinMood[] = ["drained", "neutral", "open", "energized"];

function isMood(value: unknown): value is DashboardCheckinMood {
  return typeof value === "string" && ALLOWED_MOODS.includes(value as DashboardCheckinMood);
}

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const checkin = await getTodayDashboardCheckin(auth.userId);
  return NextResponse.json({ checkin });
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = (await req.json()) as { mood?: unknown; note?: unknown };
  if (!isMood(body.mood)) {
    return NextResponse.json({ error: "Invalid mood" }, { status: 400 });
  }

  const note = typeof body.note === "string" ? body.note.trim().slice(0, 120) : null;
  const checkin = await upsertTodayDashboardCheckin(auth.userId, body.mood, note);
  return NextResponse.json({ checkin });
}
