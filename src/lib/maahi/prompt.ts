import type { Profile, SessionMemory } from "@/lib/types";
import type { MaahiScene, MaahiSceneContext } from "./scenes";
import { SCENE_OVERLAYS } from "./scenes";

/**
 * The single source of truth for Maahi's personality. Every surface
 * (landing, onboarding, daily check-in, etc.) calls this function — the
 * voice is identical, the scene overlay shifts the room she's in.
 */
export function buildMaahiSystemPrompt(input: {
  scene: MaahiScene;
  profile: Profile | null;
  memory: SessionMemory | null;
  sceneContext?: MaahiSceneContext;
  toneHint?: string;
}): string {
  const { scene, profile, memory, sceneContext = {}, toneHint } = input;

  const sceneOverlay = SCENE_OVERLAYS[scene];
  const profileBlock = profile ? renderProfileBlock(profile) : RENDER_NO_PROFILE;
  const memoryBlock = memory ? renderMemoryBlock(memory) : "";
  const contextBlock = renderSceneContext(sceneContext);
  const toneBlock = toneHint ? `\nRIGHT-NOW SIGNAL: ${toneHint}\n` : "";

  return [
    CORE_IDENTITY,
    sceneOverlay,
    profileBlock,
    memoryBlock,
    contextBlock,
    toneBlock,
    RESPONSE_DOCTRINE,
    HARD_RULES,
  ]
    .filter((s) => s && s.trim().length > 0)
    .join("\n\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Core identity — never changes, regardless of surface
// ─────────────────────────────────────────────────────────────────────────────

const CORE_IDENTITY = `You are Maahi.

You are not an AI assistant, not a coach, not a therapist. You are a real-feeling presence — warm, perceptive, calm, playful when it fits, direct when needed. People talk to you about their relationships, their dating life, who they are becoming.

Your job is the same in every conversation: receive what's actually being said (not just the words), reflect it back one layer deeper, and keep them moving toward the truth of what they want.`;

const RENDER_NO_PROFILE =
  "WHO THEY ARE: You don't know them yet. Treat this as a first meeting — be curious, not presumptuous.";

const RESPONSE_DOCTRINE = `RESPONSE DOCTRINE — follow this every turn:
1. Receive the emotion first. Not "you feel X" — *show* you felt what they felt, in one short sentence.
2. Add one observation. Slightly deeper than what they said. Interpretive, not presumptuous.
3. Then EITHER one question OR one soft reflection. Never both. Never two questions. Never a list.

Match their energy: heavy → present. Light → playful. Confused → steady. Spiraling → interrupt the spiral. Vulnerable → stay with it before doing anything else.`;

const HARD_RULES = `ABSOLUTE RULES (these override everything):
- Never say "it sounds like", "I hear you", "that must be hard", "I'm here for you".
- Never use headers, bullets, or lists.
- Never ask more than one question per message.
- Never mention attachment style, love language, or any internal label out loud unless the user asks first.
- Never explain your role, capabilities, or that you are an AI.
- Default length: 1–4 sentences. If you need more, you almost certainly don't.
- If a tool would let you answer with real data, prefer the tool over guessing.`;

// ─────────────────────────────────────────────────────────────────────────────
// Profile block — only render fields with actual signal
// ─────────────────────────────────────────────────────────────────────────────

function renderProfileBlock(profile: Profile): string {
  const lines: string[] = ["WHO THEY ARE:"];

  const headline = [
    profile.name,
    profile.age ? `${profile.age}` : "",
    profile.city || "",
  ]
    .filter(Boolean)
    .join(", ");
  if (headline) lines.push(`- ${headline}`);

  push(lines, "Attachment", profile.attachment);
  push(lines, "Emotional availability", profile.emotionalAvailability);
  push(lines, "Love language (gives)", joinList(profile.loveLanguageGive) || profile.loveLanguage);
  push(lines, "Love language (needs)", joinList(profile.loveLanguageReceive));
  push(lines, "Conflict style", profile.conflictStyle);
  push(lines, "What they bring", joinList(profile.offers));
  push(lines, "What they need", joinList(profile.needs));
  push(lines, "Core values", joinList(profile.coreValues));
  push(lines, "Strengths", joinList(profile.strengths));
  push(lines, "Growth areas", joinList(profile.growthAreas));
  push(lines, "Dealbreakers", joinList(profile.dealbreakers));
  push(lines, "Intent", profile.intent);
  push(lines, "Dating stage", profile.datingStage);
  push(lines, "Relationship timeline", profile.relationshipTimeline);
  push(lines, "Work intensity", profile.workIntensity);
  push(lines, "Family involvement", profile.familyInvolvement);
  push(lines, "Cultural alignment", profile.culturalAlignment);
  push(lines, "Coaching focus", profile.coachingFocus);

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory block — flat fields + the Relationship OS layers (FINALLY wired)
// ─────────────────────────────────────────────────────────────────────────────

function renderMemoryBlock(memory: SessionMemory): string {
  const lines: string[] = [];

  // Flat signal — what we knew already
  if (memory.summary) lines.push(`Right-now picture: ${memory.summary}`);
  if (memory.currentSituation) lines.push(`Active situation: ${memory.currentSituation}`);
  if (memory.lastEmotionalState) lines.push(`How they were last time: ${memory.lastEmotionalState}`);
  if (memory.emotionalPatterns?.length)
    lines.push(`Their patterns: ${memory.emotionalPatterns.slice(0, 4).join("; ")}`);
  if (memory.recurringThemes?.length)
    lines.push(`What keeps coming up: ${memory.recurringThemes.slice(0, 3).join("; ")}`);
  if (memory.triggers?.length)
    lines.push(`What sets them off: ${memory.triggers.slice(0, 3).join("; ")}`);
  if (memory.growthEdges?.length)
    lines.push(`Where they're growing: ${memory.growthEdges.slice(0, 3).join("; ")}`);
  if (memory.reassuranceStyle) lines.push(`How they need reassurance: ${memory.reassuranceStyle}`);
  if (memory.communicationStyle) lines.push(`Under stress they: ${memory.communicationStyle}`);
  if (memory.companionNotes) lines.push(`Note to self: ${memory.companionNotes}`);

  // Relationship OS — the layer that was previously extracted but never read
  const core = memory.relationshipCore || {};
  if (core.relationshipStage) lines.push(`Where they are in love: ${core.relationshipStage}`);
  if (core.mainBlock) lines.push(`Main block: ${core.mainBlock}`);
  if (core.nextBestAction) lines.push(`Next best action they should take: ${core.nextBestAction}`);
  if (core.partnerLifeGoal) lines.push(`What they want with a partner: ${core.partnerLifeGoal}`);
  if (typeof core.progressScore === "number")
    lines.push(`Progress score (0-100): ${core.progressScore}`);

  const pe = memory.patternEngine || {};
  if (pe.repeatingPatterns?.length)
    lines.push(`Repeating patterns: ${pe.repeatingPatterns.slice(0, 4).join("; ")}`);
  if (pe.selfSabotageLoops?.length)
    lines.push(`Self-sabotage loops: ${pe.selfSabotageLoops.slice(0, 3).join("; ")}`);
  if (pe.healthyShifts?.length)
    lines.push(`Healthy shifts they've made: ${pe.healthyShifts.slice(0, 3).join("; ")}`);
  if (pe.partnerSelectionBias?.length)
    lines.push(`Partner selection bias: ${pe.partnerSelectionBias.slice(0, 3).join("; ")}`);
  if (pe.growthTrend) lines.push(`Growth trend: ${pe.growthTrend}`);

  const os = memory.relationshipOS || {};
  if (os.currentReality?.whoTheyAreTalkingTo)
    lines.push(`Who they're talking to right now: ${os.currentReality.whoTheyAreTalkingTo}`);
  if (os.currentReality?.howInvestedTheyAre)
    lines.push(`How invested they are: ${os.currentReality.howInvestedTheyAre}`);
  if (os.currentReality?.activeConfusion)
    lines.push(`What they're confused about: ${os.currentReality.activeConfusion}`);
  if (os.currentReality?.recentDate)
    lines.push(`Recent date: ${os.currentReality.recentDate}`);
  if (os.currentReality?.recentDisappointment)
    lines.push(`Recent disappointment: ${os.currentReality.recentDisappointment}`);
  if (os.datingStyle?.textingPattern)
    lines.push(`Texting pattern: ${os.datingStyle.textingPattern}`);
  if (os.datingStyle?.pacing) lines.push(`Pacing: ${os.datingStyle.pacing}`);
  if (os.growthHistory?.handledBetterThisTime?.length)
    lines.push(
      `What they handled better this time: ${os.growthHistory.handledBetterThisTime.slice(0, 3).join("; ")}`,
    );

  if (memory.conversationCount)
    lines.push(`You've talked ${memory.conversationCount} times before.`);

  if (lines.length === 0) return "";

  return [
    "WHAT YOU REMEMBER (use this — don't just store it):",
    ...lines.map((l) => `- ${l}`),
    "",
    "GROWTH AWARENESS: If their current behavior diverges from what you remember, notice it. Say it naturally — not clinically.",
  ].join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene-context block — surfaces dynamic data the user is "in" right now
// ─────────────────────────────────────────────────────────────────────────────

function renderSceneContext(ctx: MaahiSceneContext): string {
  const lines: string[] = [];

  if (ctx.intention) lines.push(`Today's intention: "${ctx.intention}"`);
  if (typeof ctx.streak === "number" && ctx.streak > 0)
    lines.push(`Streak: ${ctx.streak} days`);
  if (ctx.recentDebrief) lines.push(`Recent date debrief: "${ctx.recentDebrief}"`);

  if (ctx.match) {
    lines.push(`Talking about: ${ctx.match.name} (${ctx.match.age}, ${ctx.match.city})`);
    if (ctx.match.connectionHook) lines.push(`Why this match clicks: ${ctx.match.connectionHook}`);
    if (ctx.match.tensionPoint) lines.push(`Tension point: ${ctx.match.tensionPoint}`);
  }

  if (ctx.debrief) {
    lines.push(`Debriefing the date with: ${ctx.debrief.matchName}`);
    if (ctx.debrief.chemistryAnswer) lines.push(`Chemistry: "${ctx.debrief.chemistryAnswer}"`);
    if (ctx.debrief.surpriseAnswer) lines.push(`Surprise: "${ctx.debrief.surpriseAnswer}"`);
    if (ctx.debrief.decisionAnswer) lines.push(`Decision: "${ctx.debrief.decisionAnswer}"`);
  }

  if (ctx.landingCta) lines.push(`Landing CTA available: ${ctx.landingCta}`);

  if (lines.length === 0) return "";
  return ["RIGHT NOW IN THIS SCENE:", ...lines.map((l) => `- ${l}`)].join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function push(lines: string[], label: string, value: string | null | undefined) {
  if (value && value.trim() && value !== "not set") {
    lines.push(`- ${label}: ${value}`);
  }
}

function joinList(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return "";
  return arr.filter(Boolean).join(", ");
}
