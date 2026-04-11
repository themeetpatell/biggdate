import { after } from "next/server";
import { streamText, generateText, convertToModelMessages, UIMessage } from "ai";
import { getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getSessionMemoryDb, upsertSessionMemory, getAccountHandleByUserId } from "@/lib/repo";
import {
  onboardingSystemPrompt,
  memoryExtractionPrompt,
} from "@/lib/prompts";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const {
    messages,
    sessionId,
  }: { messages: UIMessage[]; sessionId: string } = await req.json();

  const [memory, accountHandle] = await Promise.all([
    getSessionMemoryDb(auth.userId, sessionId || "default"),
    getAccountHandleByUserId(auth.userId),
  ]);

  // Use just the first name so Maahi sounds natural, not formal
  const firstName = accountHandle?.fullName
    ? accountHandle.fullName.trim().split(/\s+/)[0]
    : undefined;

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

  const coveredTopics = memory?.coveredTopics || [];

  // Factual memory context only — no phase/question-ordering instructions
  // (the system prompt handles the 8-question arc explicitly)
  const memoryContext = memory
    ? `\nWhat you already know about this person:\nSummary: ${memory.summary || "none yet"}\nTraits observed: ${memory.traits.join(", ") || "none yet"}\nNeeds observed: ${memory.needs.join(", ") || "none yet"}\nTopics already covered: ${coveredTopics.join(", ") || "none yet"}\nAttachment signal: ${memory.attachmentGuess || "unclear yet"}`
    : "";

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: getModel(),
    system: onboardingSystemPrompt(memoryContext, askedTopics, firstName),
    messages: modelMessages,
    maxOutputTokens: 500,
    temperature: 0.5,
  });

  if (messages.length >= 4 && messages.length % 2 === 0) {
    const transcript = messages
      .map((m) => {
        const text = m.parts
          ?.filter((p: { type: string }): p is { type: "text"; text: string } => p.type === "text")
          .map((p: { text: string }) => p.text)
          .join("") || "";
        return `${m.role}: ${text}`;
      })
      .join("\n");

    after(async () => {
      try {
        const memResult = await generateText({
          model: getModel(),
          prompt: memoryExtractionPrompt(transcript),
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
        // silent
      }
    });
  }

  return result.toUIMessageStreamResponse();
}
