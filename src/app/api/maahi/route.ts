import { convertToModelMessages, streamText, UIMessage } from "ai";
import { getModel } from "@/lib/ai";

const MAX_MESSAGES_PER_SESSION = 20;

const SYSTEM_PROMPT = `You are Maahi, the AI relationship guide behind BiggDate.
You are talking to a visitor on the BiggDate landing page.
BiggDate is for people who build things: founders, operators, PMs, engineers, designers, and investors.
Your goal is to demonstrate emotional intelligence, warmth, and high-context understanding of builder life.
You are perceptive, calm, and depth-first.
You help people date with more context by understanding work rhythm, ambition, emotional patterns, and compatibility under pressure.
Keep your responses very concise (1-3 sentences max) to simulate a real, punchy text conversation.
Be welcoming, ask an insightful question that sounds native to ambitious builder life, and show why this is different from filling out a typical dating app profile.
Do not be overly enthusiastic or use emojis.
Be grounded, direct, secure, and warm.`;

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
