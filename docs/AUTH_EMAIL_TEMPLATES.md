# Auth Email Templates

These emails are sent by Supabase Auth. If Resend is integrated directly in Supabase, the actual HTML/subject lines should live in the Supabase dashboard email settings.

## Known-Good Setup

Before blaming the HTML, verify the delivery path:

- In Supabase, `Authentication -> Email Templates`, keep the confirmation and recovery templates on Supabase placeholders like `{{ .ConfirmationURL }}`.
- In Supabase, `Authentication -> SMTP Settings` or the Resend integration, confirm the sender uses a Resend-verified domain such as `auth@biggdate.com`.
- In Resend, confirm the domain is fully verified and the API key used by Supabase is current.
- In Supabase Auth logs, inspect the exact provider response. `401` usually means a bad key, `403` usually means sender/domain mismatch, and `429` usually means a rate limit.
- Use simple table-based HTML with inline styles. Avoid relying on `flex`, gradients, external fonts, scripts, or complex CSS.

These local HTML files in [`docs/email-templates/`](/Users/themeetpatel/Startups/biggdate/docs/email-templates) are the safe versions to paste into Supabase.

Tone target:
- funny
- loving
- lightly roasting
- caring
- still trustworthy enough for auth

## What Dating Apps Tend To Send

Observed category patterns after reviewing dating-app brand/support material:

- `Hinge`: anti-swipe, anti-game, story-led copy. The tone is usually “dating can feel broken, here’s a more human way.” Good for BiggDate because we also sell context over chaos.
- `Tinder`: punchy, playful, self-aware, and built around quirks and momentum. Good reminder that the category performs better when copy sounds like a person, not a compliance department.
- `OkCupid`: question-led, values-forward, and identity-explicit. Good for any email that should feel smart, specific, or belief-driven.
- `Bumble`: empowerment, first-move energy, and utility-driven notifications. Good for action emails like new match, reply now, or profile-complete nudges.

What to copy from the category:

- make the subject line do real work
- keep one dominant CTA
- write like a person with taste
- tie the email to a clear user moment
- mix emotional signal with product utility

What not to copy:

- vague “you have updates” subjects
- generic corporate safety language
- over-designed fluff with no action
- teasing a benefit without a concrete next step

## BiggDate Lifecycle Emails

These are not Supabase auth defaults. They are additional product/lifecycle emails inspired by what major dating apps tend to emphasize.

### Welcome / Finish Your Profile

#### Subject
`You’re in. Now give us something better than “just ask.”`

#### Preview Text
`Your profile is where the good decisions start.`

#### Body Copy

Hi,

Welcome to BiggDate.

You’ve done the easy part: made an account.
Now do the part that separates you from the digital wallpaper.

Finish your profile so we can understand how you actually date:
- your pace
- your standards
- your life architecture
- the things that make you feel safe, seen, or immediately exhausted

This takes a few minutes and saves you from hours of nonsense.

#### CTA
`Finish my profile`

### New Match Ready

#### Subject
`A new match is ready. They seem emotionally literate.`

#### Preview Text
`We found someone who may actually fit your life.`

#### Body Copy

Hi,

A new BiggDate match is ready for you.

Not in the “you both own sneakers and breathe oxygen” way.
In the more useful way.

This one looks promising because your pace, communication style, and real-life rhythms don’t seem built to annoy each other by Tuesday.

Go look while the signal is fresh.

#### CTA
`See my match`

### Reply Nudge

#### Subject
`Your match replied. Don’t make this weird.`

#### Preview Text
`Momentum is attractive. Vanishing is not.`

#### Body Copy

Hi,

You’ve got a reply waiting.

This is your gentle reminder that chemistry is good, but follow-through is hotter.

Open the app, read the message, and keep the energy alive before this turns into another “we had potential” museum exhibit.

#### CTA
`Reply now`

### Maahi Check-In

#### Subject
`Maahi has notes. You may want to hear them.`

#### Preview Text
`A quick read on your match, your pattern, or your next move.`

#### Body Copy

Hi,

Maahi has a fresh take for you.

It might be about:
- a match you’re overthinking
- a pattern you keep repeating
- a better way to open, reply, or step back

Basically: less spiraling, more signal.

#### CTA
`Open Maahi`

### Date Nudge

#### Subject
`You’ve talked enough. Go be hot in person.`

#### Preview Text
`If the vibe is real, it deserves an actual plan.`

#### Body Copy

Hi,

You and your match have enough signal to stop collecting screenshots and start collecting a memory.

If you’re both still here, still replying, and still curious, this is your nudge to set the date before the momentum gets murdered by the workweek.

#### CTA
`Plan the date`

### Re-Engagement

#### Subject
`Come back. Your last app clearly wasn’t helping.`

#### Preview Text
`We still believe your dating life can be better than this.`

#### Body Copy

Hi,

You’ve been away for a bit.

We’re not here to guilt you.
We’re here because your romantic future deserves better than:
- dead-end chats
- blank bios
- people whose whole personality is “seen at 9:14 PM”

Come back when you want a dating app that actually respects context.

#### CTA
`Come back to BiggDate`

## Confirm Signup

### Subject
`Welcome to BiggDate. Your love life asked us to verify this.`

### Preview Text
`One click and you’re in. Your situationship with bad dating decisions can end here.`

### Body Copy

Hi there,

You just made an account on BiggDate, which is already one of the better romantic decisions on the internet today.

Before we let you in, we need to confirm this email belongs to you and not:
- your ex
- your friend “just looking around”
- the version of you that still says “maybe Hinge will surprise me”

Click the button below to confirm your email and get started.

After that, you’ll head into onboarding, where Maahi helps turn your emotional chaos into something actually useful.

