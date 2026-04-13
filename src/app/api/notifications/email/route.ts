import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAccountHandleByUserId, getNotificationPreferences } from "@/lib/repo";

// Internal-only route — not exposed to the client
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || "Maahi from BiggDate <maahi@biggdate.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://biggdate.app";

type EmailEvent =
  | { event: "match_ready"; toUserId: string }
  | { event: "soul_knock_received"; toUserId: string; senderName: string; question: string }
  | { event: "soul_knock_answered"; toUserId: string; responderName: string }
  | { event: "mutual_match"; toUserId: string; otherName: string; threadId: string };

function buildEmail(body: EmailEvent, toEmail: string, toName: string) {
  switch (body.event) {
    case "match_ready":
      return {
        to: toEmail,
        subject: `Your matches are waiting, ${toName}`,
        html: emailHtml(
          `Your matches are waiting, ${toName}`,
          "Maahi has found people worth meeting. Head back to see who she picked for you today.",
          "See My Matches",
          `${APP_URL}/dashboard`,
        ),
      };
    case "soul_knock_received":
      return {
        to: toEmail,
        subject: `${body.senderName} sent you a Soul Knock`,
        html: emailHtml(
          `${body.senderName} wants to connect`,
          `They asked: <em>"${body.question}"</em><br/><br/>Answer their question to open the conversation.`,
          "Answer the Knock",
          `${APP_URL}/dashboard`,
        ),
      };
    case "soul_knock_answered":
      return {
        to: toEmail,
        subject: `${body.responderName} answered your question`,
        html: emailHtml(
          `${body.responderName} answered`,
          "They responded to your Soul Knock. Answer their question too to unlock the chat.",
          "See Their Answer",
          `${APP_URL}/dashboard`,
        ),
      };
    case "mutual_match":
      return {
        to: toEmail,
        subject: `You and ${body.otherName} are connected`,
        html: emailHtml(
          `You and ${body.otherName} are connected`,
          "Both of you answered each other's Soul Knock. Your chat is now open.",
          "Open Chat",
          `${APP_URL}/messages/${body.threadId}`,
        ),
      };
  }
}

function emailHtml(heading: string, body: string, ctaLabel: string, ctaUrl: string) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:32px 32px 0;text-align:center;">
            <span style="font-size:28px;">💜</span>
            <p style="margin:8px 0 0;color:#a855f7;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">BiggDate</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <h1 style="margin:0 0 12px;color:#fff;font-size:22px;font-weight:700;line-height:1.3;">${heading}</h1>
            <p style="margin:0 0 28px;color:#999;font-size:15px;line-height:1.6;">${body}</p>
            <a href="${ctaUrl}" style="display:inline-block;background:#a855f7;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600;">${ctaLabel}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 32px;border-top:1px solid #222;margin-top:24px;">
            <p style="margin:0;color:#555;font-size:12px;">You're receiving this because you have notifications enabled. <a href="${APP_URL}/settings" style="color:#a855f7;">Manage preferences</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  // Only callable server-side (no CORS, no auth token needed — it's internal)
  // Validate it's coming from our own origin
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && !origin.includes(host ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.RESEND_API_KEY) {
    // Silently skip in dev when key not configured
    return NextResponse.json({ skipped: true });
  }

  const body = (await req.json()) as EmailEvent;

  const handle = await getAccountHandleByUserId(body.toUserId);
  if (!handle?.email) {
    return NextResponse.json({ skipped: true, reason: "no email" });
  }

  const prefs = await getNotificationPreferences(body.toUserId);
  const prefKey =
    body.event === "match_ready" ? "matchReady" :
    body.event === "mutual_match" ? "mutualMatch" : "soulKnock";

  if (prefs[prefKey] === false) {
    return NextResponse.json({ skipped: true, reason: "opt-out" });
  }

  const toName = handle.fullName?.split(" ")[0] || "there";
  const email = buildEmail(body, handle.email, toName);

  await resend.emails.send({ from: FROM, ...email });

  return NextResponse.json({ sent: true });
}
