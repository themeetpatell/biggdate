import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service · BiggDate",
  description: "The rules for using BiggDate.",
};

const LAST_UPDATED = "2026-05-17";

export default function TermsPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
      style={{ color: "var(--bd-text)" }}
    >
      <h1 className="mb-2 text-3xl font-light tracking-tight">Terms of Service</h1>
      <p className="mb-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        Last updated: {LAST_UPDATED} · Effective: {LAST_UPDATED}
      </p>

      <Section title="1. Who we are and where we operate">
        <p>
          BiggDate (&quot;the Service&quot;) is operated by{" "}
          <strong>Aariv Patel</strong>, sole proprietor, trading as
          &quot;BiggDate&quot;, with principal place of business at
          [BUSINESS_ADDRESS], Ahmedabad, Gujarat, India (&quot;we&quot;, &quot;us&quot;).
          The Service is offered in India, the UAE, and the United States.{" "}
          <strong>It is not offered in the EEA, UK, or Switzerland.</strong>
        </p>
      </Section>

      <Section title="2. Who can use BiggDate">
        <ul className="list-disc space-y-2 pl-6">
          <li>You must be at least <strong>18 years old</strong>. You must enter a true date of birth at signup; we may suspend accounts where the DOB appears falsified.</li>
          <li>You must use your real first name and a current photo of yourself.</li>
          <li>One account per person. You may not register if a previous account of yours was banned.</li>
          <li>You must have the legal right to enter into these terms in your country.</li>
        </ul>
      </Section>

      <Section title="3. What you agree to do">
        <ul className="list-disc space-y-2 pl-6">
          <li>Be truthful in your profile, photos, and conversations.</li>
          <li>Treat other people with basic respect — no harassment, threats, hate speech, doxxing, or sexual content involving anyone under 18.</li>
          <li>Keep your credentials secure. You are responsible for activity under your account.</li>
          <li>Comply with applicable law where you live and where you meet other users.</li>
        </ul>
      </Section>

      <Section title="4. What you agree NOT to do (prohibited conduct and content)">
        <p className="mb-3">
          You will <strong>not</strong> use BiggDate for, or upload to BiggDate, any
          of the following. Violation may result in immediate suspension or
          termination, content removal, and reports to authorities where
          required by law.
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Child sexual abuse material (CSAM), grooming, sextortion,
            or any sexual content involving minors</strong> — zero tolerance.
            Confirmed CSAM is reported to NCMEC and to Indian authorities
            under the POCSO Act and IT Act, with all related data preserved
            for investigation.
          </li>
          <li>Catfishing, fake profiles, impersonation, AI-generated likeness of others, or photos of anyone other than yourself.</li>
          <li>Nudity, sexually explicit photos, or pornography.</li>
          <li>Solicitation, sex work, escort services, sugar relationships, or selling anything through the Service.</li>
          <li>Romance scams, advance-fee schemes, crypto-investment pitches, &quot;pig-butchering&quot;, or other financial fraud.</li>
          <li>Harassment, threats, hate speech, stalking, or doxxing.</li>
          <li>Sharing another person&apos;s private information, photos, or messages without their consent.</li>
          <li>Scraping, harvesting, or automated activity against the Service or other users.</li>
          <li>Bypassing or attempting to bypass safety features (blocks, reports, photo moderation, age gate, geo-restrictions).</li>
          <li>Uploading malware, exploits, or anything intended to disrupt the Service.</li>
          <li>Using the Service in violation of any applicable export, sanctions, or anti-money-laundering law.</li>
        </ul>
      </Section>

      <Section title="5. Content you upload">
        <p>
          You keep ownership of your photos, voice notes, and writing. You
          grant us a limited, worldwide, royalty-free, non-exclusive license
          to host, store, transmit, display, and process your content as
          needed to operate the Service for you and the people you choose to
          interact with. We do not use your content for advertising or
          marketing without your explicit, separate consent. The license ends
          when you delete the content or your account, subject to our right
          to retain copies for legal, safety, or backup purposes as described
          in the <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>
      </Section>

      <Section title="6. AI features">
        <p>
          Maahi, daily intentions, debriefs, and match insights are generated
          by third-party AI models (currently Google Gemini, optionally
          OpenAI). AI output can be wrong, biased, or misleading — treat it
          as a supportive tool, not as professional, medical, legal, or
          mental-health advice. We store only what is needed to run the
          feature and improve your matches, retained per our retention policy.
          If you are in crisis, contact a qualified professional or a local
          helpline — BiggDate is not an emergency service.
        </p>
      </Section>

      <Section title="7. Subscriptions, payments, and renewals">
        <p>
          Premium and Pro plans are billed by Stripe in Indian Rupees (INR).
          Applicable taxes (e.g. 18% GST in India, 5% VAT in the UAE) are
          added at checkout and shown before payment. Subscriptions{" "}
          <strong>auto-renew</strong> at the same price and cadence until you
          cancel. You can cancel any time in Settings → Billing; access
          continues until the end of the period you have already paid for.
          Refunds are issued only where required by applicable consumer law
          or where we determine the Service was clearly defective.
        </p>
        <p className="mt-3">
          Free trials (when offered) automatically convert to a paid
          subscription at the end of the trial period unless you cancel
          before then. The exact price, currency, renewal date, and
          cancellation link are shown to you at checkout and in the
          confirmation email.
        </p>
      </Section>

      <Section title="8. Reporting, safety, and grievances">
        <p>
          Use the in-app Report option on any profile or conversation. For
          urgent safety issues email{" "}
          <a href="mailto:safety@biggdate.com" className="underline">safety@biggdate.com</a>.
          Statutory grievances under India IT Rules 2021 §4 and DPDPA §13
          should be sent to{" "}
          <a href="mailto:grievance@biggdate.com" className="underline">grievance@biggdate.com</a>{" "}
          — we acknowledge within 24 hours and resolve within 15 days. Read
          our <a href="/safety" className="underline">Safety</a> and{" "}
          <a href="/community-guidelines" className="underline">Community Guidelines</a> pages for more.
        </p>
      </Section>

      <Section title="9. Suspension and termination">
        <p>
          We may suspend or terminate your account if you violate these
          terms, if other users report you for harmful behavior, if we
          reasonably suspect fraud or impersonation, or if we are legally
          required to do so. We will tell you why where lawful and feasible.
          You can close your account at any time from Settings.
        </p>
      </Section>

      <Section title="10. Disclaimers">
        <p>
          BiggDate is provided <strong>&quot;as is&quot; and &quot;as available&quot;</strong>{" "}
          to the maximum extent permitted by law. We do not guarantee that
          you will find love, a date, a match, or a conversation. We do not
          run background checks on users. Please use common sense when
          meeting someone offline: meet in a public place, tell a friend
          where you are going, listen to your gut, and never send money or
          financial details to anyone you have only met online. See our{" "}
          <a href="/scam-warning" className="underline">Scam Warning</a> page.
        </p>
      </Section>

      <Section title="11. Limitation of liability">
        <p>
          To the maximum extent permitted by applicable law, our total
          aggregate liability to you for any claim arising out of or relating
          to the Service is capped at the amount you paid us in the 12
          months before the claim, or ₹1,000 (or local equivalent),
          whichever is greater. We are not liable for indirect, incidental,
          special, consequential, or punitive damages, or for loss of
          profits, goodwill, or data. Nothing in these terms limits liability
          that cannot be limited under applicable law (e.g. for fraud, gross
          negligence, or death/personal injury caused by negligence).
        </p>
      </Section>

      <Section title="12. Indemnity">
        <p>
          You agree to indemnify and hold us harmless from claims, losses,
          and reasonable legal fees arising from your breach of these terms,
          your content, or your interactions with other users — except to the
          extent the claim arises from our gross negligence or wilful
          misconduct.
        </p>
      </Section>

      <Section title="13. Governing law and disputes">
        <p>
          These terms are governed by the laws of India. Disputes will be
          resolved exclusively in the courts of Ahmedabad, Gujarat, India,
          except where mandatory consumer-protection law in your country of
          residence gives you the right to bring proceedings locally — in
          which case nothing in this clause overrides that right. If any
          provision of these terms is held unenforceable, the remaining
          provisions remain in effect.
        </p>
      </Section>

      <Section title="14. Changes">
        <p>
          We&apos;ll notify you in-app and by email at least 14 days before
          material changes take effect. Continued use after the effective
          date means you accept the updated terms. Older versions are
          available on request.
        </p>
      </Section>

      <p className="mt-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        See also:{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>
        {" · "}
        <a href="/cookies" className="underline">Cookie Policy</a>
        {" · "}
        <a href="/safety" className="underline">Safety</a>
        {" · "}
        <a href="/community-guidelines" className="underline">Community Guidelines</a>
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
