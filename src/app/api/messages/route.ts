import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getThreadsForUser } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const threads = await getThreadsForUser(auth.userId);
  return NextResponse.json({ threads });
}
