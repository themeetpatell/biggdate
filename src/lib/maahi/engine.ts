import { after } from "next/server";
import {
  streamText,
  generateText,
  convertToModelMessages,
  stepCountIs,
  type UIMessage,
} from "ai";
import { getModel } from "@/lib/ai";
import { getProfileByUserId } from "@/lib/repo";
import type { Profile, SessionMemory } from "@/lib/types";
import {
  getMaahiMemory,
  writeMaahiMemoryPatch,
  shouldRefreshPatternEngine,
} from "./memory";
import { buildMaahiSystemPrompt } from "./prompt";
import { buildMaahiTools } from "./tools";
import { detectTone } from "@/lib/prompts";
import { maahiMemoryExtractionPrompt } from "@/lib/prompts";
import type { MaahiScene, MaahiSceneContext } from "./scenes";
import { sceneFeedsMemory } from "./scenes";

interface RunMaahiTurnInput {
  scene: MaahiScene;
  userId: string | null;
  messages: UIMessage[];
  /** When the caller already has a profile, pass it in to skip a DB hop. */
  profileOverride?: Profile | null;
  sceneContext?: MaahiSceneContext;
  /** Run memory extraction in the background. Default true for memory-feeding scenes. */
  scheduleMemoryUpdate?: boolean;
  /** Override max output tokens (e.g., for onboarding). */
  maxOutputTokens?: number;
  /** Override the system prompt entirely (used by the onboarding spine). */
  systemOverride?: string;
}

/**
 * Single entrypoint for every Maahi-powered chat surface.
 *
 * - Loads profile + memory in parallel (skips when not authenticated).
 * - Builds the unified system prompt with the right scene overlay.
 * - Wires scene-appropriate tools.
 * - Streams the response with multi-step tool execution enabled.
 * - Schedules a background memory update if the scene feeds memory.
 *
 * Returns the streaming response ready to send back to the client.
 */
export async function runMaahiTurn(input: RunMaahiTurnInput): Promise<Response> {
  const {
    scene,
    userId,
    messages,
    profileOverride,
    sceneContext,
    scheduleMemoryUpdate,
    maxOutputTokens,
    systemOverride,
  } = input;

  const [profile, memory] = await Promise.all([
    profileOverride !== undefined
      ? Promise.resolve(profileOverride)
      : userId
        ? getProfileByUserId(userId)
        : Promise.resolve(null),
    userId ? getMaahiMemory(userId) : Promise.resolve(null),
  ]);

  const lastUserText = extractLastUserText(messages);
  const toneHint = lastUserText ? detectTone(lastUserText) || undefined : undefined;

  const system =
    systemOverride ??
    buildMaahiSystemPrompt({
      scene,
      profile,
      memory,
      sceneContext,
      toneHint,
    });

  const tools = buildMaahiTools({ scene, userId });

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: getModel(),
    system,
    messages: modelMessages,
    tools,
    // Allow Maahi a couple of tool calls per turn before final answer.
    stopWhen: stepCountIs(4),
    maxOutputTokens,
  });

  const shouldExtract = scheduleMemoryUpdate ?? sceneFeedsMemory(scene);
  if (shouldExtract && userId && messages.length >= 4) {
    after(async () => {
      await extractAndWriteMemory({
        userId,
        messages,
        existingMemory: memory,
      });
    });
  }

  return result.toUIMessageStreamResponse();
}

// ─────────────────────────────────────────────────────────────────────────────
// Background memory extraction — runs after the response is sent.
// ─────────────────────────────────────────────────────────────────────────────

async function extractAndWriteMemory(input: {
  userId: string;
  messages: UIMessage[];
  existingMemory: SessionMemory | null;
}): Promise<void> {
  const { userId, messages, existingMemory } = input;

  try {
    const transcript = buildTranscript(messages);
    if (!transcript) return;

    const memResult = await generateText({
      model: getModel(),
      prompt: maahiMemoryExtractionPrompt(transcript, existingMemory),
    });

    const parsed = parseJsonLoose(memResult.text);
    if (!parsed || parsed.shouldSave === false) {
      // Still bump the conversation count so refresh cadence works.
      await writeMaahiMemoryPatch(userId, {}, { incrementConversation: true });
      return;
    }

    // Track the last user message's emotional weather, lightly.
    const lastUserText = extractLastUserText(messages);
    const lastEmotionalState = lastUserText ? detectTone(lastUserText) || undefined : undefined;

    const patch: Partial<SessionMemory> = {
      summary: typeof parsed.summary === "string" ? parsed.summary : undefined,
      stableTraits: stringArr(parsed.stableTraits),
      emotionalPatterns: stringArr(parsed.emotionalPatterns),
      needs: stringArr(parsed.needs),
      triggers: stringArr(parsed.triggers),
      boundaries: stringArr(parsed.boundaries),
      reassuranceStyle: typeof parsed.reassuranceStyle === "string" ? parsed.reassuranceStyle : undefined,
      communicationStyle: typeof parsed.communicationStyle === "string" ? parsed.communicationStyle : undefined,
      growthEdges: stringArr(parsed.growthEdges),
      currentSituation: typeof parsed.currentSituation === "string" ? parsed.currentSituation : undefined,
      relationshipCore: isObject(parsed.relationshipCore) ? parsed.relationshipCore : undefined,
      patternEngine: isObject(parsed.patternEngine) ? parsed.patternEngine : undefined,
      relationshipOS: isObject(parsed.relationshipOS) ? parsed.relationshipOS : undefined,
      lastEmotionalState,
    };

    await writeMaahiMemoryPatch(userId, patch, { incrementConversation: true });

    // If the prompt asked us to refresh the pattern engine OR our cadence
    // says it's time, run a deeper pass that re-summarizes patterns from
    // the *existing* OS state (not just this transcript).
    const cadenceTriggered = shouldRefreshPatternEngine(existingMemory);
    if (parsed.shouldRefreshPatternEngine === true || cadenceTriggered) {
      // Best-effort: a follow-up extraction with the freshly-merged state
      // is sufficient — the next regular extraction will fold it in.
      // Leaving as a no-op hook for now; deeper offline pattern jobs can
      // attach here later.
    }
  } catch {
    // Silent — memory extraction is best-effort. We still want the
    // conversation count to advance so future refreshes fire.
    try {
      await writeMaahiMemoryPatch(userId, {}, { incrementConversation: true });
    } catch {
      // Truly best-effort; do not fail the request path.
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function extractLastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    return getMessageText(m);
  }
  return "";
}

function buildTranscript(messages: UIMessage[]): string {
  return messages
    .map((m) => {
      const text = getMessageText(m);
      if (!text) return null;
      return `${m.role === "user" ? "User" : "Maahi"}: ${text}`;
    })
    .filter(Boolean)
    .join("\n");
}

function getMessageText(m: UIMessage): string {
  return (
    m.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? ""
  );
}

function parseJsonLoose(raw: string): Record<string, unknown> | null {
  if (!raw) return null;
  const cleaned = raw.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    return isObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function stringArr(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  return v.filter((x): x is string => typeof x === "string");
}
