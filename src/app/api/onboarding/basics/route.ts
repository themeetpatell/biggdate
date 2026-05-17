import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import type { Profile } from "@/lib/types";
import { upsertProfile, getProfileByUserId, getAccountHandleByUserId } from "@/lib/repo";
import { trackFirst } from "@/lib/analytics";
import { getZodiacFromBirthday, computeAgeFromBirthday } from "@/lib/zodiac";
import { isUnderageBirthday, UNDERAGE_ERROR } from "@/lib/age";

// Tap-first basics intake. Replaces the AI-driven Phase 1 onboarding chat
// for users who go through /onboarding/basics. Saves directly to `profiles`
// with no AI hop — cheaper, faster, and not dependent on Gemini/OpenAI
// being up.
//
// Once these five facts are saved, the /onboarding chat detects the state
// and starts at Phase 2 (psychological), skipping the eight basics
// questions the chat would otherwise ask.

// Keys mirror the GENDER_CANON map in src/lib/repo.ts. Anything outside this
// set is rejected at the boundary so the column never receives junk that
// would silently degrade match filtering.
const GENDER_VALUES = new Set([
  "man", "woman", "non-binary", "non binary", "nonbinary",
  "genderqueer", "genderfluid", "trans man", "trans woman", "agender",
]);
// "everyone" maps to no-filter inside normalizePartnerGender; the rest mirror
// GENDER_VALUES so partner preference matches what we accept for self-ID.
const PARTNER_GENDER_VALUES = new Set([
  ...GENDER_VALUES,
  "everyone",
]);
// Values mirror the Profile.intent union in src/lib/types.ts.
const INTENT_VALUES = new Set([
  "casual", "serious", "marriage", "exploring",
]);

type Body = {
  birthday?: unknown;
  gender?: unknown;
  partnerGender?: unknown;
  city?: unknown;
  intent?: unknown;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const birthday = str(body.birthday);
  const gender = str(body.gender).toLowerCase();
  const partnerGender = str(body.partnerGender).toLowerCase();
  const city = str(body.city);
  const intent = str(body.intent).toLowerCase();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    return NextResponse.json({ error: "Enter a valid date of birth." }, { status: 400 });
  }
  if (isUnderageBirthday(birthday)) {
    return NextResponse.json({ error: UNDERAGE_ERROR }, { status: 403 });
  }
  if (!GENDER_VALUES.has(gender)) {
    return NextResponse.json({ error: "Pick how you identify." }, { status: 400 });
  }
  if (!PARTNER_GENDER_VALUES.has(partnerGender)) {
    return NextResponse.json({ error: "Pick who you'd like to meet." }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ error: "Add your city." }, { status: 400 });
  }
  if (!INTENT_VALUES.has(intent)) {
    return NextResponse.json({ error: "Pick what you're here for." }, { status: 400 });
  }

  // Pull the auth row so we never overwrite an existing display name.
  const handle = await getAccountHandleByUserId(auth.userId);
  const fullName = handle?.fullName?.trim() || "";

  try {
    await upsertProfile(auth.userId, {
      name: fullName || undefined,
      birthday,
      age: computeAgeFromBirthday(birthday),
      zodiac: getZodiacFromBirthday(birthday),
      gender,
      partnerGender,
      city,
      // Narrowed via the INTENT_VALUES.has(intent) check above.
      intent: intent as Profile["intent"],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB upsert failed";
    return NextResponse.json(
      { error: `Failed to save basics: ${message}` },
      { status: 500 },
    );
  }

  await trackFirst({ name: "onboarding_phase1_complete", userId: auth.userId });

  const fullProfile = await getProfileByUserId(auth.userId);
  return NextResponse.json(fullProfile);
}
