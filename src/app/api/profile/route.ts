import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, upsertProfile } from "@/lib/repo";
import type { Profile, ProfilePrompt } from "@/lib/types";

function compactStrings(value: unknown, max = 12) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean)
    .slice(0, max);
}

function compactPrompts(value: unknown): ProfilePrompt[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const question = typeof entry.question === "string" ? entry.question.trim() : "";
      const answer = typeof entry.answer === "string" ? entry.answer.trim() : "";
      if (!question && !answer) return null;
      return { question, answer };
    })
    .filter((entry): entry is ProfilePrompt => Boolean(entry))
    .slice(0, 3);
}

function trimOptional(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function parseBoolean(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function parseNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizePatch(body: Partial<Profile>): Partial<Profile> {
  return {
    ...body,
    name: typeof body.name === "string" ? body.name.trim() : body.name,
    city: typeof body.city === "string" ? body.city.trim() : body.city,
    birthday: trimOptional(body.birthday),
    zodiac: trimOptional(body.zodiac),
    gender: trimOptional(body.gender),
    orientation: trimOptional(body.orientation),
    pronouns: trimOptional(body.pronouns),
    hometown: trimOptional(body.hometown),
    jobTitle: trimOptional(body.jobTitle),
    company: trimOptional(body.company),
    education: trimOptional(body.education),
    height: trimOptional(body.height),
    religion: trimOptional(body.religion),
    politics: trimOptional(body.politics),
    ethnicity: trimOptional(body.ethnicity),
    partnerGender: trimOptional(body.partnerGender),
    intent: body.intent ?? null,
    relationshipStyle: trimOptional(body.relationshipStyle),
    wantsKids: body.wantsKids ?? null,
    loveLanguage: trimOptional(body.loveLanguage),
    drinking: body.drinking ?? null,
    smoking: body.smoking ?? null,
    exercise: body.exercise ?? null,
    sleepSchedule: trimOptional(body.sleepSchedule),
    socialBattery: trimOptional(body.socialBattery),
    diet: trimOptional(body.diet),
    weekendStyle: trimOptional(body.weekendStyle),
    travelStyle: trimOptional(body.travelStyle),
    cleanliness: trimOptional(body.cleanliness),
    summary: typeof body.summary === "string" ? body.summary.trim() : body.summary,
    coachingFocus:
      typeof body.coachingFocus === "string" ? body.coachingFocus.trim() : body.coachingFocus,
    conflictStyle:
      typeof body.conflictStyle === "string" ? body.conflictStyle.trim() : body.conflictStyle,
    familyExpectations:
      typeof body.familyExpectations === "string"
        ? body.familyExpectations.trim()
        : body.familyExpectations,
    lifeArchitecture:
      typeof body.lifeArchitecture === "string" ? body.lifeArchitecture.trim() : body.lifeArchitecture,
    age: parseNullableNumber(body.age),
    partnerAgeMin: parseNullableNumber(body.partnerAgeMin),
    partnerAgeMax: parseNullableNumber(body.partnerAgeMax),
    languages: compactStrings(body.languages, 10),
    interests: compactStrings(body.interests, 14),
    pets: compactStrings(body.pets, 6),
    dealbreakers: compactStrings(body.dealbreakers, 12),
    growthAreas: compactStrings(body.growthAreas, 6),
    strengths: compactStrings(body.strengths, 8),
    coreValues: compactStrings(body.coreValues, 8),
    offers: compactStrings(body.offers, 4),
    needs: compactStrings(body.needs, 4),
    photos: compactStrings(body.photos, 6),
    prompts: compactPrompts(body.prompts),
    profileVisibility:
      body.profileVisibility === "paused" || body.profileVisibility === "hidden"
        ? body.profileVisibility
        : "visible",
    showAge: parseBoolean(body.showAge, true),
    showCity: parseBoolean(body.showCity, true),
    showWork: parseBoolean(body.showWork, true),
    showEducation: parseBoolean(body.showEducation, true),
    hasKids: typeof body.hasKids === "boolean" ? body.hasKids : body.hasKids ?? null,
    // Enrichment v2
    attractionPreferences: compactStrings(body.attractionPreferences, 8),
    turnOns: compactStrings(body.turnOns, 10),
    turnOffs: compactStrings(body.turnOffs, 10),
    relationshipTimeline: trimOptional(body.relationshipTimeline),
    datingStage: trimOptional(body.datingStage),
    longDistanceOpen: trimOptional(body.longDistanceOpen),
    emotionalAvailability: trimOptional(body.emotionalAvailability),
    residencyStatus: trimOptional(body.residencyStatus),
    relocationOpen: trimOptional(body.relocationOpen),
    workIntensity: trimOptional(body.workIntensity),
    familyInvolvement: trimOptional(body.familyInvolvement),
    culturalAlignment: trimOptional(body.culturalAlignment),
    marriageType: trimOptional(body.marriageType),
    loveLanguageGive: compactStrings(body.loveLanguageGive, 5),
    loveLanguageReceive: compactStrings(body.loveLanguageReceive, 5),
    linkedinUrl: trimOptional(body.linkedinUrl),
    websiteUrl: trimOptional(body.websiteUrl),
  };
}

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const profile = await getProfileByUserId(auth.userId);
  return NextResponse.json({ profile });
}

export async function PATCH(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = (await req.json()) as Partial<Profile>;
  const patch = normalizePatch(body);

  await upsertProfile(auth.userId, patch);
  const profile = await getProfileByUserId(auth.userId);

  return NextResponse.json({ profile });
}
