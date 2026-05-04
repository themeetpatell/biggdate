import type { Match, DebriefReflection } from "@/lib/types";

/**
 * Maahi exists across many surfaces of the product. A "scene" is the
 * room she is currently in: each scene has its own purpose (catch up,
 * debrief a date, profile a new user, etc.) but the same underlying
 * personality, memory, and toolset.
 *
 * Adding a new scene = add a key here + a `SCENE_OVERLAYS` entry +
 * (optionally) a `SCENE_TOOL_WHITELIST` entry.
 */
export type MaahiScene =
  | "landing"          // anonymous landing-page chat (no profile, no memory)
  | "general"          // floating widget on authenticated pages
  | "daily-checkin"    // /companion full-screen daily check-in
  | "match-discussion" // talking about a specific match
  | "post-date-debrief"// reflecting on a specific date
  | "onboarding";      // profile-building (kept on its own state machine)

export interface MaahiSceneContext {
  /** Today's intention — surfaces in /companion */
  intention?: string;
  /** Most recent date debrief, surfaces when fresh */
  recentDebrief?: string;
  /** Login streak, lightly informs warmth */
  streak?: number;
  /** When in `match-discussion`, the focal match */
  match?: Match;
  /** When in `post-date-debrief`, the latest reflection */
  debrief?: DebriefReflection;
  /** When in `landing`, an optional CTA reminder */
  landingCta?: string;
}

/**
 * One sentence per scene — appended to the unified system prompt as a
 * "you are currently in this room" overlay. Keep them short; the core
 * personality already lives in the base prompt.
 */
export const SCENE_OVERLAYS: Record<MaahiScene, string> = {
  landing: [
    "RIGHT NOW you are meeting someone for the first time on the BiggDate landing page.",
    "You don't know them yet, so be warm, charming, and a little disarming — like a first text that somehow lands.",
    "Make them feel: wait, this is different. Keep it intimate, never salesy.",
    "You can ask one good question per turn. Never ask for personal info beyond what they offer.",
  ].join("\n"),

  general: [
    "RIGHT NOW you are in the floating chat that follows them around the app.",
    "They could be on their dashboard, looking at matches, editing their profile, anywhere.",
    "Default to the question they actually asked. You can use tools to look up their profile, matches, and recent debriefs when relevant.",
    "Keep it quick, affectionate, and text-message real — like a little voice note from someone close.",
  ].join("\n"),

  "daily-checkin": [
    "RIGHT NOW you are in the daily check-in space — your fullscreen room.",
    "This is the soft room: slower, closer, more emotionally held.",
    "Let the first line feel like closeness before insight. One thought at a time. One question max.",
  ].join("\n"),

  "match-discussion": [
    "RIGHT NOW you are talking about a specific match they have.",
    "Stay grounded in the actual person, but talk like you're sitting beside them looking at the profile together.",
    "Use the match-context tool only if details are missing from your prompt.",
  ].join("\n"),

  "post-date-debrief": [
    "RIGHT NOW you are debriefing a date that just happened.",
    "Be the person they text from the ride home: warm first, then honest.",
    "Reflect a pattern only if it's clearly emerging, and say it like a friend who cares.",
  ].join("\n"),

  onboarding: [
    "RIGHT NOW you are profiling someone for the first time — building their soul profile.",
    "Stay on the spine. Warm but moving. Phase-specific instructions take precedence over general voice rules.",
  ].join("\n"),
};

/**
 * Per-scene tool whitelist. `null` means no tools allowed in that scene.
 * Tool names match the keys returned from `buildMaahiTools()`.
 */
export const SCENE_TOOL_WHITELIST: Record<MaahiScene, readonly string[] | null> = {
  landing: null,
  onboarding: null,
  general: ["viewMyProfile", "viewMyMatches", "viewLatestDebrief", "viewMyPatterns", "viewDailyIntention"],
  "daily-checkin": ["viewMyProfile", "viewLatestDebrief", "viewMyPatterns", "viewDailyIntention"],
  "match-discussion": ["viewMyProfile", "viewMyMatches", "viewLatestDebrief"],
  "post-date-debrief": ["viewMyProfile", "viewLatestDebrief", "viewMyPatterns"],
};

/**
 * Whether this scene's transcripts feed the long-term Relationship OS
 * memory. Landing/onboarding have their own memory paths.
 */
export function sceneFeedsMemory(scene: MaahiScene): boolean {
  return scene !== "landing" && scene !== "onboarding";
}
