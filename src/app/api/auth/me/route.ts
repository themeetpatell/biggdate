import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getProfileByUserId } from "@/lib/repo";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const profile = await getProfileByUserId(session.userId);

  return NextResponse.json(
    {
      userId: session.userId,
      hasProfile: !!profile,
      profile,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
