import { streamText, convertToModelMessages, UIMessage } from "ai";
import { getModel } from "@/lib/ai";
import { coachSystemPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";

export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const messages = body.messages ?? [];
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
