import { streamText, convertToModelMessages, UIMessage } from "ai";
import { getModel } from "@/lib/ai";
import { coachSystemPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { messages }: { messages: UIMessage[] } = await req.json();
  const profile = await getProfileByUserId(auth.userId);
  if (!profile) {
    return new Response("No profile found", { status: 400 });
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: getModel(),
    system: coachSystemPrompt(profile),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
