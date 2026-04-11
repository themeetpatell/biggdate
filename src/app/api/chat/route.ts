import { streamText, generateText, convertToModelMessages, UIMessage } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getSessionMemoryDb, upsertSessionMemory } from "@/lib/repo";
import {
  onboardingSystemPrompt,
  memoryExtractionPrompt,
} from "@/lib/prompts";
import { ONBOARDING_PHASE_QUESTIONS } from "@/lib/constants";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const {
    messages,
    sessionId,
  }: { messages: UIMessage[]; sessionId: string } = await req.json();

  const memory = await getSessionMemoryDb(auth.userId, sessionId || "default");

  // Extract questions already asked from assistant messages (synchronous, no async lag)
  const assistantMessages = messages.filter((m) => m.role === "assistant");

  const askedTopics: string[] = assistantMessages.flatMap((m) => {
    const text = m.parts
      ?.filter((p: { type: string }): p is { type: "text"; text: string } => p.type === "text")
      .map((p: { text: string }) => p.text)
      .join("") || "";
    // Pull out every sentence ending with a question mark
    const questions = text.match(/[^.!?]*\?/g) || [];
    return questions.map((q) => q.trim()).filter((q) => q.length > 10);
  });

  // Current conversation phase — from persisted memory or default to opening
  const phase = memory?.conversationPhase || "opening";
  const coveredTopics = memory?.coveredTopics || [];

  // Pick a phase-appropriate bank question not yet covered
  const askedLower = askedTopics.map((t) => t.toLowerCase());
  const bankOptions = ONBOARDING_PHASE_QUESTIONS[phase] ?? ONBOARDING_PHASE_QUESTIONS["opening"] ?? [];
  const unusedBank = bankOptions.filter(
    (q) =>
      !askedLower.some((a) => a.includes(q.toLowerCase().slice(0, 30))) &&
      !coveredTopics.some((ct) => ct.toLowerCase().includes(q.toLowerCase().slice(0, 20)))
  );
  const bankQ = unusedBank[Math.floor(Math.random() * Math.max(unusedBank.length, 1))] || "";

  // Phase descriptions passed into system prompt for guidance
  const phaseDescriptions: Record<string, string> = {
    opening: "Build initial trust. Understand what brought them here and what would make this worthwhile.",
    history: "Explore relationship history — patterns, what broke down, what they learned about themselves.",
    values: "Understand core needs and non-negotiables — what they can't compromise on, what they need most from a partner.",
    "life-architecture": "Explore life direction — city, pace, career, family vision, daily rhythm.",
    complete: "Conversation complete. Emit PROFILE_COMPLETE if not yet done.",
  };

  const memoryContext = memory
    ? `\nMemory so far:\nPhase: ${phase}\nSummary: ${memory.summary}\nTraits: ${memory.traits.join(", ")}\nNeeds: ${memory.needs.join(", ")}\nCovered topics: ${coveredTopics.join(", ") || "none yet"}\nAttachment guess: ${memory.attachmentGuess}\n\nCurrent phase theme: ${phaseDescriptions[phase] || ""}\n${bankQ ? `Suggested question for this phase (only if topic not yet covered): ${bankQ}` : ""}`
    : `\nPhase: ${phase}\nCurrent phase theme: ${phaseDescriptions[phase] || ""}\n${bankQ ? `Suggested first question: ${bankQ}` : ""}`;

  const provider = getAIProvider();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: provider(getModel()),
    system: onboardingSystemPrompt(memoryContext, askedTopics),
    messages: modelMessages,
  });

  // Background: extract memory
  const transcript = messages
    .map((m) => {
      const text = m.parts
        ?.filter((p: { type: string }): p is { type: "text"; text: string } => p.type === "text")
        .map((p: { text: string }) => p.text)
        .join("") || "";
      return `${m.role}: ${text}`;
    })
    .join("\n");

  if (messages.length >= 4 && messages.length % 2 === 0) {
    try {
      const memResult = await generateText({
        model: provider(getModel()),
        prompt: memoryExtractionPrompt(transcript),
      });
      const raw = memResult.text || "";
      const jsonStr = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      // Map snake_case fields from extraction prompt to camelCase SessionMemory keys
      const patch = {
        ...parsed,
        conversationPhase: parsed.conversation_phase || parsed.conversationPhase,
        coveredTopics: parsed.covered_topics || parsed.coveredTopics,
      };
      await upsertSessionMemory(auth.userId, sessionId || "default", patch);
    } catch {
      // silent
    }
  }

  return result.toUIMessageStreamResponse();
}
