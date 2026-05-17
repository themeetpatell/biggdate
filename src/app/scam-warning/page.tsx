import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scam Warning · BiggDate",
  description: "How romance scams work, the signs, and what to do if it happens to you.",
};

const LAST_UPDATED = "2026-05-17";

export default function ScamWarningPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
      style={{ color: "var(--bd-text)" }}
    >
      <h1 className="mb-2 text-3xl font-light tracking-tight">Scam Warning</h1>
      <p className="mb-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        Last updated: {LAST_UPDATED}
      </p>

      <Section title="Romance scams are common — and they work because they feel real">
        <p>
          Most people who lose money to a romance scam are smart, careful, and
          successful. Scammers are professionals. They build a relationship
          over weeks or months, mirror your values, and only ask for help
          once you trust them. By the time the ask comes, it doesn&apos;t feel
          like a stranger asking for money — it feels like a partner in
          trouble.
        </p>
      </Section>

      <Section title="The patterns">
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Pig-butchering / crypto investing</strong> — &quot;I made my money on a platform, let me show you, you can start small.&quot; The platform looks real, balances grow, then withdrawals are blocked and a &quot;tax&quot; or &quot;fee&quot; is needed.</li>
          <li><strong>Emergency money</strong> — a customs hold, medical bill, stuck overseas, family crisis. Always urgent. Always wire/gift-card/crypto.</li>
          <li><strong>Military / oil rig / overseas doctor</strong> — explains why they can&apos;t video-call, can&apos;t meet, and need a special channel to get money.</li>
          <li><strong>Sextortion</strong> — pushes for intimate photos quickly, then threatens to share them with your contacts. Often automated.</li>
          <li><strong>Identity theft setup</strong> — &quot;Send a photo of your ID, it&apos;s just for trust.&quot; Used to open accounts in your name.</li>
          <li><strong>Account takeover</strong> — asks for a code that &quot;Google sent you by accident&quot;. That code is a one-time password for your account.</li>
        </ul>
      </Section>

      <Section title="Red flags">
        <ul className="list-disc space-y-2 pl-6">
          <li>Refuses to video-call. Has an excuse every time.</li>
          <li>Says &quot;I love you&quot; within days.</li>
          <li>Pushes you to move off BiggDate fast.</li>
          <li>Asks for money, crypto, gift cards, or banking access — for any reason.</li>
          <li>Asks for one-time passwords, OTP, or your government ID.</li>
          <li>Sends only studio-style photos. Reverse-image search turns up a stranger.</li>
          <li>Stories don&apos;t add up across conversations.</li>
        </ul>
      </Section>

      <Section title="Rules that will protect you">
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Never</strong> send money, crypto, or gift cards to anyone you have not met in person multiple times.</li>
          <li><strong>Never</strong> share OTPs, banking PINs, government IDs, or remote-access codes.</li>
          <li><strong>Always</strong> video-call before meeting. If the camera &quot;doesn&apos;t work&quot;, the date doesn&apos;t happen.</li>
          <li>Reverse-image-search the photos. Google Images and TinEye are free.</li>
          <li>If anything feels off, talk to a friend or family member outside the relationship. Scammers isolate you.</li>
        </ul>
      </Section>

      <Section title="If you&apos;ve been scammed">
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Stop sending money immediately.</strong> The most common loss pattern is a series of small payments, not one big one.</li>
          <li>Screenshot the conversation, profile, transactions, and any platform the scammer pointed you to. Save before blocking.</li>
          <li>Report the user inside BiggDate. Email <a href="mailto:safety@biggdate.com" className="underline">safety@biggdate.com</a> with details.</li>
          <li>In India: file a complaint at <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="underline">cybercrime.gov.in</a> or call <strong>1930</strong> (24×7 cyber-crime helpline). The first hour matters for stopping fund transfers.</li>
          <li>In the UAE: file with the eCrime portal at <a href="https://www.ecrime.ae" target="_blank" rel="noopener noreferrer" className="underline">ecrime.ae</a> or contact Dubai Police on <strong>901</strong>.</li>
          <li>In the US: report to the FBI&apos;s Internet Crime Complaint Center at <a href="https://www.ic3.gov" target="_blank" rel="noopener noreferrer" className="underline">ic3.gov</a> and to the FTC at <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="underline">reportfraud.ftc.gov</a>.</li>
          <li>Call your bank and card issuer. Ask for a chargeback or wire recall. Some channels (crypto, gift cards) are usually unrecoverable; banks and cards aren&apos;t.</li>
        </ul>
      </Section>

      <Section title="It is not your fault">
        <p>
          Romance scams are designed by professionals using social-engineering
          playbooks that work on smart people. Being targeted is not a moral
          failing. Report what happened. The single most important thing you
          can do is tell someone — silence is what the scammer is counting on.
        </p>
      </Section>

      <p className="mt-12 text-sm" style={{ color: "var(--bd-text-faint)" }}>
        See also:{" "}
        <a href="/safety" className="underline">Safety</a>
        {" · "}
        <a href="/community-guidelines" className="underline">Community Guidelines</a>
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
