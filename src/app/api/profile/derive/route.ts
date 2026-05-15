import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import {
  profileDeriveBasicPrompt,
  profileDerivePsychologicalPrompt,
} from "@/lib/prompts";
import { getZodiacFromBirthday } from "@/lib/zodiac";
import { requireAuth } from "@/lib/require-auth";
import {
  upsertProfile,
  getProfileByUserId,
  getAccountHandleByUserId,
} from "@/lib/repo";
import { trackFirst } from "@/lib/analytics";
import { logAiCall } from "@/lib/ai-costs";

export const maxDuration = 60;

type Phase = "basic" | "psychological";

function extractFirstJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
}

function parseJsonOrThrow(text: string): Record<string, unknown> {
  const cleaned = extractFirstJson(text);
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const message = err instanceof Error ? err.message : "JSON parse error";
    throw new Error(`Model returned malformed JSON: ${message}. Raw start: ${cleaned.slice(0, 240)}`);
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const url = new URL(req.url);
  const phase = (url.searchParams.get("phase") as Phase) || "psychological";

  const { transcript }: { transcript: string } = await req.json();
  if (!transcript) {
    return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
  }

  if (phase !== "basic" && phase !== "psychological") {
    return NextResponse.json(
      { error: `Invalid phase '${phase}'. Expected 'basic' or 'psychological'.` },
      { status: 400 },
    );
  }

  // Pull the user's account name so we never fabricate a different one
  const accountHandle = await getAccountHandleByUserId(auth.userId);
  const fullName = accountHandle?.fullName?.trim() || "";

  const prompt =
    phase === "basic"
      ? profileDeriveBasicPrompt(transcript, fullName)
      : profileDerivePsychologicalPrompt(transcript, fullName);

  let modelText: string;
  const aiStart = Date.now();
  try {
    const result = await generateText({
      model: getModel(),
      prompt,
    });
    modelText = result.text || "";
    await logAiCall({
      route: `profile/derive:${phase}`,
      userId: auth.userId,
      usage: result.usage,
      durationMs: Date.now() - aiStart,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown model error";
    await logAiCall({
      route: `profile/derive:${phase}`,
      userId: auth.userId,
      durationMs: Date.now() - aiStart,
      error: message,
    });
    return NextResponse.json(
      { error: `Model call failed: ${message}` },
      { status: 502 },
    );
  }

  let derived: Record<string, unknown>;
  try {
    derived = parseJsonOrThrow(modelText);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Parse error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Phase-specific normalization
  if (phase === "basic") {
    if (derived.birthday && !derived.zodiac) {
      derived.zodiac = getZodiacFromBirthday(derived.birthday as string);
    }
    if (fullName && (!derived.name || typeof derived.name !== "string")) {
      derived.name = fullName;
    }
  } else {
    derived.growthAreas = derived.growthAreas || [];
    derived.strengths = derived.strengths || [];
    derived.coreValues = derived.coreValues || [];
    derived.dealbreakers = derived.dealbreakers || [];
    derived.offers = derived.offers || [];
    derived.needs = derived.needs || [];
    derived.loveLanguageGive = derived.loveLanguageGive || [];
    derived.loveLanguageReceive = derived.loveLanguageReceive || [];
    derived.prompts = derived.prompts || [];
  }

  // Save partial profile to DB (upsert handles missing fields gracefully)
  try {
    await upsertProfile(auth.userId, derived);
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB upsert failed";
    return NextResponse.json(
      { error: `Failed to save profile: ${message}` },
      { status: 500 },
    );
  }

  // Return the full merged profile so the client has everything it needs
  const fullProfile = await getProfileByUserId(auth.userId);
  if (!fullProfile) {
    return NextResponse.json(
      { error: "Profile saved but could not be re-fetched" },
      { status: 500 },
    );
  }

  // Onboarding milestone — emitted at most once per user per phase.
  await trackFirst({
    name: phase === "basic" ? "onboarding_phase1_complete" : "onboarding_phase2_complete",
    userId: auth.userId,
  });

  return NextResponse.json(fullProfile);
}
