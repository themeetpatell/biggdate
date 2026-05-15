import * as Sentry from "@sentry/nextjs";

// Production-required env vars. Missing values cause boot to fail (see
// reportEnvHealth below) so misconfigured deploys are visible in deploy logs
// instead of producing silent 503s at request time.
//
// The list is built dynamically so early-access mode doesn't demand Stripe
// secrets that aren't in use, and Stripe mode doesn't demand a coupon list.

const BASE_REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_DB_URL",
  "NEXT_PUBLIC_APP_URL",
  "GEMINI_API_KEY",
  "RESEND_API_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "SIGHTENGINE_USER",
  "SIGHTENGINE_SECRET",
  "SENTRY_DSN",
  "ADMIN_USER_IDS",
  "INTERNAL_API_SECRET",
  "VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
] as const;

const STRIPE_REQUIRED = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"] as const;
const EARLY_ACCESS_REQUIRED = ["EARLY_ACCESS_CODES"] as const;

function resolveRequired(): readonly string[] {
  const billingMode = process.env.BILLING_MODE === "stripe" ? "stripe" : "early_access";
  return billingMode === "stripe"
    ? [...BASE_REQUIRED, ...STRIPE_REQUIRED]
    : [...BASE_REQUIRED, ...EARLY_ACCESS_REQUIRED];
}

function reportEnvHealth() {
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (!isProd) return;

  const required = resolveRequired();
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length === 0) {
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: "info", msg: "env health ok" }));
    return;
  }
  // Fail fast on boot so Vercel surfaces the misconfiguration in the deploy
  // logs instead of letting the app respond with silent 503s at request time.
  // Set ALLOW_MISSING_ENV=1 only for one-off recovery boots; never in normal
  // production rollouts.
  console.error(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "error",
      msg: "env health: missing required vars — refusing to boot",
      missing,
    }),
  );
  if (process.env.ALLOW_MISSING_ENV !== "1") {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
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
