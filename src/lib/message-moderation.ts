import { generateText } from "ai";
import { getModel } from "./ai";
import { outgoingMessageModerationPrompt } from "./prompts";
import { logAiCall } from "./ai-costs";
import { log } from "./log";

export type MessageVerdict =
  | "safe"
  | "harassment"
  | "explicit_unsolicited"
  | "contact_bait"
  | "self_harm";

export interface MessageModerationResult {
  verdict: MessageVerdict;
  reason: string;
  coaching: string;
  // "ai" when the classifier returned a parsed verdict.
  // "fallback" when the classifier failed or parsing failed — we fail OPEN
  // (allow the message) because false positives on a first-launch dating app
  // are worse than the rare slip past the safety net.
  source: "ai" | "fallback";
}

const FAIL_OPEN: MessageModerationResult = {
  verdict: "safe",
  reason: "moderation_unavailable",
  coaching: "",
  source: "fallback",
};

const VALID_VERDICTS = new Set<MessageVerdict>([
  "safe",
  "harassment",
  "explicit_unsolicited",
  "contact_bait",
  "self_harm",
]);

export async function moderateOutgoingMessage(
  text: string,
  userId: string,
): Promise<MessageModerationResult> {
  const trimmed = text.trim();
  if (!trimmed) return { ...FAIL_OPEN };

  // Skip the AI call for very short messages — they can't carry meaningful
  // harassment context and we'd burn tokens on "hey" 95% of the time.
  if (trimmed.length < 8) return { ...FAIL_OPEN, reason: "below_threshold" };

  const aiStart = Date.now();
  let raw = "";
  try {
    const result = await generateText({
      model: getModel(),
      prompt: outgoingMessageModerationPrompt(trimmed),
    });
    await logAiCall({
      route: "messages/moderate",
      userId,
      usage: result.usage,
      durationMs: Date.now() - aiStart,
    });
    raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  } catch (err) {
    log.warn("messages/moderate ai_call_failed", { userId, err: String(err) });
    return { ...FAIL_OPEN };
  }

  try {
    const parsed = JSON.parse(raw) as {
      verdict?: unknown;
      reason?: unknown;
      coaching?: unknown;
    };
    const verdict =
      typeof parsed.verdict === "string" && VALID_VERDICTS.has(parsed.verdict as MessageVerdict)
        ? (parsed.verdict as MessageVerdict)
        : "safe";
    const reason = typeof parsed.reason === "string" ? parsed.reason.slice(0, 240) : "";
    const coaching = typeof parsed.coaching === "string" ? parsed.coaching.slice(0, 240) : "";
    return { verdict, reason, coaching, source: "ai" };
  } catch (err) {
    log.warn("messages/moderate parse_failed", {
      userId,
      err: String(err),
      rawSample: raw.slice(0, 200),
    });
    return { ...FAIL_OPEN, reason: "moderation_parse_failed" };
  }
}

// Caller-facing helper — returns true when the verdict should block the send.
// "safe" passes. Everything else is block-worthy; the route layer decides
// whether to soft-block (allow override on next click) or hard-block.
export function shouldBlockSend(verdict: MessageVerdict): boolean {
  return verdict !== "safe";
}
