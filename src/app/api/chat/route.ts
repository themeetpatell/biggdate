import { after } from "next/server";
import { streamText, generateText, convertToModelMessages, UIMessage } from "ai";
import { getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getSessionMemoryDb, upsertSessionMemory, getAccountHandleByUserId } from "@/lib/repo";
import { logAiCall } from "@/lib/ai-costs";
import {
  onboardingBasicPrompt,
  onboardingPsychologicalPrompt,
  BASIC_SPINE,
  PSYCH_SPINE,
  PSYCH_FOLLOWUP_BUDGET,
  memoryExtractionPrompt,
} from "@/lib/prompts";

export const maxDuration = 60;

function getMessageText(m: UIMessage): string {
  return (
    m.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? ""
  );
}

/**
 * Compute phase / spine index / followups from the message history.
 *
 * Phase 1 ends when an assistant message contains PHASE_1_DONE.
 * Phase 2 ends when an assistant message contains PHASE_2_DONE.
 * Phase 2 follow-ups are counted via [FOLLOWUP] markers; advances via [ADVANCE].
 *
 * Within Phase 1 (no follow-ups allowed): spineIndex = number of user answers
 * since phase start (excluding the __BEGIN__ trigger).
 *
 * Within Phase 2: spineIndex = number of [ADVANCE] markers seen so far.
 * followupsUsed = number of [FOLLOWUP] markers.
 */
function computePhaseState(messages: UIMessage[]): {
  phase: "basic" | "psychological" | "complete";
  spineIndex: number;
  followupsRemaining: number;
  isPhaseStart: boolean;
} {
  let phase: "basic" | "psychological" | "complete" = "basic";
  let phase1DoneIndex = -1;
  let phase2DoneIndex = -1;

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m.role !== "assistant") continue;
    const text = getMessageText(m);
    if (text.includes("PHASE_1_DONE") && phase1DoneIndex === -1) {
      phase1DoneIndex = i;
      phase = "psychological";
    }
    if (text.includes("PHASE_2_DONE") && phase2DoneIndex === -1) {
      phase2DoneIndex = i;
      phase = "complete";
    }
  }

  if (phase === "basic") {
    // spineIndex = count user answers (skip system triggers like __BEGIN__)
    const userAnswers = messages.filter((m) => {
      if (m.role !== "user") return false;
      const t = getMessageText(m);
      return !t.includes("__BEGIN__") && !t.includes("__BEGIN_PHASE_2__");
    }).length;
    return {
      phase,
      spineIndex: Math.min(userAnswers, BASIC_SPINE.length - 1),
      followupsRemaining: 0,
      isPhaseStart: userAnswers === 0,
    };
  }

  if (phase === "psychological") {
    // Count [ADVANCE] / [FOLLOWUP] markers in assistant messages after PHASE_1_DONE
    let advances = 0;
    let followups = 0;
    for (let i = phase1DoneIndex + 1; i < messages.length; i++) {
      const m = messages[i];
      if (m.role !== "assistant") continue;
      const text = getMessageText(m);
      if (text.includes("[ADVANCE]")) advances++;
      else if (text.includes("[FOLLOWUP]")) followups++;
    }
    return {
      phase,
      spineIndex: Math.min(advances, PSYCH_SPINE.length - 1),
      followupsRemaining: Math.max(0, PSYCH_FOLLOWUP_BUDGET - followups),
      isPhaseStart: advances === 0 && followups === 0,
    };
  }

  return { phase, spineIndex: 0, followupsRemaining: 0, isPhaseStart: false };
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const {
    messages,
    sessionId,
  }: { messages: UIMessage[]; sessionId: string } = await req.json();

  const accountHandle = await getAccountHandleByUserId(auth.userId);

  const firstName = accountHandle?.fullName
    ? accountHandle.fullName.trim().split(/\s+/)[0]
    : undefined;

  const { phase, spineIndex, followupsRemaining, isPhaseStart } =
    computePhaseState(messages);

  // Build the right system prompt for the current phase
  let system: string;
  if (phase === "basic") {
    system = onboardingBasicPrompt(spineIndex, firstName);
  } else if (phase === "psychological") {
    system = onboardingPsychologicalPrompt(
      spineIndex,
      followupsRemaining,
      firstName,
      isPhaseStart,
    );
  } else {
    // Phase complete — should not be called, but produce a safe fallback
    system = `You are Maahi. Onboarding is complete. Respond with a single line: PHASE_2_DONE`;
  }

  const modelMessages = await convertToModelMessages(messages);

  const aiStart = Date.now();
  const result = streamText({
    model: getModel(),
    system,
    messages: modelMessages,
    maxOutputTokens: 500,
    temperature: 0.5,
    onFinish: ({ usage }) => {
      void logAiCall({
        route: `chat:onboarding:${phase}`,
        userId: auth.userId,
        usage,
        durationMs: Date.now() - aiStart,
      });
    },
  });

  // Background memory extraction — only meaningful in psych phase
  if (phase === "psychological" && messages.length >= 4 && messages.length % 2 === 0) {
    const transcript = messages
      .map((m) => `${m.role}: ${getMessageText(m)}`)
      .join("\n");

    after(async () => {
      const memStart = Date.now();
      try {
        const memResult = await generateText({
          model: getModel(),
          prompt: memoryExtractionPrompt(transcript),
        });
        await logAiCall({
          route: "chat:memory-extraction",
          userId: auth.userId,
          usage: memResult.usage,
          durationMs: Date.now() - memStart,
        });
        const raw = memResult.text || "";
        const jsonStr = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(jsonStr);
        const patch = {
          ...parsed,
          conversationPhase: parsed.conversation_phase || parsed.conversationPhase,
          coveredTopics: parsed.covered_topics || parsed.coveredTopics,
        };
        await upsertSessionMemory(auth.userId, sessionId || "default", patch);
      } catch {
        // silent — memory extraction is best-effort
      }
    });
  }

  // Touch session memory so we have a row for downstream features.
  // Reads are kept off the hot path; the existing companion + matching code reads from this table.
  void getSessionMemoryDb(auth.userId, sessionId || "default");

  return result.toUIMessageStreamResponse();
}
