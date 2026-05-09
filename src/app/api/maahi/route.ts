import type { UIMessage } from "ai";
import { getSessionFromCookies } from "@/lib/auth";
import { runMaahiTurn } from "@/lib/maahi/engine";
import type { MaahiScene } from "@/lib/maahi/scenes";

export const maxDuration = 60;

const MAX_ANON_MESSAGES_PER_SESSION = 20;

/**
 * Floating-widget Maahi.
 *
 * Adapts based on the request's auth state:
 *  - Anonymous (landing pages): "landing" scene, no profile, no memory,
 *    no tools, capped at 20 messages to keep the surface honest.
 *  - Authenticated (auth'd pages where the widget overlays): "general"
 *    scene, full profile + Relationship OS memory + read tools so she
 *    can actually answer "what's my attachment style?" or "tell me
 *    about my latest match" with real data.
 */
export async function POST(req: Request) {
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

  const session = await getSessionFromCookies();
  const userId = session?.userId ?? null;
  const scene: MaahiScene = userId ? "general" : "landing";

  if (!userId && messages.length > MAX_ANON_MESSAGES_PER_SESSION) {
    return Response.json(
      { error: "Message limit reached. Sign up to continue chatting with Maahi." },
      { status: 429 },
    );
  }

  return runMaahiTurn({
    scene,
    userId,
    messages,
  });
}
