/**
 * Per-call AI inference cost logger.
 *
 * Wraps an AI SDK call (generateText, streamText) and persists the surface,
 * provider, model, token counts, and estimated USD cost to `ai_costs`. The
 * ops dashboard queries this table to answer the single most important
 * unit-economics question: what's our $/active-user/month?
 *
 * Usage:
 *
 *   import { logAiCall } from "@/lib/ai-costs";
 *   const result = await generateText({ ... });
 *   await logAiCall({
 *     route: "matches/generate",
 *     userId,
 *     usage: result.usage,
 *     durationMs: Date.now() - started,
 *   });
 *
 * Fire-and-forget: log failures never block the generation. If the write
 * fails we log via Sentry and move on.
 */

import { randomUUID } from "node:crypto";
import { sql, hasDatabaseConfig } from "@/lib/db";
import { log } from "@/lib/log";

interface Usage {
  inputTokens?: number;
  outputTokens?: number;
  // The AI SDK v6 also reports cachedInputTokens etc. We don't price-
  // separate those today; total input includes them.
}

interface LogAiCallInput {
  route: string;
  userId?: string | null;
  usage?: Usage | null;
  durationMs?: number;
  error?: string | null;
}

// Per-million-token prices in USD. Source: provider docs as of 2026-05.
// When prices change, update here and (optionally) backfill cost_usd for
// historical rows via scripts/backfill-ai-costs.ts.
const PRICE_PER_MTOK: Record<string, { input: number; output: number }> = {
  "gemini-2.5-flash":     { input: 0.075, output: 0.30 },
  "gemini-2.5-pro":       { input: 1.25,  output: 5.00 },
  "gemini-2.5-flash-lite":{ input: 0.05,  output: 0.20 },
  "gpt-4.1":              { input: 2.00,  output: 8.00 },
  "gpt-4.1-mini":         { input: 0.40,  output: 1.60 },
  "gpt-4o":               { input: 2.50,  output: 10.00 },
  "gpt-4o-mini":          { input: 0.15,  output: 0.60 },
};

function estimateCostUsd(model: string, usage: Usage | null | undefined): number {
  if (!usage) return 0;
  const price = PRICE_PER_MTOK[model];
  if (!price) return 0;
  const input = usage.inputTokens ?? 0;
  const output = usage.outputTokens ?? 0;
  return (input * price.input + output * price.output) / 1_000_000;
}

function currentProvider(): string {
  return (process.env.AI_PROVIDER || "gemini").toLowerCase();
}

function currentModel(): string {
  const provider = currentProvider();
  if (provider === "openai") return process.env.OPENAI_MODEL || "gpt-4.1";
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

export async function logAiCall(input: LogAiCallInput): Promise<void> {
  if (!hasDatabaseConfig()) return;

  const id = `aic_${randomUUID()}`;
  const provider = currentProvider();
  const model = currentModel();
  const inputTokens = input.usage?.inputTokens ?? 0;
  const outputTokens = input.usage?.outputTokens ?? 0;
  const costUsd = estimateCostUsd(model, input.usage);

  try {
    await sql`
      INSERT INTO ai_costs (
        id, user_id, route, provider, model,
        input_tokens, output_tokens, cost_usd, duration_ms, error
      ) VALUES (
        ${id},
        ${input.userId ?? null},
        ${input.route},
        ${provider},
        ${model},
        ${inputTokens},
        ${outputTokens},
        ${costUsd},
        ${input.durationMs ?? null},
        ${input.error ?? null}
      )
    `;
  } catch (err) {
    log.error("ai-costs: failed to log call", err, {
      route: input.route,
      provider,
      model,
    });
  }
}
