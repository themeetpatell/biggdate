import { generateText, type UIMessage } from "ai";
import { getModel } from "@/lib/ai";
import { maahiMemoryExtractionPrompt, detectTone } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import {
  getMaahiMemory,
  writeMaahiMemoryPatch,
} from "@/lib/maahi/memory";
import { logAiCall } from "@/lib/ai-costs";
import type { SessionMemory } from "@/lib/types";

export const maxDuration = 60;

/**
 * Manual memory write endpoint — called from /companion every 3 AI
 * responses to fold the latest exchange into the long-term Relationship
 * OS store. The engine itself also writes memory via Next's `after()`
 * hook on every turn that has enough material; this endpoint is a
 * client-driven backstop for the dedicated /companion experience.
 */
export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("ok");
  }
  const messages = body.messages ?? [];

  const transcript = buildTranscript(messages);
  if (!transcript) return new Response("ok");

  const existing = await getMaahiMemory(auth.userId);

  const extracted = await safeExtract(transcript, existing, auth.userId);
  const lastUserText = extractLastUserText(messages);
  const lastEmotionalState = lastUserText ? detectTone(lastUserText) || undefined : undefined;

  const patch: Partial<SessionMemory> = extracted
    ? {
        summary: pickString(extracted.summary),
        stableTraits: pickStringArr(extracted.stableTraits),
        emotionalPatterns: pickStringArr(extracted.emotionalPatterns),
        needs: pickStringArr(extracted.needs),
        triggers: pickStringArr(extracted.triggers),
        boundaries: pickStringArr(extracted.boundaries),
        reassuranceStyle: pickString(extracted.reassuranceStyle),
        communicationStyle: pickString(extracted.communicationStyle),
        growthEdges: pickStringArr(extracted.growthEdges),
        currentSituation: pickString(extracted.currentSituation),
        relationshipCore: pickObject(extracted.relationshipCore) as SessionMemory["relationshipCore"] | undefined,
        patternEngine: pickObject(extracted.patternEngine) as SessionMemory["patternEngine"] | undefined,
        relationshipOS: pickObject(extracted.relationshipOS) as SessionMemory["relationshipOS"] | undefined,
        lastEmotionalState,
      }
    : { lastEmotionalState };

  await writeMaahiMemoryPatch(auth.userId, patch, { incrementConversation: true });

  return new Response("ok");
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function safeExtract(
  transcript: string,
  existing: SessionMemory | null,
  userId: string,
): Promise<Record<string, unknown> | null> {
  const aiStart = Date.now();
  try {
    const res = await generateText({
      model: getModel(),
      prompt: maahiMemoryExtractionPrompt(transcript, existing),
    });
    await logAiCall({
      route: "companion/memory",
      userId,
      usage: res.usage,
      durationMs: Date.now() - aiStart,
    });
    const cleaned = res.text.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (!isObject(parsed)) return null;
    if (parsed.shouldSave === false) return null;
    return parsed;
  } catch (err) {
    await logAiCall({
      route: "companion/memory",
      userId,
      durationMs: Date.now() - aiStart,
      error: err instanceof Error ? err.message : "unknown",
    });
    return null;
  }
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

function extractLastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return getMessageText(messages[i]);
  }
  return "";
}

function getMessageText(m: UIMessage): string {
  return (
    m.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? ""
  );
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function pickString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}

function pickStringArr(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x): x is string => typeof x === "string");
  return out.length > 0 ? out : undefined;
}

function pickObject(v: unknown): Record<string, unknown> | undefined {
  return isObject(v) ? v : undefined;
}
