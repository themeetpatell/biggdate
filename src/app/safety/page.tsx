import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety · BiggDate",
  description: "How to stay safe on BiggDate, report harm, and get help.",
};

const LAST_UPDATED = "2026-05-17";

export default function SafetyPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
      style={{ color: "var(--bd-text)" }}
    >
      <h1 className="mb-2 text-3xl font-light tracking-tight">Safety on BiggDate</h1>
      <p className="mb-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        Last updated: {LAST_UPDATED}
      </p>

      <Section title="In an emergency">
        <p>
          BiggDate is not an emergency service. If you or someone you know is
          in immediate danger, call your local emergency number — in India
          dial <strong>112</strong>; in the UAE dial <strong>999</strong>; in
          the US dial <strong>911</strong>. For mental-health crises in India
          call iCall <strong>+91 9152987821</strong>; in the UAE call the
          Estijaba helpline <strong>8001717</strong>; in the US dial{" "}
          <strong>988</strong>.
        </p>
      </Section>

      <Section title="Before you meet someone">
        <ul className="list-disc space-y-2 pl-6">
          <li>Talk in the BiggDate chat first. Don&apos;t move to other apps before you&apos;re comfortable.</li>
          <li>Video-call before meeting in person. Mismatched voices and faces are the most common scam tell.</li>
          <li>Meet in a public place, in daylight, with people around.</li>
          <li>Tell a friend where you&apos;re going, who you&apos;re meeting, and when you expect to be home. Share your live location.</li>
          <li>Arrive and leave on your own. Don&apos;t accept a ride from a stranger you just met.</li>
          <li>Watch your drink. Stop drinking if you feel off.</li>
          <li>Trust your gut. Leave whenever you want. You don&apos;t owe anyone an explanation.</li>
        </ul>
      </Section>

      <Section title="Red flags">
        <ul className="list-disc space-y-2 pl-6">
          <li>Asks for money, gift cards, crypto, or to &quot;invest&quot; — for any reason.</li>
          <li>Refuses to video-call or always has an excuse.</li>
          <li>Pushes you to move off BiggDate to WhatsApp / Telegram / Signal quickly.</li>
          <li>Claims to be travelling, stationed abroad, on an oil rig, or otherwise unable to meet.</li>
          <li>Sends only modelling-style photos and avoids casual selfies.</li>
          <li>Pressures you for sexual photos or sends explicit material unsolicited.</li>
          <li>Wants your full address, ID, banking info, or one-time passwords.</li>
        </ul>
        <p className="mt-3">
          Read more on our <a href="/scam-warning" className="underline">Scam Warning</a> page.
        </p>
      </Section>

      <Section title="Report someone or something">
        <ul className="list-disc space-y-2 pl-6">
          <li>Inside the app: tap the menu on any profile or conversation and choose <strong>Report</strong>.</li>
          <li>By email for urgent safety issues: <a href="mailto:safety@biggdate.com" className="underline">safety@biggdate.com</a>.</li>
          <li>For statutory grievances (India IT Rules 2021 §4, DPDPA §13): <a href="mailto:grievance@biggdate.com" className="underline">grievance@biggdate.com</a>. We acknowledge within 24 hours and resolve within 15 days.</li>
          <li>For child-safety concerns: <a href="mailto:safety@biggdate.com" className="underline">safety@biggdate.com</a>. We report confirmed CSAM to NCMEC and to Indian authorities under the POCSO Act and IT Act.</li>
        </ul>
      </Section>

      <Section title="If something happened to you">
        <p>
          We&apos;re sorry. What happened wasn&apos;t your fault. If you feel safe to,
          report the user to us so we can take action. If a crime occurred,
          contact local police. We will cooperate fully with verified
          law-enforcement requests. You can preserve evidence by screenshotting
          conversations and the user&apos;s profile before blocking.
        </p>
      </Section>

      <Section title="Our commitments">
        <ul className="list-disc space-y-2 pl-6">
          <li>Every photo is screened for nudity, weapons, violence, and indicators of minors before it goes live.</li>
          <li>You can block any user from their profile or conversation, with bidirectional invisibility.</li>
          <li>Repeated reports against a user trigger human review.</li>
          <li>We do not run background checks. You should never assume a user has been verified beyond what their profile shows.</li>
        </ul>
      </Section>

      <p className="mt-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        See also:{" "}
        <a href="/community-guidelines" className="underline">Community Guidelines</a>
        {" · "}
        <a href="/scam-warning" className="underline">Scam Warning</a>
        {" · "}
        <a href="/privacy" className="underline">Privacy Policy</a>
        {" · "}
        <a href="/terms" className="underline">Terms</a>
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
