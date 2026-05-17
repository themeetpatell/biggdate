import {
  Camera,
  Eye,
  Heart,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import type { Profile, ProfilePrompt } from "@/lib/types";

// Shared constants for the profile editor and view surfaces.
export const MAX_PHOTOS = 6;
export const PROFILE_PHOTO_BUCKET = "profile-photos";

export const DEFAULT_PROMPT_QUESTIONS = [
  "A green flag I never ignore",
  "The life I'm building next",
  "By date three, you should know",
];

export const DIMENSIONS = [
  { id: "D1", label: "Emotional Intelligence", weight: 20, color: "#d4688a" },
  { id: "D2", label: "Values & Beliefs", weight: 18, color: "#4FFFB0" },
  { id: "D3", label: "Intellectual Depth", weight: 14, color: "#B48CFF" },
  { id: "D4", label: "Relational Patterns", weight: 13, color: "#44c8ff" },
  { id: "D5", label: "Life Architecture", weight: 12, color: "#f5c842" },
  { id: "D6", label: "Family & Future", weight: 11, color: "#ff936d" },
  { id: "D7", label: "Stability", weight: 8, color: "#9bff8c" },
  { id: "D8", label: "Lifestyle", weight: 7, color: "#7fb4ff" },
  { id: "D9", label: "Meaning", weight: 5, color: "#f58bc2" },
  { id: "D10", label: "Astrology", weight: 2, color: "#ffcf5a" },
];

export type HydratedProfile = Profile & {
  languages: string[];
  interests: string[];
  pets: string[];
  prompts: ProfilePrompt[];
  offers: string[];
  needs: string[];
  profileVisibility: "visible" | "paused" | "hidden";
  showAge: boolean;
  showCity: boolean;
  showWork: boolean;
  showEducation: boolean;
  attractionPreferences: string[];
  turnOns: string[];
  turnOffs: string[];
  loveLanguageGive: string[];
  loveLanguageReceive: string[];
};

export type EditorTab = "basics" | "about" | "dating" | "lifestyle" | "gallery" | "visibility";
export type ProfileViewTab = "profile" | "dating" | "lifestyle" | "insights";

export const EDITOR_TABS: Array<{
  key: EditorTab;
  label: string;
  title: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    key: "basics",
    label: "Basics",
    title: "Identity, work, and profile vitals",
    description: "Enough signal to feel intentional, not witness protection.",
    icon: UserRound,
  },
  {
    key: "about",
    label: "About",
    title: "Story, interests, and prompt cards",
    description: "Give them something better than 'just ask'.",
    icon: Sparkles,
  },
  {
    key: "dating",
    label: "Dating",
    title: "Intentions, values, and partner preferences",
    description: "Clarity beats vibes-only chaos.",
    icon: Heart,
  },
  {
    key: "lifestyle",
    label: "Lifestyle",
    title: "Habits, growth, and day-to-day compatibility",
    description: "Tuesday compatibility matters more than Friday chemistry.",
    icon: Star,
  },
  {
    key: "gallery",
    label: "Gallery",
    title: "Profile photo and gallery",
    description: "Profile photo is your avatar. Gallery photos show on your profile.",
    icon: Camera,
  },
  {
    key: "visibility",
    label: "Visibility",
    title: "Discovery mode and field-level privacy",
    description: "Private where it counts, visible where it helps.",
    icon: Eye,
  },
];

export const PROFILE_VIEW_TABS: Array<{
  key: ProfileViewTab;
  label: string;
}> = [
  { key: "profile", label: "About me" },
  { key: "dating", label: "Looking For" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "insights", label: "Soulmap" },
];

export function compactStrings(values: string[] | undefined | null) {
  return (values || []).map((value) => value.trim()).filter(Boolean);
}

export function sanitizePrompts(prompts: ProfilePrompt[] | undefined | null) {
  return (prompts || [])
    .map((prompt) => ({
      question: prompt.question.trim(),
      answer: prompt.answer.trim(),
    }))
    .filter((prompt) => prompt.question || prompt.answer);
}

