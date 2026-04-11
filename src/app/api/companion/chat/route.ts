import { streamText, convertToModelMessages, UIMessage } from "ai";
import { getModel } from "@/lib/ai";
import { companionSystemPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { messages, context }: { messages: UIMessage[]; context?: { intention?: string; recentDebrief?: string; streak?: number } } =
    await req.json();

  const profile = await getProfileByUserId(auth.userId);
  if (!profile) {
    return new Response("No profile found", { status: 400 });
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: getModel(),
    system: companionSystemPrompt(profile, context || {}),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
