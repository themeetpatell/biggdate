import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprint · BiggDate",
  description: "Legal entity, contact, and statutory disclosures for BiggDate.",
};

const LAST_UPDATED = "2026-05-17";

export default function ImprintPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
      style={{ color: "var(--bd-text)" }}
    >
      <h1 className="mb-2 text-3xl font-light tracking-tight">Imprint &amp; Legal Disclosure</h1>
      <p className="mb-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        Last updated: {LAST_UPDATED}
      </p>

      <Section title="Operator">
        <ul className="list-none space-y-1 pl-0">
          <li><strong>Name:</strong> Meet Patel</li>
          <li><strong>Trading as:</strong> BiggDate</li>
          <li><strong>Form:</strong> Sole proprietorship (India)</li>
          <li><strong>Principal place of business:</strong> [BUSINESS_ADDRESS], Ahmedabad, Gujarat, India</li>
          <li><strong>GSTIN:</strong> [GSTIN — to be filled in]</li>
          <li><strong>PAN:</strong> [PAN — to be filled in]</li>
        </ul>
      </Section>

      <Section title="Contact">
        <ul className="list-none space-y-1 pl-0">
          <li><strong>General:</strong> <a href="mailto:hello@biggdate.com" className="underline">hello@biggdate.com</a></li>
          <li><strong>Privacy / DSAR:</strong> <a href="mailto:privacy@biggdate.com" className="underline">privacy@biggdate.com</a></li>
          <li><strong>Grievance Officer (India):</strong> <a href="mailto:grievance@biggdate.com" className="underline">grievance@biggdate.com</a></li>
          <li><strong>Safety / abuse reports:</strong> <a href="mailto:safety@biggdate.com" className="underline">safety@biggdate.com</a></li>
          <li><strong>Law-enforcement requests:</strong> <a href="mailto:legal@biggdate.com" className="underline">legal@biggdate.com</a></li>
        </ul>
      </Section>

      <Section title="Service availability">
        <p>
          BiggDate is offered in India, the United Arab Emirates, and the
          United States. It is <strong>not</strong> offered in the EEA, the UK,
          or Switzerland.
        </p>
      </Section>

      <Section title="Grievance Officer (India IT Rules 2021 §4, DPDPA §13)">
        <ul className="list-none space-y-1 pl-0">
          <li><strong>Name:</strong> Meet Patel</li>
          <li><strong>Designation:</strong> Founder and Grievance Officer</li>
          <li><strong>Email:</strong> <a href="mailto:grievance@biggdate.com" className="underline">grievance@biggdate.com</a></li>
          <li><strong>Postal address:</strong> [BUSINESS_ADDRESS], Ahmedabad, Gujarat, India</li>
          <li><strong>Working hours:</strong> Monday–Friday, 10:00–18:00 IST</li>
          <li><strong>Acknowledgement:</strong> within 24 hours · <strong>Resolution:</strong> within 15 days</li>
        </ul>
      </Section>

      <Section title="Regulatory disclosures">
        <p>
          BiggDate is an interactive online service. It is <strong>not</strong>{" "}
          a matrimonial service, a marriage bureau, a regulated financial
          service, or a healthcare provider. We do not provide medical, legal,
          or psychological advice. Information provided by AI features
          (including Maahi) is informational only and is not a substitute for
          a qualified professional.
        </p>
      </Section>

      <Section title="Hosting and infrastructure">
        <p>
          BiggDate is hosted on Vercel Inc. (US) and Supabase (AWS, US). See
          the full subprocessor list in our{" "}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>
      </Section>

      <p className="mt-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        See also:{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>
        {" · "}
        <a href="/terms" className="underline">Terms of Service</a>
        {" · "}
        <a href="/cookies" className="underline">Cookie Policy</a>
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