export function hydrateProfile(profile: Profile): HydratedProfile {
  return {
    ...profile,
    languages: compactStrings(profile.languages),
    interests: compactStrings(profile.interests),
    pets: compactStrings(profile.pets),
    prompts: sanitizePrompts(profile.prompts),
    offers: compactStrings(profile.offers),
    needs: compactStrings(profile.needs),
    photos: compactStrings(profile.photos),
    dealbreakers: compactStrings(profile.dealbreakers),
    strengths: compactStrings(profile.strengths),
    growthAreas: compactStrings(profile.growthAreas),
    coreValues: compactStrings(profile.coreValues),
    profileVisibility:
      profile.profileVisibility === "paused" || profile.profileVisibility === "hidden"
        ? profile.profileVisibility
        : "visible",
    showAge: profile.showAge ?? true,
    showCity: profile.showCity ?? true,
    showWork: profile.showWork ?? true,
    showEducation: profile.showEducation ?? true,
    attractionPreferences: compactStrings(profile.attractionPreferences),
    turnOns: compactStrings(profile.turnOns),
    turnOffs: compactStrings(profile.turnOffs),
    loveLanguageGive: compactStrings(profile.loveLanguageGive),
    loveLanguageReceive: compactStrings(profile.loveLanguageReceive),
  };
}

export function createEditorDraft(profile: Profile): HydratedProfile {
  const hydrated = hydrateProfile(profile);
  const prompts = Array.from({ length: 3 }, (_, index) => ({
    question:
      hydrated.prompts[index]?.question ||
      DEFAULT_PROMPT_QUESTIONS[index] ||
      `Prompt ${index + 1}`,
    answer: hydrated.prompts[index]?.answer || "",
  }));
  const photos = Array.from({ length: MAX_PHOTOS }, (_, index) => hydrated.photos[index] || "");
  return { ...hydrated, prompts, photos };
}

export function buildProfilePayload(profile: HydratedProfile): Partial<Profile> {
  return {
    ...profile,
    name: profile.name.trim(),
    city: profile.city.trim(),
    pronouns: profile.pronouns?.trim() || null,
    hometown: profile.hometown?.trim() || null,
    gender: profile.gender?.trim() || null,
    orientation: profile.orientation?.trim() || null,
    jobTitle: profile.jobTitle?.trim() || null,
    company: profile.company?.trim() || null,
    education: profile.education?.trim() || null,
    height: profile.height?.trim() || null,
    religion: profile.religion?.trim() || null,
    politics: profile.politics?.trim() || null,
    ethnicity: profile.ethnicity?.trim() || null,
    partnerGender: profile.partnerGender?.trim() || null,
    relationshipStyle: profile.relationshipStyle?.trim() || null,
    loveLanguage: profile.loveLanguage?.trim() || null,
    sleepSchedule: profile.sleepSchedule?.trim() || null,
    socialBattery: profile.socialBattery?.trim() || null,
    diet: profile.diet?.trim() || null,
    weekendStyle: profile.weekendStyle?.trim() || null,
    travelStyle: profile.travelStyle?.trim() || null,
    cleanliness: profile.cleanliness?.trim() || null,
    summary: profile.summary.trim(),
    coachingFocus: profile.coachingFocus.trim(),
    conflictStyle: profile.conflictStyle.trim(),
    familyExpectations: profile.familyExpectations.trim(),
    lifeArchitecture: profile.lifeArchitecture.trim(),
    languages: compactStrings(profile.languages),
    interests: compactStrings(profile.interests),
    pets: compactStrings(profile.pets),
    dealbreakers: compactStrings(profile.dealbreakers),
    strengths: compactStrings(profile.strengths),
    growthAreas: compactStrings(profile.growthAreas),
    coreValues: compactStrings(profile.coreValues),
    photos: compactStrings(profile.photos),
    prompts: sanitizePrompts(profile.prompts),
    offers: compactStrings(profile.offers),
    needs: compactStrings(profile.needs),
    attractionPreferences: compactStrings(profile.attractionPreferences),
    turnOns: compactStrings(profile.turnOns),
    turnOffs: compactStrings(profile.turnOffs),
    loveLanguageGive: compactStrings(profile.loveLanguageGive),
    loveLanguageReceive: compactStrings(profile.loveLanguageReceive),
  };
}