With care, good taste, and very little tolerance for terrible dating apps,  
BiggDate

### CTA
`Confirm my email`

### Suggested HTML

```html
<div style="margin:0;padding:0;background:#070914;font-family:Inter,system-ui,sans-serif;color:#f5f1ea;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="border:1px solid rgba(182,104,255,0.22);background:linear-gradient(180deg,#0d1326 0%,#090d18 100%);border-radius:28px;padding:40px 32px;box-shadow:0 24px 80px rgba(0,0,0,0.45);">
      <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(212,104,138,0.10);border:1px solid rgba(212,104,138,0.18);font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#f19bc5;font-weight:700;">
        BiggDate Access
      </div>
      <h1 style="margin:24px 0 16px;font-size:36px;line-height:1.05;letter-spacing:-0.04em;color:#f5f1ea;">
        Welcome to BiggDate.
        <span style="display:block;background:linear-gradient(90deg,#7b9fff,#b06df7,#d4688a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
          Your love life asked us to verify this.
        </span>
      </h1>
      <p style="margin:0 0 18px;font-size:18px;line-height:1.7;color:#b6c3de;">
        You just made an account on BiggDate, which is already one of the better romantic decisions on the internet today.
      </p>
      <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#8ea0c2;">
        Before we let you in, we need to confirm this email belongs to you and not your ex, your friend “just looking around,” or the version of you that still thinks bad apps deserve one more chance.
      </p>
      <div style="margin:30px 0;">
        <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:16px 26px;border-radius:999px;text-decoration:none;font-size:16px;font-weight:700;color:#ffffff;background:linear-gradient(90deg,#7b9fff 0%,#a87cdb 50%,#d4688a 100%);box-shadow:0 18px 44px rgba(160,110,240,0.30);">
          Confirm my email
        </a>
      </div>
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#8ea0c2;">
        After that, you’ll head into onboarding, where Maahi helps turn your emotional chaos into something actually useful.
      </p>
      <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#6f7f9d;">
        With care, good taste, and very little tolerance for terrible dating apps,<br />
        BiggDate
      </p>
    </div>
  </div>
</div>
```

## Reset Password

### Subject
`Reset your password. Not your standards.`

### Preview Text
`One link. New password. Same suspiciously good taste in people.`

### Body Copy

Hi,

You asked to reset your BiggDate password. Mature. Responsible. Slightly unexpected, but we support growth.

Click below to create a new password.

If this was not you, you can safely ignore this email. No one gets access just because they flirted with your inbox.

Go fix the password. Keep the standards.

Love,  
BiggDate

### CTA
`Reset password`

### Suggested HTML

```html
<div style="margin:0;padding:0;background:#070914;font-family:Inter,system-ui,sans-serif;color:#f5f1ea;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="border:1px solid rgba(123,159,255,0.22);background:linear-gradient(180deg,#0d1326 0%,#090d18 100%);border-radius:28px;padding:40px 32px;box-shadow:0 24px 80px rgba(0,0,0,0.45);">
      <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(123,159,255,0.10);border:1px solid rgba(123,159,255,0.18);font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#9db7ff;font-weight:700;">
        Password Reset
      </div>
      <h1 style="margin:24px 0 16px;font-size:36px;line-height:1.05;letter-spacing:-0.04em;color:#f5f1ea;">
        Reset your password.
        <span style="display:block;background:linear-gradient(90deg,#7b9fff,#a87cdb,#d4688a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
          Not your standards.
        </span>
      </h1>
      <p style="margin:0 0 18px;font-size:18px;line-height:1.7;color:#b6c3de;">
        You asked to reset your BiggDate password. Mature. Responsible. Slightly unexpected, but we support growth.
      </p>
      <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#8ea0c2;">
        Click below to create a new password and get back in.
      </p>
      <div style="margin:30px 0;">
        <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:16px 26px;border-radius:999px;text-decoration:none;font-size:16px;font-weight:700;color:#ffffff;background:linear-gradient(90deg,#7b9fff 0%,#a87cdb 50%,#d4688a 100%);box-shadow:0 18px 44px rgba(160,110,240,0.30);">
          Reset password
        </a>
      </div>
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#8ea0c2;">
        If this wasn’t you, you can ignore this email. No one gets access just because they showed initiative.
      </p>
      <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#6f7f9d;">
        Go fix the password. Keep the standards.<br />
        BiggDate
      </p>
    </div>
  </div>
</div>
```

## Magic Link / Login Link

### Subject
`Your BiggDate entry pass is here.`

### Preview Text
`Tap once. Re-enter your better dating era.`

### Body Copy

Hi,

Here’s your secure sign-in link to BiggDate.

Click below and we’ll let you back into your account, your match context, and your emotionally literate future.

If you didn’t ask for this, ignore it. Someone may miss you, but they still can’t log in as you.

### CTA
`Sign me in`

## Sources Studied

- Hinge campaign analysis: https://www.gwi.com/blog/campaign-of-the-month/hinge/
- Tinder campaign analysis: https://www.marketingdive.com/news/campaign-trail-tinder-embraces-users-quirks-in-first-work-from-new-aor/611647/
- OkCupid values-led campaign summary: https://www.globaldatinginsights.com/news/okcupid-introduces-ask-yourself-marketing-campaign/
- Bumble notification patterns: https://support.bumble.com/hc/articles/28536417447837-Managing-notifications
- OkCupid notification settings/help: https://okcupid-app.zendesk.com/hc/en-us/articles/22981193944091-Editing-email-subscriptions-notifications
- Bumble feature-notification example via “Dates, powered by Bee”: https://support.bumble.com/hc/en-us/articles/34865026348701-Using-Dates-powered-by-Bee
