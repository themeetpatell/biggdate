/**
 * A/B test assignment.
 *
 * Variant assignment is deterministic — a hash of (experimentId, userId)
 * maps to a stable bucket, so the same user always gets the same variant
 * without needing a stored assignment. The `experiment_exposures` table
 * records the first time a user is exposed, which conversion analysis
 * joins against.
 *
 * Usage:
 *
 *   import { getVariant } from "@/lib/experiments";
 *   const variant = await getVariant("exp_soul_knock_floor", userId);
 *   if (variant === "v1") { ... }
 *
 * If the experiment is missing, in draft, or completed, getVariant returns
 * the control variant and records no exposure — callers can treat control
 * as "feature off / current behavior".
 */

import { createHash, randomUUID } from "node:crypto";
import { sql, hasDatabaseConfig } from "@/lib/db";
import { log } from "@/lib/log";

interface ExperimentDef {
  id: string;
  variants: string[];
  weights: number[] | null;
  status: "draft" | "running" | "completed";
}

const CONTROL = "control";

// Experiment definitions change rarely; cache them for 60s so getVariant
// doesn't hit the DB on every call.
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { def: ExperimentDef | null; at: number }>();

async function loadExperiment(experimentId: string): Promise<ExperimentDef | null> {
  const cached = cache.get(experimentId);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.def;

  let def: ExperimentDef | null = null;
  try {
    const rows = await sql`
      SELECT id, variants, weights, status
      FROM experiments
      WHERE id = ${experimentId}
      LIMIT 1
    `;
    if (rows.length > 0) {
      const row = rows[0] as Record<string, unknown>;
      const variants = Array.isArray(row.variants)
        ? (row.variants as string[])
        : JSON.parse(String(row.variants)) as string[];
      const weights = row.weights == null
        ? null
        : Array.isArray(row.weights)
          ? (row.weights as number[])
          : JSON.parse(String(row.weights)) as number[];
      def = {
        id: String(row.id),
        variants: variants.length > 0 ? variants : [CONTROL],
        weights,
        status: String(row.status) as ExperimentDef["status"],
      };
    }
  } catch (err) {
    log.error("experiments: failed to load definition", err, { experimentId });
    // Fall through with def = null → callers get control.
  }

  cache.set(experimentId, { def, at: Date.now() });
  return def;
}

// Deterministic bucket 0-99 from (experimentId, userId).
function bucketFor(experimentId: string, userId: string): number {
  const hash = createHash("sha256").update(`${experimentId}:${userId}`).digest("hex");
  // First 8 hex chars → 32-bit int → mod 100.
  return parseInt(hash.slice(0, 8), 16) % 100;
}

function variantForBucket(def: ExperimentDef, bucket: number): string {
  const { variants, weights } = def;
  if (!weights || weights.length !== variants.length) {
    // Equal split.
    const size = Math.floor(100 / variants.length);
    const idx = Math.min(Math.floor(bucket / size), variants.length - 1);
    return variants[idx];
  }
  // Weighted split. Weights are integers; we walk the cumulative range.
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return variants[0];
  let cursor = 0;
  const scaled = bucket * total / 100;
  for (let i = 0; i < variants.length; i++) {
    cursor += weights[i];
    if (scaled < cursor) return variants[i];
  }
  return variants[variants.length - 1];
}

async function recordExposure(experimentId: string, userId: string, variant: string): Promise<void> {
  try {
    await sql`
      INSERT INTO experiment_exposures (id, experiment_id, user_id, variant)
      VALUES (${`expo_${randomUUID()}`}, ${experimentId}, ${userId}, ${variant})
      ON CONFLICT (experiment_id, user_id) DO NOTHING
    `;
  } catch (err) {
    log.error("experiments: failed to record exposure", err, { experimentId, userId });
  }
}

/**
 * Resolve the variant for a user in an experiment. Records first exposure.
 * Returns "control" when the experiment is missing / draft / completed, or
 * when there's no database configured (local dev).
 */
export async function getVariant(experimentId: string, userId: string): Promise<string> {
  if (!hasDatabaseConfig() || !userId) return CONTROL;

  const def = await loadExperiment(experimentId);
  if (!def || def.status !== "running") {
    return def?.variants[0] ?? CONTROL;
  }

  const variant = variantForBucket(def, bucketFor(experimentId, userId));

  // Fire-and-forget exposure record — never block the caller on it.
  void recordExposure(experimentId, userId, variant);

  return variant;
}

/**
 * Create or update an experiment definition. Intended for ops scripts /
 * an admin surface, not the request hot path. Status defaults to 'draft';
 * flip to 'running' to start assigning non-control variants.
 */
export async function defineExperiment(input: {
  id: string;
  name: string;
  description?: string;
  variants: string[];
  weights?: number[] | null;
  status?: "draft" | "running" | "completed";
}): Promise<void> {
  if (!hasDatabaseConfig()) return;
  const status = input.status ?? "draft";
  await sql`
    INSERT INTO experiments (id, name, description, variants, weights, status, started_at, ended_at)
    VALUES (
      ${input.id},
      ${input.name},
      ${input.description ?? ""},
      ${JSON.stringify(input.variants)}::jsonb,
      ${input.weights ? JSON.stringify(input.weights) : null}::jsonb,
      ${status},
      ${status === "running" ? new Date().toISOString() : null},
      ${status === "completed" ? new Date().toISOString() : null}
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      variants = EXCLUDED.variants,
      weights = EXCLUDED.weights,
      status = EXCLUDED.status,
      started_at = COALESCE(experiments.started_at, EXCLUDED.started_at),
      ended_at = EXCLUDED.ended_at
  `;
  cache.delete(input.id);
}