export function parseListInput(value: string) {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function formatIntent(intent: Profile["intent"]) {
  if (intent === "serious") return "Long-term relationship";
  if (intent === "marriage") return "Marriage-minded";
  if (intent === "casual") return "Something casual";
  if (intent === "exploring") return "Still exploring";
  return "Add relationship intention";
}

export function formatWantsKids(value: Profile["wantsKids"]) {
  if (value === "yes") return "Wants kids";
  if (value === "no") return "Doesn't want kids";
  if (value === "open") return "Open to kids";
  return "Not set";
}

export function formatHasKids(value: boolean | null) {
  if (value === true) return "Has kids";
  if (value === false) return "No kids";
  return "Not set";
}

export function formatVisibility(value: HydratedProfile["profileVisibility"]) {
  if (value === "paused") return "Paused in discovery";
  if (value === "hidden") return "Private profile";
  return "Visible in discovery";
}

export function joinLifestyle(values: Array<string | null | undefined>, fallback: string) {
  const items = values.map((value) => (value || "").trim()).filter(Boolean);
  return items.length > 0 ? items.join(" · ") : fallback;
}

export function getCompletion(profile: HydratedProfile) {
  const checks = [
    { label: "3+ photos", complete: profile.photos.length >= 3 },
    { label: "About section", complete: Boolean(profile.summary) },
    { label: "Intentions", complete: Boolean(profile.intent || profile.relationshipTimeline) },
    { label: "Work or school", complete: Boolean(profile.jobTitle || profile.education) },
    { label: "Lifestyle habits", complete: Boolean(profile.exercise || profile.drinking || profile.smoking) },
    { label: "Interests", complete: profile.interests.length >= 3 },
    { label: "Prompt cards", complete: profile.prompts.filter((p) => p.answer).length >= 2 },
    { label: "Love language", complete: profile.loveLanguageGive.length > 0 || profile.loveLanguageReceive.length > 0 },
    { label: "Chemistry layer", complete: profile.attractionPreferences.length > 0 },
    { label: "Emotional availability", complete: Boolean(profile.emotionalAvailability) },
    { label: "Visibility set", complete: Boolean(profile.profileVisibility) },
  ];
  const completeCount = checks.filter((check) => check.complete).length;
  return {
    percent: Math.round((completeCount / checks.length) * 100),
    missing: checks.filter((check) => !check.complete).map((check) => check.label),
  };
}

export function deriveDimensionScores(profile: HydratedProfile): number[] {
  // D1: Emotional Intelligence — attachment style + emotional availability
  const baseAttach = profile.attachment === "Secure" ? 88 : profile.attachment === "Anxious" ? 65 : profile.attachment === "Avoidant" ? 58 : 52;
  const availBonus = profile.emotionalAvailability === "Fully available" ? 6 : profile.emotionalAvailability === "Mostly available" ? 3 : 0;
  const d1 = Math.min(96, baseAttach + availBonus);

  // D2: Values & Beliefs — core values + cultural alignment
  const d2 = Math.min(96, 52 + profile.coreValues.length * 9 + (profile.culturalAlignment ? 4 : 0));

  // D3: Intellectual Depth — prompts + summary + attraction signals
  const intellectualAttr = profile.attractionPreferences.includes("Intellectual stimulation") ? 6 : 0;
  const d3 = Math.min(96, (profile.prompts.filter((p) => p.answer).length >= 2 ? 84 : profile.summary.length > 110 ? 73 : 60) + intellectualAttr);

  // D4: Relational Patterns — love language (give + receive) + conflict style
  const hasLL = profile.loveLanguageGive.length > 0 || profile.loveLanguageReceive.length > 0 || Boolean(profile.loveLanguage);
  const d4 = Math.min(92, (hasLL ? 80 : 62) + (profile.conflictStyle ? 6 : 0));

  // D5: Life Architecture — life arch text + relationship timeline + dating stage
  const d5 = Math.min(96, (profile.lifeArchitecture ? 82 : 64) + (profile.relationshipTimeline ? 8 : 0) + (profile.datingStage ? 4 : 0));

  // D6: Family & Future — family expectations + wants kids + family involvement + marriage type
  const d6 = Math.min(96, (profile.familyExpectations ? 82 : profile.wantsKids ? 72 : 58) + (profile.familyInvolvement ? 5 : 0) + (profile.marriageType ? 5 : 0));

  // D7: Stability — intent + work intensity + residency status
  const d7 = Math.min(96, (profile.intent === "serious" || profile.intent === "marriage" ? 82 : 68) + (profile.workIntensity ? 5 : 0) + (profile.residencyStatus ? 4 : 0));

  // D8: Lifestyle — exercise + drinking
  const activity = profile.exercise === "often" ? 90 : profile.exercise === "sometimes" ? 72 : 48;
  const habits = profile.drinking === "never" ? 88 : profile.drinking === "social" ? 74 : 56;
  const d8 = Math.round((activity + habits) / 2);

  // D9: Meaning — readiness score + depth fields filled
  const depthFilled = [profile.summary, profile.conflictStyle, profile.lifeArchitecture, profile.familyExpectations, profile.emotionalAvailability, profile.relationshipTimeline].filter(Boolean).length;
  const d9 = Math.min(96, Math.round(48 + profile.readinessScore * 0.38 + depthFilled * 1.5));

  // D10: Astrology
  const d10 = profile.zodiac ? 76 : 54;

  return [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10];
}
