import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines · BiggDate",
  description: "How we expect everyone on BiggDate to treat each other.",
};

const LAST_UPDATED = "2026-05-17";

export default function CommunityGuidelinesPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
      style={{ color: "var(--bd-text)" }}
    >
      <h1 className="mb-2 text-3xl font-light tracking-tight">Community Guidelines</h1>
      <p className="mb-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        Last updated: {LAST_UPDATED}
      </p>

      <p className="mb-10">
        BiggDate is for adults looking for real connection. These guidelines
        translate the <a href="/terms" className="underline">Terms of Service</a> into
        plain rules about how people treat each other here. Breaking them
        leads to warnings, content removal, suspension, or a permanent ban —
        depending on severity and history.
      </p>

      <Section title="Be a real person">
        <ul className="list-disc space-y-2 pl-6">
          <li>Use your real first name and a recent photo of yourself.</li>
          <li>One account per person.</li>
          <li>No AI-generated faces, deepfakes, or photos of people other than you.</li>
          <li>State your age, gender, and intent honestly.</li>
        </ul>
      </Section>

      <Section title="Respect the other person">
        <ul className="list-disc space-y-2 pl-6">
          <li>No harassment, threats, hate speech, slurs, or stalking.</li>
          <li>No unsolicited sexual content, photos, or pressure for them.</li>
          <li>No racism, casteism, religious vilification, homophobia, transphobia, ableism, or body-shaming.</li>
          <li>If someone says no, drop it. &quot;I&apos;m not interested&quot; is a complete sentence.</li>
          <li>Don&apos;t share another person&apos;s photos, messages, or identifying information without their consent.</li>
        </ul>
      </Section>

      <Section title="Things that are never allowed">
        <ul className="list-disc space-y-2 pl-6">
          <li>Sexual content involving minors. Zero tolerance. Reported to NCMEC and Indian authorities.</li>
          <li>Solicitation, sex work, sugar relationships, or selling services.</li>
          <li>Romance scams, advance-fee fraud, crypto-investment pitches, money requests of any kind.</li>
          <li>Nude or sexually explicit photos.</li>
          <li>Photos showing weapons, violence, drugs, or self-harm.</li>
          <li>Hate speech, terrorist or extremist content, or incitement to violence.</li>
          <li>Promoting other dating apps, websites, businesses, or schemes.</li>
          <li>Scraping, bots, automation, or attempts to bypass safety features.</li>
        </ul>
      </Section>

      <Section title="Photos and content standards">
        <ul className="list-disc space-y-2 pl-6">
          <li>Show your face clearly in at least one photo.</li>
          <li>No photos of children, including your own kids.</li>
          <li>No screenshots of other dating profiles.</li>
          <li>No QR codes, social handles, or external contact details in photos or bio.</li>
        </ul>
      </Section>

      <Section title="What happens when someone breaks the rules">
        <p>
          Reports go to human review. We weigh: severity, history, whether
          there is evidence (screenshots, message context), and whether the
          conduct is illegal. Outcomes range from a private warning to a
          permanent ban. Illegal conduct is reported to the appropriate
          authority, and we preserve the data needed for investigation.
        </p>
      </Section>

      <Section title="Report something">
        <ul className="list-disc space-y-2 pl-6">
          <li>In-app: profile menu or conversation menu → <strong>Report</strong>.</li>
          <li>Email: <a href="mailto:safety@biggdate.com" className="underline">safety@biggdate.com</a>.</li>
          <li>Grievance (India statutory): <a href="mailto:grievance@biggdate.com" className="underline">grievance@biggdate.com</a>.</li>
        </ul>
      </Section>

      <p className="mt-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        See also:{" "}
        <a href="/safety" className="underline">Safety</a>
        {" · "}
        <a href="/scam-warning" className="underline">Scam Warning</a>
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
