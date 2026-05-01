import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiter with two tiers:
 *
 * 1. Production: Upstash Redis (sliding-window, distributed, durable).
 *    Activates when both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 *    env vars are set. Vercel Marketplace's Upstash integration auto-provisions
 *    these.
 *
 * 2. Dev / fallback: in-memory sliding window. Resets on process restart, not
 *    shared across regions or Vercel Functions, but adequate for local dev and
 *    a soft-launch single-region deploy.
 *
 * Usage:
 *   const r = await checkRateLimit("auth:login", ip, { limit: 5, windowSec: 60 });
 *   if (!r.allowed) return new Response("Too many requests", { status: 429 });
 */

type WindowEntry = { count: number; resetAt: number };
const memoryStore = new Map<string, WindowEntry>();

function memoryRateLimit(
  key: string,
  limit: number,
  windowSec: number,
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

let upstashLimiterCache: { limit: number; window: number; rl: Ratelimit } | null = null;

function getUpstashLimiter(limit: number, windowSec: number): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (
    upstashLimiterCache &&
    upstashLimiterCache.limit === limit &&
    upstashLimiterCache.window === windowSec
  ) {
    return upstashLimiterCache.rl;
  }

  const redis = new Redis({ url, token });
  const rl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    analytics: false,
    prefix: "biggdate:rl",
  });
  upstashLimiterCache = { limit, window: windowSec, rl };
  return rl;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export async function checkRateLimit(
  scope: string,
  identifier: string,
  opts: { limit: number; windowSec: number },
): Promise<RateLimitResult> {
  const key = `${scope}:${identifier}`;
  const upstash = getUpstashLimiter(opts.limit, opts.windowSec);

  if (upstash) {
    const result = await upstash.limit(key);
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  }

  return memoryRateLimit(key, opts.limit, opts.windowSec);
}

/**
 * Best-effort IP extraction from a request. Vercel sets x-forwarded-for;
 * other proxies may use x-real-ip. Falls back to a stable string so
 * unidentified clients all share a single bucket (intentional — that bucket
 * gets rate-limited fast).
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function rateLimitResponse(result: RateLimitResult): Response {
  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  return new Response(
    JSON.stringify({
      error: "Too many attempts. Please wait a moment and try again.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Remaining": String(result.remaining),
      },
    },
  );
}
