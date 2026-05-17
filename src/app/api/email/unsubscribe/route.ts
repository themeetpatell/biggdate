import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { setNotificationPreference } from "@/lib/repo";
import { track } from "@/lib/analytics";
import { log } from "@/lib/log";

// One-click unsubscribe. Signed link in the daily email footer. We verify the
// HMAC server-side so a leaked token can only unsubscribe the user it was
// minted for, and only for the kind the signature covers.
//
// GET  → user clicked the link in the email; flip pref + show a styled page.
// POST → mailbox provider RFC 8058 one-click unsubscribe path. Same body,
//        plaintext response.

// Map of unsubscribe-link kind → key in profiles.notification_preferences.
// Each kind we mint a signed link for here must have a corresponding pref key
// — otherwise the unsubscribe is silently no-op and the user keeps getting
// emails. CAN-SPAM § 5(a)(3) + GDPR R64 + DPDPA § 7 require the opt-out to
// actually take effect within ten business days; we honour it immediately.
const KIND_TO_PREF_KEY: Record<string, string> = {
  daily_soul_email: "dailyEmail",
  match_ready: "matchReady",
  soul_knock: "soulKnock",
  mutual_match: "mutualMatch",
};

const KNOWN_KINDS = new Set<string>(Object.keys(KIND_TO_PREF_KEY));

function getSecret(): string {
  return (
    process.env.EMAIL_UNSUBSCRIBE_SECRET ||
    process.env.INTERNAL_API_SECRET ||
    process.env.CRON_SECRET ||
    ""
  );
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

function verifyToken(userId: string, kind: string, sig: string): boolean {
  const secret = getSecret();
  if (!secret) return false;
  const expected = createHmac("sha256", secret)
    .update(`${userId}:${kind}`)
    .digest("base64url");
  return safeEqual(expected, sig);
}

async function handle(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const userId = url.searchParams.get("u") || "";
  const kind = url.searchParams.get("k") || "";
  const sig = url.searchParams.get("s") || "";

  if (!userId || !kind || !sig) {
    return html(400, errorPage("Invalid unsubscribe link", "This link is missing required parameters."));
  }
  if (!KNOWN_KINDS.has(kind)) {
    return html(400, errorPage("Unknown unsubscribe kind", "This unsubscribe link refers to something we no longer recognize."));
  }
  if (!verifyToken(userId, kind, sig)) {
    log.warn("email unsubscribe: bad signature", { userId, kind });
    return html(403, errorPage("This link can't be verified", "Please use the link from your most recent email."));
  }

  const prefKey = KIND_TO_PREF_KEY[kind] ?? kind;
  try {
    await setNotificationPreference(userId, prefKey, false);
    await track({
      name: "email_unsubscribed",
      userId,
      properties: { kind, source: req.method === "POST" ? "rfc8058" : "click" },
    });
  } catch (err) {
    log.error("email unsubscribe: write failed", err, { userId, kind });
    return html(500, errorPage("Couldn't update preferences", "Please try again in a moment, or open settings to opt out manually."));
  }

  if (req.method === "POST") {
    return new NextResponse("ok", { status: 200, headers: { "content-type": "text/plain" } });
  }
  return html(200, successPage());
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}

function html(status: number, body: string): NextResponse {
  return new NextResponse(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function shell(title: string, accent: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — BiggDate</title>
  <style>
    html, body { margin:0; padding:0; background:#0a0a0a; color:#fff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
    .card { max-width:480px; margin:80px auto; padding:32px 28px; background:#111; border-radius:18px; }
    h1 { margin:0 0 12px; font-size:22px; }
    p  { margin:0 0 18px; color:#bdbdc9; line-height:1.6; font-size:15px; }
    .accent { color: ${accent}; font-weight:600; }
    a.btn { display:inline-block; margin-top:8px; padding:12px 22px; border-radius:10px; background:#a855f7; color:#fff; text-decoration:none; font-weight:600; font-size:14px; }
    a.link { color:#a855f7; text-decoration:none; }
    .foot { margin-top:24px; font-size:12px; color:#666; }
  </style>
</head>
<body>
  <div class="card">${body}</div>
</body>
</html>`;
}

function successPage(): string {
  return shell(
    "Unsubscribed",
    "#a855f7",
    `
    <p class="accent" style="font-size:13px;letter-spacing:1px;text-transform:uppercase;">BiggDate</p>
    <h1>You're off the daily list.</h1>
    <p>No more daily Soul Knock emails. You'll still get the important stuff — Soul Knocks, mutual matches, and replies — unless you turn those off too.</p>
    <a class="btn" href="/settings">Manage all preferences</a>
    <p class="foot">Changed your mind? Re-enable daily emails any time from settings.</p>
    `,
  );
}

function errorPage(title: string, message: string): string {
  return shell(
    title,
    "#fb7185",
    `
    <p class="accent" style="color:#fb7185;font-size:13px;letter-spacing:1px;text-transform:uppercase;">BiggDate</p>
    <h1>${title}.</h1>
    <p>${message}</p>
    <p><a class="link" href="/settings">Open settings to manage preferences</a></p>
    `,
  );
}
