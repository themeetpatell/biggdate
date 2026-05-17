// Daily Soul Knock email — 7 day-of-week variants in Maahi's voice.
//
// Each variant is a self-contained {subject, preheader, html, text} bundle.
// Personalization is best-effort: missing context falls back to a generic
// phrasing that still earns the open. The hierarchy:
//   1. dayOfWeek picks the emotional register (Sun = reflect, Mon = decide,
//      Tue = curated, Wed = direct, Thu = forward, Fri = playful, Sat = deep).
//   2. pendingIntros and topMatchName change the CTA target/copy *within* the
//      day's voice.
//
// Keep this file pure: NO database calls, NO Resend calls. The caller (the
// cron job in lib/jobs/daily-soul-email.ts) gathers context and routes the
// send. That isolation makes the templates trivial to preview / snapshot test.

export type DailyEmailDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday … 6 = Saturday

export interface DailyEmailContext {
  firstName: string;
  // Number of intros sent TO the user that they have NOT answered yet.
  pendingIntros: number;
  // Top cached match for today, if available.
  topMatchName: string | null;
  topMatchId: string | null;
  appUrl: string;        // e.g. "https://biggdate.app"
  unsubscribeUrl: string; // fully-qualified one-click unsubscribe URL
  dayOfWeek: DailyEmailDay;
}

export interface RenderedDailyEmail {
  subject: string;
  preheader: string;
  html: string;
  text: string;
  variant: string;
}

interface DayContent {
  variant: string;
  subject: (ctx: DailyEmailContext) => string;
  preheader: (ctx: DailyEmailContext) => string;
  heading: (ctx: DailyEmailContext) => string;
  body: (ctx: DailyEmailContext) => string;
  ctaLabel: (ctx: DailyEmailContext) => string;
  ctaUrl: (ctx: DailyEmailContext) => string;
  textBody: (ctx: DailyEmailContext) => string;
}

function pendingPhrase(n: number): string {
  if (n <= 0) return "";
  if (n === 1) return "1 person is waiting on you";
  return `${n} people are waiting on you`;
}

// Sunday — reflection.
const SUNDAY: DayContent = {
  variant: "sun_reflect_v1",
  subject: () => "What kind of week are you building?",
  preheader: () => "Sunday is for soul work. Open one Soul Knock today.",
  heading: ({ firstName }) => `Soul check-in, ${firstName}.`,
  body: ({ topMatchName, pendingIntros }) => {
    const tail = pendingIntros > 0
      ? `Someone already knocked on your door this week — ${pendingPhrase(pendingIntros)}. A real answer takes 60 seconds.`
      : topMatchName
        ? `Maahi has someone on her mind for you: ${escape(topMatchName)}. Worth a slow read this morning.`
        : `One Soul Knock — to someone you've already paused over — is enough.`;
    return [
      "The week ahead isn't a swipe count. It's a small handful of intentional moves.",
      tail,
    ].join("<br/><br/>");
  },
  ctaLabel: ({ pendingIntros }) => (pendingIntros > 0 ? "Answer the knock" : "See My Matches"),
  ctaUrl: ({ appUrl }) => `${appUrl}/matches`,
  textBody: ({ firstName, pendingIntros, topMatchName, appUrl }) => {
    const tail = pendingIntros > 0
      ? `${pendingPhrase(pendingIntros)}. A real answer takes 60 seconds.`
      : topMatchName
        ? `Maahi has someone on her mind for you: ${topMatchName}.`
        : "One Soul Knock — to someone you've already paused over — is enough.";
    return `Soul check-in, ${firstName}.

The week ahead isn't a swipe count. It's a small handful of intentional moves.

${tail}

Open BiggDate: ${appUrl}/matches`;
  },
};

