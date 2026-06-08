import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · BiggDate",
  description: "How BiggDate collects, uses, and protects your information.",
};

const LAST_UPDATED = "2026-05-17";

export default function PrivacyPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
      style={{ color: "var(--bd-text)" }}
    >
      <h1 className="mb-2 text-3xl font-light tracking-tight">Privacy Policy</h1>
      <p className="mb-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        Last updated: {LAST_UPDATED} · Effective: {LAST_UPDATED}
      </p>

      <Section title="1. Who we are">
        <p>
          BiggDate is operated by <strong>Aariv Patel</strong>, sole proprietor,
          trading as &quot;BiggDate&quot; (the &quot;Service&quot;, &quot;we&quot;, &quot;us&quot;).
          Principal place of business: [BUSINESS_ADDRESS — to be filled in],
          Ahmedabad, Gujarat, India.
        </p>
        <p className="mt-3">
          General contact: <a href="mailto:privacy@biggdate.com" className="underline">privacy@biggdate.com</a>.
          For statutory rights, complaints, or grievances see Section 12.
        </p>
      </Section>

      <Section title="2. Where we offer the Service">
        <p>
          BiggDate is intended for users in India, the United Arab Emirates,
          and the United States. <strong>We do not offer the Service in the
          European Economic Area (EEA), the United Kingdom, or Switzerland</strong>
          and we attempt to block sign-ups from those regions.
        </p>
        <p className="mt-3">
          If you are in the EEA, UK, or Switzerland and somehow created an
          account, email us at <a href="mailto:privacy@biggdate.com" className="underline">privacy@biggdate.com</a> and
          we will delete it.
        </p>
      </Section>

      <Section title="3. What we collect">
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Account data</strong> — email, full name, username, password (hashed), date of birth, phone (optional).</li>
          <li>
            <strong>Profile and matchmaking data</strong> — photos, gender, pronouns,
            sexual orientation, partner preferences, dating intent, lifestyle
            (smoking, drinking, exercise, diet, sleep), relationship history,
            attachment style, love languages, conflict patterns, religion,
            politics, ethnicity, and the answers you give Maahi during
            onboarding.
          </li>
          <li>
            <strong>Special-category / sensitive personal data</strong> — many
            of the matchmaking fields above (sexual orientation, religion,
            political views, ethnicity, lifestyle indicators that touch on
            health) qualify as &quot;sensitive&quot; under DPDPA 2023, GDPR Art. 9,
            UAE PDPL, and similar laws. We process this data <strong>only on
            the basis of your explicit consent</strong> at signup and onboarding,
            and only to power matching, safety, and the features you use.
          </li>
          <li><strong>Conversations</strong> — messages, voice notes, and date proposals exchanged inside BiggDate.</li>
          <li><strong>Behavioral data</strong> — pages visited, matches sent, messages sent, dates logged, debriefs.</li>
          <li><strong>Payment data</strong> — none today. BiggDate is in early access; Premium is unlocked via coupon codes we email. When paid plans launch, Stripe will process payments and we will never see your card number.</li>
          <li><strong>Device data</strong> — IP address, browser, basic device info — used for security, fraud prevention, and abuse response.</li>
          <li><strong>Cookies and trackers</strong> — see Section 8 and the <a href="/cookies" className="underline">Cookie Policy</a>.</li>
        </ul>
      </Section>

      <Section title="4. Why we use it and on what legal basis">
        <p className="mb-3">
          For each purpose below we identify the lawful basis under DPDPA 2023
          (India), GDPR / UK-GDPR (if you reached the Service outside its
          intended region), UAE PDPL, and CCPA/CPRA (US).
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Run the matchmaking service</strong> (profile, matches, messages) — performance of contract; your consent for sensitive fields.</li>
          <li><strong>Power AI features</strong> (Maahi, daily intentions, debriefs, match insights, voice transcription) — your consent; performance of contract.</li>
          <li><strong>Send transactional emails</strong> (welcome, security, match notifications, billing) — performance of contract; legitimate interest in account security.</li>
          <li><strong>Send marketing emails</strong> (daily Soul, Pulse prompts, reactivation, product updates) — <strong>only with your separate marketing consent</strong>, which you can withdraw at any time via the unsubscribe link in every marketing email or from Settings.</li>
          <li><strong>Detect abuse, fraud, CSAM, harmful behavior</strong> (photo moderation, rate limiting, report triage) — legitimate interest in platform safety; legal obligation.</li>
          <li><strong>Comply with legal obligations</strong> (tax, law-enforcement requests, retention duties) — legal obligation.</li>
          <li><strong>Analytics and product improvement</strong> — <strong>only after you accept analytics</strong> via the cookie banner; legitimate interest constrained by your choice.</li>
        </ul>
      </Section>

      <Section title="5. Who we share it with (subprocessors)">
        <p className="mb-3">
          We share personal data with the following processors under written
          agreements that bind them to security and confidentiality at least as
          strict as this policy. We do <strong>not</strong> sell or rent your data to
          advertisers or data brokers.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Supabase</strong> — database, authentication, file storage (hosted on AWS).</li>
          <li><strong>Vercel Inc.</strong> — application hosting, edge compute, logs.</li>
          <li><strong>Resend</strong> — transactional and marketing email delivery.</li>
          <li><strong>Google LLC</strong> — Google Gemini for Maahi conversations and AI features.</li>
          <li><strong>OpenAI</strong> — optional fallback AI model (only if enabled).</li>
          <li><strong>Sightengine SAS</strong> — automated photo moderation for nudity, weapons, violence, and minor-protection checks.</li>
          <li><strong>Stripe</strong> — payment processing when paid plans launch.</li>
          <li><strong>Upstash</strong> — Redis rate limiting and abuse prevention.</li>
          <li><strong>Sentry</strong> — error monitoring and crash reporting.</li>
          <li><strong>Google Tag Manager, Meta Pixel, Microsoft Clarity, Vercel Analytics</strong> — only after you accept analytics in the cookie banner.</li>
          <li><strong>Law enforcement and regulators</strong> — only where we are legally compelled or to prevent imminent harm.</li>
        </ul>
      </Section>

      <Section title="6. International data transfers">
        <p>
          Our primary infrastructure (Supabase, Vercel, Sentry, Google, OpenAI,
          Stripe, Resend) is operated from the United States. If you use
          BiggDate from India, the UAE, or the US, personal data may be
          transferred to and stored in the United States.
        </p>
        <p className="mt-3">
          For transfers from India, we rely on <strong>your explicit consent
          under DPDPA §16</strong> and on contractual safeguards (data-processing
          terms) with each subprocessor. For transfers from the UAE, we rely
          on <strong>contractual safeguards and your consent under PDPL Art.
          22–23</strong>. We do not intentionally accept users from the EEA, UK,
          or Switzerland; if a user from those regions reaches us by mistake
          and contacts us, we will delete the account and any data we hold.
        </p>
      </Section>

      <Section title="7. How long we keep it">
        <p className="mb-3">
          We retain personal data only as long as necessary for the purposes
          described above:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Account, profile, photos, messages</strong> — while your account is active. On deletion, erased within 30 days, subject to legal-hold exceptions.</li>
          <li><strong>Maahi AI session memory</strong> — pruned 90 days after the last update.</li>
          <li><strong>Analytics events</strong> — 13 months from creation.</li>
          <li><strong>Server and security logs</strong> — up to 90 days.</li>
          <li><strong>Billing and tax records</strong> — up to 7 years where required by Indian tax law.</li>
          <li><strong>Safety records</strong> (reports against you, ban history) — retained for as long as needed to keep the platform safe; not used for any other purpose.</li>
        </ul>
      </Section>

      <Section title="8. Cookies and trackers">
        <p>
          BiggDate uses essential cookies for sign-in, session, and abuse
          prevention. These run regardless of consent because the Service
          cannot function without them. Analytics and product trackers (Google
          Tag Manager, Meta Pixel, Microsoft Clarity, Vercel Analytics) only
          load <strong>after you accept analytics</strong> in the cookie banner.
          You can change your choice any time from the cookie banner or
          Settings. See the <a href="/cookies" className="underline">Cookie Policy</a> for the full list.
        </p>
      </Section>

      <Section title="9. Your rights">
        <p className="mb-3">
          Subject to local law, you have the following rights over your
          personal data. To exercise any of them, email <a href="mailto:privacy@biggdate.com" className="underline">privacy@biggdate.com</a> or use
          Settings → Privacy.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Access</strong> — request a copy of your data. Self-service export is available in Settings.</li>
          <li><strong>Correction / rectification</strong> — fix inaccurate or incomplete data.</li>
          <li><strong>Erasure / deletion</strong> — delete your account and associated data. Self-service deletion is available in Settings.</li>
          <li><strong>Portability</strong> — receive your data in a machine-readable format.</li>
          <li><strong>Withdraw consent</strong> — including marketing emails, analytics, and sensitive-data processing. Withdrawal does not affect lawfulness of processing before withdrawal.</li>
          <li><strong>Object / restrict processing</strong> — object to or restrict specific processing.</li>
          <li><strong>Nominate</strong> (DPDPA §14) — Indian users may nominate another individual to exercise rights in case of death or incapacity. Contact us to register a nominee.</li>
          <li><strong>Complaint to a regulator</strong> — in India, the Data Protection Board of India; in the UAE, the UAE Data Office; in California, the California Privacy Protection Agency.</li>
          <li><strong>Non-discrimination</strong> (CCPA §1798.125) — we will not deny you the Service, charge different prices, or provide a different level of quality because you exercised a privacy right.</li>
        </ul>
        <p className="mt-3">
          We respond to verified requests within 30 days. We may extend by a
          further 60 days for complex requests and will tell you if we do.
        </p>
      </Section>

      <Section title="10. Age requirement and minors">
        <p>
          BiggDate is for adults <strong>18 years and older</strong>. We collect
          date of birth at signup and reject any sign-up under 18. We do not
          knowingly collect personal data from anyone under 18. If you believe
          a minor has signed up, email <a href="mailto:safety@biggdate.com" className="underline">safety@biggdate.com</a> and
          we will remove the account immediately and delete all associated
          data.
        </p>
      </Section>

      <Section title="11. Security">
        <p>
          We use TLS in transit and encryption at rest provided by our
          infrastructure. We hash passwords, rate-limit authentication
          endpoints, scan uploaded photos for harmful content, and require
          email verification. No system is perfectly secure; if a breach
          occurs that materially affects you, we will notify you and the
          relevant regulator within the timeframes required by applicable law
          (72 hours under DPDPA / GDPR for high-risk breaches).
        </p>
      </Section>

      <Section title="12. Grievance Officer (India) and statutory contacts">
        <p className="mb-3">
          Per India IT Rules 2021 §4(1)(d) and DPDPA §13, the Grievance Officer
          for BiggDate is:
        </p>
        <ul className="list-none space-y-1 pl-0">
          <li><strong>Name:</strong> Aariv Patel</li>
          <li><strong>Designation:</strong> Founder and Grievance Officer</li>
          <li><strong>Email:</strong> <a href="mailto:grievance@biggdate.com" className="underline">grievance@biggdate.com</a></li>
          <li><strong>Postal address:</strong> [BUSINESS_ADDRESS], Ahmedabad, Gujarat, India</li>
          <li><strong>Hours:</strong> Monday–Friday, 10:00–18:00 IST</li>
        </ul>
        <p className="mt-3">
          We acknowledge grievances within 24 hours and resolve them within 15
          days, as required by Indian law.
        </p>
        <p className="mt-3">
          To report harmful or illegal content, email <a href="mailto:safety@biggdate.com" className="underline">safety@biggdate.com</a> or
          use the in-app Report option on any profile or conversation.
        </p>
      </Section>

      <Section title="13. Children, illegal content, and CSAM">
        <p>
          We have zero tolerance for child sexual abuse material (CSAM),
          grooming, sextortion, or any sexual content involving minors. Every
          uploaded photo is screened for under-18 indicators by automated
          tools, and anything flagged is held for human review. We report
          confirmed CSAM to the National Center for Missing &amp; Exploited
          Children (NCMEC) and to Indian authorities under the POCSO Act and
          IT Act, and preserve associated data for investigation.
        </p>
      </Section>

      <Section title="14. Changes to this policy">
        <p>
          We&apos;ll notify you in-app and by email when we make material changes,
          at least 14 days before they take effect. Continued use after the
          effective date means you accept the updated policy. Older versions
          are available on request.
        </p>
      </Section>

      <p className="mt-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        See also:{" "}
        <a href="/terms" className="underline">Terms of Service</a>
        {" · "}
        <a href="/cookies" className="underline">Cookie Policy</a>
        {" · "}
        <a href="/safety" className="underline">Safety</a>
        {" · "}
        <a href="/imprint" className="underline">Imprint</a>
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
