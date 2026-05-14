import type { UIMessage } from "ai";
import { requireAuth } from "@/lib/require-auth";
import { requirePlanAtomic } from "@/lib/repo";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/rate-limit";
import { runMaahiTurn } from "@/lib/maahi/engine";
import type { MaahiSceneContext } from "@/lib/maahi/scenes";

export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const ip = clientIp(req);
  const rl = await checkRateLimit("companion:chat", auth.userId, { limit: 60, windowSec: 3600 });
  if (!rl.allowed) return rateLimitResponse(rl);

  const gate = await requirePlanAtomic(auth.userId, "maahi_turn");
  if (!gate.allowed) {
    return new Response(JSON.stringify({ 
      error: "Weekly Maahi message limit reached", 
      code: "quota_exhausted",
      gate: {
        plan: gate.plan,
        used: gate.used,
        limit: gate.limit,
      },
      upgradeUrl: "/settings/billing"
    }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, context }: { messages: UIMessage[]; context?: MaahiSceneContext } =
    await req.json();

  return runMaahiTurn({
    scene: "daily-checkin",
    userId: auth.userId,
    messages,
    sceneContext: context,
  });
}
