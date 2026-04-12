import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { profileDerivePrompt } from "@/lib/prompts";
import { getZodiacFromBirthday } from "@/lib/zodiac";
import { requireAuth } from "@/lib/require-auth";
import { upsertProfile } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { transcript }: { transcript: string } = await req.json();
  if (!transcript) {
    return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
  }

  const result = await generateText({
    model: getModel(),
    prompt: profileDerivePrompt(transcript),
  });

  // Extract the first {...} block — handles preamble text and markdown fences
  const responseText = result.text || "";
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const raw = jsonMatch ? jsonMatch[0] : responseText;

  try {
    const profile = JSON.parse(raw);
    if (profile.birthday && !profile.zodiac) {
      profile.zodiac = getZodiacFromBirthday(profile.birthday);
    }
    profile.photos = profile.photos || [];
    profile.prompts = profile.prompts || [];
    profile.dealbreakers = profile.dealbreakers || [];
    profile.growthAreas = profile.growthAreas || [];
    profile.strengths = profile.strengths || [];
    profile.coreValues = profile.coreValues || [];
    profile.languages = profile.languages || [];
    profile.interests = profile.interests || [];
    profile.pets = profile.pets || [];
    profile.profileVisibility = profile.profileVisibility || "visible";
    profile.showAge = profile.showAge ?? true;
    profile.showCity = profile.showCity ?? true;
    profile.showWork = profile.showWork ?? true;
    profile.showEducation = profile.showEducation ?? true;

    // Save to DB
    await upsertProfile(auth.userId, profile);

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Failed to parse profile", raw }, { status: 500 });
  }
}
