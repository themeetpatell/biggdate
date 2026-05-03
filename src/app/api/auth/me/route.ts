import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { inferCountryIso2FromPhone } from "@/lib/location-data";
import { getAccountHandleByUserId, getProfileByUserId } from "@/lib/repo";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const profile = await getProfileByUserId(session.userId);
  const accountHandle = await getAccountHandleByUserId(session.userId);
  const phoneCountryIso2 =
    session.phoneCountryIso2 ?? inferCountryIso2FromPhone(accountHandle?.phoneNumber ?? null);

  return NextResponse.json(
    {
      userId: session.userId,
      email: session.email,
      phoneCountryIso2,
      hasProfile: !!profile,
      profile,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
