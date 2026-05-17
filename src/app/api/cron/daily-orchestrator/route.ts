import { NextResponse } from "next/server";
import { runPulsePromptBlast } from "@/lib/jobs/pulse-prompt-blast";
import { runMatchOfTheDay } from "@/lib/jobs/match-of-the-day";
import { runMatchCacheRefresh } from "@/lib/jobs/match-cache-refresh";
import { runReactivationWorker } from "@/lib/jobs/reactivation-worker";
import { log } from "@/lib/log";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Daily growth orchestrator — invoked by Vercel Cron once per day.
 * Three jobs run in parallel; each is independently idempotent so a missed
 * day plus a manual re-trigger does not double-send.
 *
 * Authentication: Vercel Cron adds `Authorization: Bearer $CRON_SECRET`
 * when the env var is set.
 */
export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET;
  const provided = req.headers.get("authorization");

  if (!expected) {
    log.error("cron: CRON_SECRET not configured");
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 },
    );
  }
  if (provided !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  // Pulse + reactivation are independent and run in parallel. Match-of-the-
  // day depends on the cache being warm for today, so cache refresh runs
  // first and MOTD runs immediately after — wrapped together as a single
  // settled branch so a refresh failure doesn't take down the rest.
  const matchChain = (async () => {
    const refresh = await runMatchCacheRefresh();
    const motd = await runMatchOfTheDay();
    return { refresh, motd };
  })();

  const [pulse, reactivation, match] = await Promise.allSettled([
    runPulsePromptBlast(),
    runReactivationWorker(),
    matchChain,
  ]);

  const result = {
    durationMs: Date.now() - startedAt,
    pulsePrompt: settled(pulse),
    matchCacheRefresh: match.status === "fulfilled"
      ? { status: "ok" as const, value: match.value.refresh }
      : { status: "error" as const, error: errMsg(match.reason) },
    matchOfTheDay: match.status === "fulfilled"
      ? { status: "ok" as const, value: match.value.motd }
      : { status: "error" as const, error: errMsg(match.reason) },
    reactivation: settled(reactivation),
  };

  log.info("cron: daily orchestrator complete", result);
  return NextResponse.json(result);
}

function settled<T>(p: PromiseSettledResult<T>):
  | { status: "ok"; value: T }
  | { status: "error"; error: string } {
  if (p.status === "fulfilled") return { status: "ok", value: p.value };
  return { status: "error", error: errMsg(p.reason) };
}

function errMsg(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}