// Monday — single-action energy.
const MONDAY: DayContent = {
  variant: "mon_decide_v1",
  subject: () => "One Soul Knock could change next weekend",
  preheader: () => "Mondays are made for one good decision.",
  heading: ({ firstName }) => `Mondays are quiet, ${firstName}.`,
  body: ({ topMatchName }) => {
    const tail = topMatchName
      ? `${escape(topMatchName)} is in your matches today. You don't need a perfect opener — just a real question.`
      : `Your matches are waiting. You don't need a perfect opener — just a real question.`;
    return [
      "Every dating story starts with someone deciding to send the message.",
      tail,
    ].join("<br/><br/>");
  },
  ctaLabel: () => "Pick a Match",
  ctaUrl: ({ appUrl }) => `${appUrl}/matches`,
  textBody: ({ firstName, topMatchName, appUrl }) => {
    const tail = topMatchName
      ? `${topMatchName} is in your matches today. You don't need a perfect opener — just a real question.`
      : "Your matches are waiting. You don't need a perfect opener — just a real question.";
    return `Mondays are quiet, ${firstName}.

Every dating story starts with someone deciding to send the message.

${tail}

${appUrl}/matches`;
  },
};

// Tuesday — curated, "Maahi was thinking about you."
const TUESDAY: DayContent = {
  variant: "tue_curated_v1",
  subject: ({ topMatchName }) =>
    topMatchName
      ? `Maahi was thinking about you and ${truncate(topMatchName, 18)}`
      : "Maahi was thinking about you",
  preheader: () => "Today's curation is ready.",
  heading: ({ firstName, topMatchName }) =>
    topMatchName ? `${firstName}, meet ${escape(topMatchName)}.` : `Today's pick is in, ${firstName}.`,
  body: ({ topMatchName }) => {
    if (topMatchName) {
      return [
        `Maahi picked ${escape(topMatchName)} for you this morning — they showed up high on your compatibility scan and they haven't been seen by everyone in your city.`,
        `Profiles like theirs don't stay quiet for long. Read them today.`,
      ].join("<br/><br/>");
    }
    return [
      `Maahi refreshed your matches overnight. There's a profile in there she'd quietly bet on for you.`,
      `Five minutes of real reading beats an hour of scrolling.`,
    ].join("<br/><br/>");
  },
  ctaLabel: ({ topMatchName }) =>
    topMatchName ? `See ${truncate(topMatchName, 14)}` : "See Today's Pick",
  ctaUrl: ({ appUrl, topMatchId }) =>
    topMatchId ? `${appUrl}/matches/${encodeURIComponent(topMatchId)}/preview` : `${appUrl}/matches`,
  textBody: ({ firstName, topMatchName, appUrl, topMatchId }) => {
    const url = topMatchId ? `${appUrl}/matches/${topMatchId}/preview` : `${appUrl}/matches`;
    if (topMatchName) {
      return `${firstName}, meet ${topMatchName}.

Maahi picked them for you this morning — high on your compatibility scan.
Profiles like theirs don't stay quiet for long.

${url}`;
    }
    return `Today's pick is in, ${firstName}.

Maahi refreshed your matches overnight. Five minutes of real reading beats an hour of scrolling.

${url}`;
  },
};

// Wednesday — direct midweek pulse.
const WEDNESDAY: DayContent = {
  variant: "wed_pulse_v1",
  subject: ({ pendingIntros }) =>
    pendingIntros > 0 ? pendingPhrase(pendingIntros) : "What's stopping you?",
  preheader: ({ pendingIntros }) =>
    pendingIntros > 0
      ? "Open the thread — it's been quiet on their side."
      : "Midweek check-in from Maahi.",
  heading: ({ firstName, pendingIntros }) =>
    pendingIntros > 0
      ? `${firstName}, ${pendingPhrase(pendingIntros).toLowerCase()}.`
      : `Midweek check-in, ${firstName}.`,
  body: ({ pendingIntros }) => {
    if (pendingIntros > 0) {
      return [
        `Soul Knocks don't expire — but momentum does. Someone took the leap to ask you something real. A real answer back is what unlocks the chat.`,
        `If the question doesn't land for you, tell them why. The pass note is also a kind of answer.`,
      ].join("<br/><br/>");
    }
    return [
      `Midweek is when most people drift. The ones who don't are usually the ones who picked one person yesterday and followed through today.`,
      `Pick one match. Ask one real question. That's the entire move.`,
    ].join("<br/><br/>");
  },
  ctaLabel: ({ pendingIntros }) => (pendingIntros > 0 ? "Answer them" : "Pick a Match"),
  ctaUrl: ({ appUrl }) => `${appUrl}/matches`,
  textBody: ({ firstName, pendingIntros, appUrl }) => {
    if (pendingIntros > 0) {
      return `${firstName}, ${pendingPhrase(pendingIntros).toLowerCase()}.

Soul Knocks don't expire — but momentum does. Someone asked you something real. Answer it.

${appUrl}/matches`;
    }
    return `Midweek check-in, ${firstName}.

Midweek is when most people drift. Pick one match. Ask one real question.

${appUrl}/matches`;
  },
};

