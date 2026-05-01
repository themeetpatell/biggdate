import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · BiggDate",
  description: "How BiggDate collects, uses, and protects your information.",
};

const LAST_UPDATED = "2026-05-01";

export default function PrivacyPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
      style={{ color: "var(--bd-text)" }}
    >
      <h1 className="mb-2 text-3xl font-light tracking-tight">Privacy Policy</h1>
      <p className="mb-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        Last updated: {LAST_UPDATED}
      </p>

      <Section title="1. Who we are">
        <p>
          BiggDate (&quot;we&quot;, &quot;us&quot;) is operated from India.
          Contact us at <a href="mailto:privacy@biggdate.com" className="underline">privacy@biggdate.com</a>.
        </p>
      </Section>

      <Section title="2. What we collect">
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Account data</strong> — email, full name, username, password (hashed).</li>
          <li><strong>Profile data</strong> — birthday, location, gender, photos, and the answers you give Maahi during onboarding.</li>
          <li><strong>Behavioral data</strong> — pages visited, matches sent, messages sent, dates logged.</li>
          <li><strong>Payment data</strong> — handled by Stripe; we never see your card number.</li>
          <li><strong>Device data</strong> — IP address, browser, basic device info, used for fraud prevention.</li>
        </ul>
      </Section>

      <Section title="3. How we use it">
        <ul className="list-disc space-y-2 pl-6">
          <li>To match you with compatible people based on your psychological profile.</li>
          <li>To run the AI features (Maahi, daily intentions, debriefs) using providers like Google Gemini.</li>
          <li>To send transactional emails (welcome, match notifications, security alerts).</li>
          <li>To detect abuse, fraud, and harmful behavior.</li>
          <li>To comply with legal obligations under India&apos;s Digital Personal Data Protection Act (DPDP).</li>
        </ul>
      </Section>

      <Section title="4. Who we share it with">
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Other users</strong> — visible profile fields are shown to people you match with.</li>
          <li><strong>Infrastructure providers</strong> — Supabase (database), Vercel (hosting), Stripe (payments), Resend (email), Google (AI).</li>
          <li><strong>Law enforcement</strong> — only when legally compelled.</li>
          <li>We do <strong>not</strong> sell your data to advertisers or data brokers.</li>
        </ul>
      </Section>

      <Section title="5. How long we keep it">
        <p>
          Account and profile data are retained as long as your account is active.
          You can delete your account at any time from Settings, which permanently
          erases your profile, photos, matches, and messages within 30 days.
        </p>
      </Section>

      <Section title="6. Your rights (DPDP / GDPR)">
        <ul className="list-disc space-y-2 pl-6">
          <li>Access — request a copy of your data.</li>
          <li>Correction — fix inaccurate information.</li>
          <li>Deletion — erase your account.</li>
          <li>Portability — get a machine-readable export.</li>
          <li>Withdraw consent — including for marketing emails.</li>
        </ul>
        <p className="mt-4">
          Email <a href="mailto:privacy@biggdate.com" className="underline">privacy@biggdate.com</a> to exercise any right.
        </p>
      </Section>

      <Section title="7. Age requirement">
        <p>
          BiggDate is for adults 18 and older. We do not knowingly collect data
          from anyone under 18. If you believe a minor has signed up, contact us
          and we will remove the account immediately.
        </p>
      </Section>

      <Section title="8. Security">
        <p>
          We use industry-standard encryption in transit (TLS) and at rest. No
          system is perfectly secure; if a breach occurs that affects you, we
          will notify you within 72 hours per DPDP requirements.
        </p>
      </Section>

      <Section title="9. Changes to this policy">
        <p>
          We&apos;ll notify you in-app and by email when we make material changes.
          Continued use after a change means you accept the updated policy.
        </p>
      </Section>

      <p className="mt-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        See also: <a href="/terms" className="underline">Terms of Service</a>.
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
