import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service · BiggDate",
  description: "The rules for using BiggDate.",
};

const LAST_UPDATED = "2026-05-01";

export default function TermsPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
      style={{ color: "var(--bd-text)" }}
    >
      <h1 className="mb-2 text-3xl font-light tracking-tight">Terms of Service</h1>
      <p className="mb-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        Last updated: {LAST_UPDATED}
      </p>

      <Section title="1. Who can use BiggDate">
        <ul className="list-disc space-y-2 pl-6">
          <li>You must be at least 18 years old.</li>
          <li>You must use your real name and a real photo of yourself.</li>
          <li>You may not have an active account if a previous one was banned.</li>
          <li>One account per person.</li>
        </ul>
      </Section>

      <Section title="2. What you agree to do">
        <ul className="list-disc space-y-2 pl-6">
          <li>Be truthful in your profile and conversations.</li>
          <li>Treat other people with basic respect — no harassment, hate speech, threats, or sexual content involving anyone under 18.</li>
          <li>Keep your account credentials secure. You&apos;re responsible for everything that happens on your account.</li>
        </ul>
      </Section>

      <Section title="3. What you agree NOT to do">
        <ul className="list-disc space-y-2 pl-6">
          <li>No catfishing, fake profiles, impersonation, or fake photos.</li>
          <li>No solicitation, sex work, or selling anything through the app.</li>
          <li>No harvesting other users&apos; data, scraping, or automated activity.</li>
          <li>No attempting to bypass safety features (blocks, reports, verification).</li>
          <li>No uploading nude photos, photos of minors, or photos you don&apos;t have rights to.</li>
        </ul>
      </Section>

      <Section title="4. Subscriptions and payments">
        <p>
          Premium and Pro plans are billed by Stripe. Subscriptions auto-renew
          until canceled. Cancel any time in Settings — access continues until
          the end of the paid period. Refunds are only given as required by
          Indian consumer law or where we determine the service was clearly
          defective.
        </p>
      </Section>

      <Section title="5. Content you upload">
        <p>
          You keep ownership of your photos and writing. You give us a limited,
          worldwide license to display them within BiggDate to serve you and
          other users. We do not use your content for marketing without
          explicit consent.
        </p>
      </Section>

      <Section title="6. AI features">
        <p>
          Maahi, daily intentions, debriefs, and match insights are generated
          by AI models (currently Google Gemini). AI output can be wrong,
          biased, or misleading — treat it as a supportive tool, not as
          professional advice. We do not store the contents of your Maahi
          conversations beyond what&apos;s needed to run the feature and improve
          your matches.
        </p>
      </Section>

      <Section title="7. Suspension and termination">
        <p>
          We may suspend or terminate your account if you violate these terms,
          if other users report you for harmful behavior, or if we&apos;re legally
          required to do so. We will tell you why where lawful and possible.
        </p>
      </Section>

      <Section title="8. Disclaimers">
        <p>
          BiggDate is provided &quot;as is.&quot; We don&apos;t guarantee you&apos;ll find love,
          a date, or even a conversation. We don&apos;t background-check users —
          please use common sense when meeting someone offline (public place,
          tell a friend, listen to your gut).
        </p>
      </Section>

      <Section title="9. Limitation of liability">
        <p>
          To the maximum extent permitted by Indian law, our total liability
          for any claim is capped at the amount you paid us in the 12 months
          before the claim, or ₹1,000, whichever is greater.
        </p>
      </Section>

      <Section title="10. Disputes">
        <p>
          These terms are governed by the laws of India. Disputes will be
          resolved in the courts of Ahmedabad, Gujarat.
        </p>
      </Section>

      <Section title="11. Changes">
        <p>
          We&apos;ll notify you in-app and by email when we change these terms
          materially. Continued use means you accept the changes.
        </p>
      </Section>

      <p className="mt-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        See also: <a href="/privacy" className="underline">Privacy Policy</a>.
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
