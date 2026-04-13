import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { blockUser, createReport, invalidateMatchCache } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { reportedId, reason, extraNotes }: { reportedId: string; reason: string; extraNotes?: string } =
    await req.json();

  if (!reportedId || !reason) {
    return NextResponse.json({ error: "reportedId and reason required" }, { status: 400 });
  }

  // Block fires immediately; report goes to admin queue
  await Promise.all([
    blockUser(auth.userId, reportedId),
    createReport(auth.userId, reportedId, reason, extraNotes),
    invalidateMatchCache(auth.userId),
  ]);

  return NextResponse.json({ success: true });
}
