import type { UIMessage } from "ai";
import { getSessionFromCookies } from "@/lib/auth";
import { runMaahiTurn } from "@/lib/maahi/engine";
import type { MaahiScene } from "@/lib/maahi/scenes";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

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

  if (!userId) {
    // Anonymous users: server-side IP-based rate limit (20 requests/day).
    // Keyed on IP so the client cannot reset it by clearing message history.
    const ip = clientIp(req);
    const anonRl = await checkRateLimit("maahi:anon", ip, { limit: 20, windowSec: 86400 });
    if (!anonRl.allowed) {
      return Response.json(
        { error: "Message limit reached. Sign up to continue chatting with Maahi." },
        { status: 429 },
      );
    }
  } else {
    // Authenticated users: 120 messages/hour (the plan quota system provides the
    // weekly ceiling; this prevents per-minute bursts from hammering the AI API).
    const authedRl = await checkRateLimit("maahi:authed", userId, { limit: 120, windowSec: 3600 });
    if (!authedRl.allowed) return rateLimitResponse(authedRl);
  }

  return runMaahiTurn({
    scene,
    userId,
    messages,
  });
}
