import * as Sentry from "@sentry/nextjs";

/**
 * Browser-side Sentry init. No-op when DSN is not set.
 * Note: only PII-safe fields should ever leak into Sentry; we set
 * sendDefaultPii = false and rely on explicit captures from log.error.
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.1",
    ),
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
    environment:
      process.env.NEXT_PUBLIC_VERCEL_ENV ||
      process.env.NODE_ENV ||
      "development",
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
