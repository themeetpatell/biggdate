import { streamText, convertToModelMessages, UIMessage } from "ai";
import { getModel } from "@/lib/ai";
import { companionSystemPrompt, detectTone } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, getSessionMemoryDb } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { messages, context }: { messages: UIMessage[]; context?: { intention?: string; recentDebrief?: string; streak?: number } } =
    await req.json();

  const [profile, memory] = await Promise.all([
    getProfileByUserId(auth.userId),
    getSessionMemoryDb(auth.userId, "companion"),
  ]);

  if (!profile) {
    return new Response("No profile found", { status: 400 });
  }

  // Detect the emotional tone of the latest user message
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const lastText =
    lastUserMessage?.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") ?? "";
  const currentTone = detectTone(lastText);

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: getModel(),
    system: companionSystemPrompt(profile, context || {}, memory, currentTone || undefined),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
