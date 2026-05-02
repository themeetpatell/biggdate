import * as Sentry from "@sentry/nextjs";

// Production-required env vars. Missing values are logged once at boot so
// misconfigured deploys are visible in logs instead of failing silently at
// request time (e.g. Sentry not capturing, Stripe webhooks 503'ing,
// rate-limiter falling back to in-memory).
const PROD_REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_DB_URL",
  "NEXT_PUBLIC_APP_URL",
  "GEMINI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "SIGHTENGINE_USER",
  "SIGHTENGINE_SECRET",
  "SENTRY_DSN",
  "ADMIN_USER_IDS",
] as const;

function reportEnvHealth() {
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (!isProd) return;

  const missing = PROD_REQUIRED.filter((name) => !process.env[name]);
  if (missing.length === 0) {
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: "info", msg: "env health ok" }));
    return;
  }
  console.warn(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "warn",
      msg: "env health: missing required vars",
      missing,
    }),
  );
}

/**
 * Next.js instrumentation entry. Runs once per Node/Edge server boot.
 * No-op when SENTRY_DSN is not set (local dev, preview without tracing).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    reportEnvHealth();
  }

  if (!process.env.SENTRY_DSN) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
      release: process.env.VERCEL_GIT_COMMIT_SHA,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
      release: process.env.VERCEL_GIT_COMMIT_SHA,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
