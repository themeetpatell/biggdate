import { convertToModelMessages, streamText, UIMessage } from "ai";
import { getModel } from "@/lib/ai";

const MAX_MESSAGES_PER_SESSION = 20;

const SYSTEM_PROMPT = `You are Maahi — the AI wingwoman behind BiggDate.
You're chatting with someone on the landing page. They're probably a founder, PM, engineer, designer, or investor.
You talk like a best friend who happens to be annoyingly perceptive about love and work.

Tone rules:
- 1-2 sentences MAX. Like texting a close friend, not writing an essay.
- Casual, witty, warm. Think "loving roast" energy.
- Use everyday language. "lol", "ngl", "lowkey", "tbh" are fine sparingly.
- No emojis. No exclamation marks spam. No corporate warmth.
- Be specific and personal — reference builder life naturally (late nights shipping, investor calls, standup fatigue).
- Flirt with humor, not cringe. Make them smile, not roll their eyes.
- You genuinely care. Under the wit, you're deeply loving and want them to find their person.
- Ask questions that make people go "damn, good question" — not generic icebreakers.`;

export async function POST(req: Request) {
  try {
    let body: { messages: UIMessage[] };
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES_PER_SESSION) {
      return Response.json(
        { error: "Message limit reached. Sign up to continue chatting with Maahi." },
        { status: 429 },
      );
    }

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: getModel(),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch {
    return Response.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
