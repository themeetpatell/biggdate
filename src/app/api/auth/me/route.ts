import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { inferCountryIso2FromPhone } from "@/lib/location-data";
import { getAccountHandleByUserId, getProfileByUserId } from "@/lib/repo";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      {
        authenticated: false,
        userId: null,
        email: null,
        phoneCountryIso2: null,
        hasProfile: false,
        profile: null,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const profile = await getProfileByUserId(session.userId);
  const accountHandle = await getAccountHandleByUserId(session.userId);
  const phoneCountryIso2 =
    session.phoneCountryIso2 ?? inferCountryIso2FromPhone(accountHandle?.phoneNumber ?? null);

  return NextResponse.json(
    {
      authenticated: true,
      userId: session.userId,
      email: session.email,
      phoneCountryIso2,
      hasProfile: !!profile,
      profile,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
