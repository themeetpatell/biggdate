import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getAccountHandleByUsername, upsertAccountHandle } from "@/lib/repo";
import {
  inferCountryIso2FromPhone,
  normalizeCountryIso2,
} from "@/lib/location-data";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/rate-limit";
import { track } from "@/lib/analytics";
import { isUnderageBirthday, UNDERAGE_ERROR } from "@/lib/age";

export async function POST(req: Request) {
  // 3 signups per IP per hour blocks the most common abuse vector — burst
  // account creation for spam/abuse — without hurting a real user who
  // mistypes once.
  const rl = await checkRateLimit("auth:signup", clientIp(req), {
    limit: 3,
    windowSec: 3600,
  });
  if (!rl.allowed) return rateLimitResponse(rl);

  let body: {
    email?: string;
    password?: string;
    fullName?: string;
    username?: string;
    phone?: string;
    phoneCountryIso2?: string;
    dob?: string;
    termsAccepted?: boolean;
    marketingConsent?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const {
    email,
    password,
    fullName,
    username,
    phone,
    phoneCountryIso2,
    dob,
    termsAccepted,
    marketingConsent,
  } = body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedPassword = typeof password === "string" ? password : "";
  const normalizedFullName = typeof fullName === "string" ? fullName.trim() : "";
  const normalizedUsername = typeof username === "string" ? username.trim().toLowerCase() : "";
  const normalizedPhone =
    typeof phone === "string"
      ? (() => {
          const trimmed = phone.trim();
          if (!trimmed) return "";
          const hasPlus = trimmed.startsWith("+");
          const digits = trimmed.replace(/\D/g, "");
          return hasPlus ? `+${digits}` : digits;
        })()
      : "";
  const normalizedPhoneCountryIso2 =
    normalizeCountryIso2(phoneCountryIso2) ?? inferCountryIso2FromPhone(normalizedPhone);

  // Compliance: DOB + Terms/Privacy acceptance are non-negotiable. Marketing
  // is the only OPTIONAL consent — null when the user did not opt in.
  const normalizedDob = typeof dob === "string" ? dob.trim() : "";
  const hasTermsAccepted = termsAccepted === true;
  const hasMarketingConsent = marketingConsent === true;

  if (!normalizedEmail || !normalizedPassword) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  if (!hasTermsAccepted) {
    return NextResponse.json(
      { error: "You must accept the Terms and Privacy Policy to create an account." },
      { status: 400 },
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDob)) {
    return NextResponse.json(
      { error: "Enter your date of birth in YYYY-MM-DD format." },
      { status: 400 },
    );
  }
  if (isUnderageBirthday(normalizedDob)) {
    return NextResponse.json({ error: UNDERAGE_ERROR }, { status: 400 });
  }
  if (!normalizedFullName) {
    return NextResponse.json({ error: "Full name required" }, { status: 400 });
  }
  // Phone is optional. If provided, validate format.
  if (normalizedPhone && !/^\+?\d{8,15}$/.test(normalizedPhone)) {
    return NextResponse.json(
      { error: "Enter a valid phone number with country code if outside India" },
      { status: 400 }
    );
  }
  if (!normalizedUsername || normalizedUsername.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
  }
  if (!/^[a-z0-9._]+$/.test(normalizedUsername)) {
    return NextResponse.json(
      { error: "Username can only use letters, numbers, periods, and underscores" },
      { status: 400 }
    );
  }
  if (normalizedPassword.length < 10) {
    return NextResponse.json({ error: "Password must be at least 10 characters" }, { status: 400 });
  }

  try {
    const existingHandle = await getAccountHandleByUsername(normalizedUsername);
    if (existingHandle) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  } catch {
    // DB unreachable — skip username uniqueness check; the upsert will catch duplicates later
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: normalizedPassword,
    options: {
      data: {
        full_name: normalizedFullName,
        username: normalizedUsername,
        phone_number: normalizedPhone,
        phone_country_iso2: normalizedPhoneCountryIso2,
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    const alreadyExists =
      message.includes("already") ||
      message.includes("registered") ||
      message.includes("exists");
    return NextResponse.json(
      { error: alreadyExists ? "Email already registered" : error.message },
      { status: alreadyExists ? 409 : 400 }
    );
  }
  if (!data.user) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }

  if ((data.user.identities?.length ?? 0) === 0) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const consentTimestamp = new Date();

  try {
    await upsertAccountHandle({
      userId: data.user.id,
      email: normalizedEmail,
      username: normalizedUsername,
      fullName: normalizedFullName,
      phoneNumber: normalizedPhone,
      dob: normalizedDob,
      dobVerifiedAt: consentTimestamp,
      termsAcceptedAt: consentTimestamp,
      marketingConsentAt: hasMarketingConsent ? consentTimestamp : null,
    });
  } catch (handleError) {
    const message =
      handleError instanceof Error ? handleError.message.toLowerCase() : "";
    return NextResponse.json(
      {
        error: message.includes("username")
          ? "Username already taken"
          : "We created the account, but could not save your username. Try logging in with email once, then retry.",
      },
      { status: 409 }
    );
  }

  // Funnel event. Emit before returning so the analytics row lands even if
  // the client navigates away during the response.
  await track({
    name: "signup",
    userId: data.user.id,
    properties: {
      phoneCountry: normalizedPhoneCountryIso2 ?? null,
      requiresConfirmation: !data.session,
    },
  });

  if (!data.session) {
    return NextResponse.json(
      {
        id: data.user.id,
        email: data.user.email,
        status: "pending_confirmation",
        message: "Check your inbox to confirm your email, then log in.",
      },
      { status: 201 }
    );
  }

  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    status: "authenticated",
  });
}