// Thursday — forward planning.
const THURSDAY: DayContent = {
  variant: "thu_plan_v1",
  subject: () => "Make Saturday count",
  preheader: () => "Send one Soul Knock today; have a real plan by Friday.",
  heading: ({ firstName }) => `${firstName}, the weekend is a planning problem.`,
  body: ({ topMatchName, pendingIntros }) => {
    const opener = pendingIntros > 0
      ? `${pendingPhrase(pendingIntros)}. If even one of them lands, Saturday gets interesting.`
      : topMatchName
        ? `${escape(topMatchName)} sits in your matches. A Soul Knock today gives them a full day to answer before the weekend.`
        : `Pick one person from your matches and send one Soul Knock. A full day's lead time is all the difference between Saturday and Sunday plans.`;
    return [
      "Connections that turn into Saturdays start on Thursday — that's how the math works.",
      opener,
    ].join("<br/><br/>");
  },
  ctaLabel: ({ pendingIntros }) => (pendingIntros > 0 ? "Open Chats" : "Pick a Match"),
  ctaUrl: ({ appUrl, pendingIntros }) =>
    pendingIntros > 0 ? `${appUrl}/messages` : `${appUrl}/matches`,
  textBody: ({ firstName, pendingIntros, topMatchName, appUrl }) => {
    const url = pendingIntros > 0 ? `${appUrl}/messages` : `${appUrl}/matches`;
    const opener = pendingIntros > 0
      ? `${pendingPhrase(pendingIntros)}.`
      : topMatchName
        ? `${topMatchName} sits in your matches.`
        : "Pick one person and send one Soul Knock.";
    return `${firstName}, the weekend is a planning problem.

Connections that turn into Saturdays start on Thursday.

${opener}

${url}`;
  },
};

// Friday — playful, evening-energy.
const FRIDAY: DayContent = {
  variant: "fri_energy_v1",
  subject: () => "Tonight could be the start of something",
  preheader: () => "Don't ghost yourself. Open one conversation.",
  heading: ({ firstName }) => `${firstName}, it's Friday.`,
  body: ({ pendingIntros, topMatchName }) => {
    const middle = pendingIntros > 0
      ? `You've already got ${pendingPhrase(pendingIntros).toLowerCase()}. That's a head start most people would kill for.`
      : topMatchName
        ? `${escape(topMatchName)} is sitting in your matches. Most great first conversations happen because someone simply showed up.`
        : `Most great first conversations happen because someone simply showed up.`;
    return [
      "Most weeks end in a quiet inbox. This one doesn't have to.",
      middle,
      `Send one message that feels true. Maahi will hold the rest.`,
    ].join("<br/><br/>");
  },
  ctaLabel: ({ pendingIntros }) => (pendingIntros > 0 ? "See Who's Waiting" : "See Who's Around"),
  ctaUrl: ({ appUrl }) => `${appUrl}/matches`,
  textBody: ({ firstName, pendingIntros, topMatchName, appUrl }) => {
    const middle = pendingIntros > 0
      ? `${pendingPhrase(pendingIntros)} — that's a head start.`
      : topMatchName
        ? `${topMatchName} is sitting in your matches.`
        : "Most great conversations happen because someone simply showed up.";
    return `${firstName}, it's Friday.

Most weeks end in a quiet inbox. This one doesn't have to.

${middle}

${appUrl}/matches`;
  },
};

