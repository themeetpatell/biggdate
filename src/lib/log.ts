/**
 * Lightweight structured logger. Writes JSON lines to stdout/stderr so Vercel's
 * log drain (or any aggregator like Logtail, Datadog, Better Stack) can parse
 * and index them. `log.error` also forwards to Sentry when SENTRY_DSN is set.
 */

import * as Sentry from "@sentry/nextjs";

type Level = "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function emit(level: Level, message: string, payload?: LogPayload) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const log = {
  info: (message: string, payload?: LogPayload) => emit("info", message, payload),
  warn: (message: string, payload?: LogPayload) => emit("warn", message, payload),
  error: (message: string, error?: unknown, payload?: LogPayload) => {
    const errPayload =
      error instanceof Error
        ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
        : { error };
    emit("error", message, { ...errPayload, ...payload });

    // Forward to Sentry. The Sentry SDK is a no-op when DSN is unset, so
    // this safely does nothing in dev / unconfigured environments.
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: { message, ...payload } });
    } else {
      Sentry.captureMessage(message, {
        level: "error",
        extra: { error, ...payload },
      });
    }
  },
};
