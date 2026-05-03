import type { UIMessage } from "ai";
import { requireAuth } from "@/lib/require-auth";
import { requirePlan, incrementUsage } from "@/lib/repo";
import { runMaahiTurn } from "@/lib/maahi/engine";
import type { MaahiSceneContext } from "@/lib/maahi/scenes";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const gate = await requirePlan(auth.userId, "maahi_session");
  if (!gate.allowed) {
    return new Response(JSON.stringify({ error: "Weekly Maahi session limit reached", gate }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  await incrementUsage(auth.userId, "maahi_session");

  const { messages, context }: { messages: UIMessage[]; context?: MaahiSceneContext } =
    await req.json();

  return runMaahiTurn({
    scene: "daily-checkin",
    userId: auth.userId,
    messages,
    sceneContext: context,
  });
}
