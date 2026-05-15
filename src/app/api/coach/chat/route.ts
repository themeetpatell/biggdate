import { streamText, convertToModelMessages, UIMessage } from "ai";
import { getModel } from "@/lib/ai";
import { coachSystemPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/rate-limit";
import { logAiCall } from "@/lib/ai-costs";

export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const ip = clientIp(req);
  const rl = await checkRateLimit("coach:chat", auth.userId, { limit: 30, windowSec: 3600 });
  if (!rl.allowed) return rateLimitResponse(rl);

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

  const aiStart = Date.now();
  const result = streamText({
    model: getModel(),
    system: coachSystemPrompt(profile),
    messages: modelMessages,
    // Usage resolves only when the stream completes — log from onFinish so
    // we never block the streamed response on the cost write.
    onFinish: ({ usage }) => {
      void logAiCall({
        route: "coach/chat",
        userId: auth.userId,
        usage,
        durationMs: Date.now() - aiStart,
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