// Saturday — slow, deep reads.
const SATURDAY: DayContent = {
  variant: "sat_deep_v1",
  subject: () => "Slow morning, real reads",
  preheader: () => "One profile worth your full attention.",
  heading: ({ firstName }) => `Saturdays were made for this, ${firstName}.`,
  body: ({ topMatchName }) => {
    const middle = topMatchName
      ? `Start with ${escape(topMatchName)}. Read the soul section twice. Notice what they didn't say — that's usually where the good Soul Knock lives.`
      : `Pick the profile that made you pause yesterday and didn't get a response from you. Read the soul section twice.`;
    return [
      "There's no algorithm reward for speed-reading a profile. There's a real-life reward for noticing one specific thing and asking about it.",
      middle,
    ].join("<br/><br/>");
  },
  ctaLabel: () => "Read Deeply",
  ctaUrl: ({ appUrl, topMatchId }) =>
    topMatchId ? `${appUrl}/matches/${encodeURIComponent(topMatchId)}/preview` : `${appUrl}/matches`,
  textBody: ({ firstName, topMatchName, appUrl, topMatchId }) => {
    const url = topMatchId ? `${appUrl}/matches/${topMatchId}/preview` : `${appUrl}/matches`;
    const middle = topMatchName
      ? `Start with ${topMatchName}.`
      : "Pick the profile that made you pause yesterday.";
    return `Saturdays were made for this, ${firstName}.

There's no algorithm reward for speed-reading a profile. There's a real-life reward for noticing one specific thing and asking about it.

${middle}

${url}`;
  },
};

const DAYS: Record<DailyEmailDay, DayContent> = {
  0: SUNDAY,
  1: MONDAY,
  2: TUESDAY,
  3: WEDNESDAY,
  4: THURSDAY,
  5: FRIDAY,
  6: SATURDAY,
};

// ─── HTML chrome ────────────────────────────────────────────────────────────

function shell(opts: {
  preheader: string;
  heading: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  appUrl: string;
  unsubscribeUrl: string;
}): string {
  const { preheader, heading, bodyHtml, ctaLabel, ctaUrl, appUrl, unsubscribeUrl } = opts;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <!-- Hidden preheader -->
  <span style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;color:#0a0a0a;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${escape(preheader)}</span>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="480" cellpadding="0" cellspacing="0" role="presentation" style="background:#111;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="padding:32px 32px 0;text-align:center;">
            <span style="font-size:28px;">💜</span>
            <p style="margin:8px 0 0;color:#a855f7;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">BiggDate</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <h1 style="margin:0 0 12px;color:#fff;font-size:22px;font-weight:700;line-height:1.3;">${escape(heading)}</h1>
            <p style="margin:0 0 28px;color:#bdbdc9;font-size:15px;line-height:1.65;">${bodyHtml}</p>
            <a href="${ctaUrl}" style="display:inline-block;background:#a855f7;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600;">${escape(ctaLabel)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 32px;border-top:1px solid #222;">
            <p style="margin:0 0 8px;color:#666;font-size:12px;line-height:1.55;">
              You're getting this because daily nudges are on. We send one short note a day, never more.
            </p>
            <p style="margin:0;color:#555;font-size:12px;line-height:1.55;">
              <a href="${appUrl}/settings" style="color:#a855f7;text-decoration:none;">Manage preferences</a>
              &nbsp;·&nbsp;
              <a href="${unsubscribeUrl}" style="color:#777;text-decoration:underline;">Unsubscribe from daily emails</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

export function renderDailySoulEmail(ctx: DailyEmailContext): RenderedDailyEmail {
  const day = DAYS[ctx.dayOfWeek];
  const heading = day.heading(ctx);
  const bodyHtml = day.body(ctx);
  const html = shell({
    preheader: day.preheader(ctx),
    heading,
    bodyHtml,
    ctaLabel: day.ctaLabel(ctx),
    ctaUrl: day.ctaUrl(ctx),
    appUrl: ctx.appUrl,
    unsubscribeUrl: ctx.unsubscribeUrl,
  });
  return {
    subject: day.subject(ctx),
    preheader: day.preheader(ctx),
    html,
    text: `${day.textBody(ctx)}

—
Unsubscribe from daily emails: ${ctx.unsubscribeUrl}`,
    variant: day.variant,
  };
}
