import { headers } from "next/headers";

export type NotificationEvent =
  | { event: "welcome"; toUserId: string }
  | { event: "match_ready"; toUserId: string }
  | {
      event: "soul_knock_received";
      toUserId: string;
      senderName: string;
      question: string;
    }
  | { event: "soul_knock_answered"; toUserId: string; responderName: string }
  | {
      event: "mutual_match";
      toUserId: string;
      otherName: string;
      threadId: string;
    };

/**
 * Fire-and-forget notification email send. Resolves the app's own origin from
 * request headers so this works in dev (localhost) and prod without config.
 *
 * Failures are swallowed by design — notifications are non-critical and must
 * never block the user-facing path that triggered them.
 */
export async function sendNotification(payload: NotificationEvent): Promise<void> {
  try {
    const h = await headers();
    const host = h.get("host");
    const protocol = host?.startsWith("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (host ? `${protocol}://${host}` : "");
    if (!baseUrl) return;

    await fetch(`${baseUrl}/api/notifications/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Notifications are best-effort. Never throw to the caller.
  }
}
