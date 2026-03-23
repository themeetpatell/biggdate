import { streamText, generateText, convertToModelMessages, UIMessage } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getSessionMemoryDb, upsertSessionMemory } from "@/lib/repo";
import {
  onboardingSystemPrompt,
  memoryExtractionPrompt,
} from "@/lib/prompts";
import { ONBOARDING_QUESTION_BANK } from "@/lib/constants";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const {
    messages,
    sessionId,
  }: { messages: UIMessage[]; sessionId: string } = await req.json();

  const memory = getSessionMemoryDb(auth.userId, sessionId || "default");
  const questionIndex = messages.filter((m) => m.role === "assistant").length;

  const bankQ =
    ONBOARDING_QUESTION_BANK[questionIndex]?.[
      Math.floor(
        Math.random() * (ONBOARDING_QUESTION_BANK[questionIndex]?.length || 1),
      )
    ] || "";

  const memoryContext = memory
    ? `\nMemory so far:\nSummary: ${memory.summary}\nTraits: ${memory.traits.join(", ")}\nNeeds: ${memory.needs.join(", ")}\nAttachment guess: ${memory.attachmentGuess}\nPrevious questions: ${memory.previousQuestions.join("; ")}\n\nSuggested next question (adapt naturally): ${bankQ}`
    : bankQ
      ? `\nSuggested first question: ${bankQ}`
      : "";

  const provider = getAIProvider();
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: provider(getModel()),
    system: onboardingSystemPrompt(memoryContext),
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
      upsertSessionMemory(auth.userId, sessionId || "default", parsed);
    } catch {
      // silent
    }
  }

  return result.toUIMessageStreamResponse();
}
