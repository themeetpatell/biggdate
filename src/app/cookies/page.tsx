import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy · BiggDate",
  description: "Which cookies and trackers BiggDate uses, and how to control them.",
};

const LAST_UPDATED = "2026-05-17";

export default function CookiesPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
      style={{ color: "var(--bd-text)" }}
    >
      <h1 className="mb-2 text-3xl font-light tracking-tight">Cookie Policy</h1>
      <p className="mb-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        Last updated: {LAST_UPDATED}
      </p>

      <Section title="What cookies are">
        <p>
          Cookies and similar technologies (localStorage, sessionStorage,
          pixels, SDKs) store small pieces of data in your browser. We use
          them only as described below. You can change your choices any time
          from the cookie banner or Settings → Privacy.
        </p>
      </Section>

      <Section title="Essential — always on">
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Supabase auth cookies</strong> — keep you signed in.</li>
          <li><strong>CSRF / session tokens</strong> — protect against cross-site attacks.</li>
          <li><strong>Consent record</strong> (<code>bd_analytics_consent</code> in localStorage) — remembers your cookie choice so we don&apos;t ask every visit.</li>
          <li><strong>Rate-limit identifiers</strong> — abuse prevention on authentication and messaging endpoints.</li>
        </ul>
        <p className="mt-3">
          These are strictly necessary to operate the Service and cannot be
          turned off without breaking sign-in or safety features.
        </p>
      </Section>

      <Section title="Analytics — only after you opt in">
        <p className="mb-3">
          The trackers below are loaded <strong>only</strong> after you accept
          analytics in the cookie banner. We use them to understand which
          parts of BiggDate are used and where people get stuck.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Google Tag Manager / Google Analytics</strong> — aggregated traffic and event analytics.</li>
          <li><strong>Meta Pixel</strong> — conversion measurement for marketing campaigns.</li>
          <li><strong>Microsoft Clarity</strong> — session-replay-style product analytics. Sensitive inputs are masked.</li>
          <li><strong>Vercel Analytics</strong> — first-party page-view analytics (cookieless).</li>
        </ul>
      </Section>

      <Section title="How to control cookies">
        <ul className="list-disc space-y-2 pl-6">
          <li>Use the cookie banner shown on first visit, or open Settings → Privacy → &quot;Manage cookie choices&quot;.</li>
          <li>Most browsers let you block or delete cookies in their settings. Blocking essential cookies will sign you out and may break the Service.</li>
          <li>You can opt out of Google Analytics with the Google Analytics opt-out browser add-on, and out of Meta tracking via your Meta ad preferences.</li>
        </ul>
      </Section>

      <Section title="Do Not Track and Global Privacy Control">
        <p>
          We respect the Global Privacy Control (GPC) signal. If your browser
          sends GPC, we treat it as a request to opt out of analytics and
          marketing tracking automatically.
        </p>
      </Section>

      <p className="mt-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        See also:{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>
        {" · "}
        <a href="/terms" className="underline">Terms of Service</a>
        .
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-medium">{title}</h2>
      <div style={{ color: "var(--bd-text-muted)" }}>{children}</div>
    </section>
  );
}
