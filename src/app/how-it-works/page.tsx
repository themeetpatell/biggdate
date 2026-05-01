import type { Metadata } from "next";
import {
  howToSchema,
  breadcrumbSchema,
  jsonLdString,
} from "@/lib/structured-data";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

const TITLE = "How BiggDate Works · Step by step";
const DESCRIPTION =
  "From signup to first date in 7 steps. How Maahi builds your Soul Profile, how Soul Knock gates contact, how curated daily matches work, and what happens after a date.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${APP_URL}/how-it-works` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${APP_URL}/how-it-works`,
    type: "article",
  },
};

const STEPS = [
  {
    name: "Sign up with email and full name",
    text: "Create an account in under a minute. Confirm you are 18 or older and accept the Terms and Privacy Policy. Confirm your email via the link we send.",
  },
  {
    name: "Talk to Maahi — Phase 1: basic facts (~3 min)",
    text: "Maahi, BiggDate's AI relationship profiler, asks you 8 quick questions to set up your profile: location, birthday, gender, who you want to meet, age range, intent (marriage, serious, exploring), what keeps you busy, and lifestyle basics. All chip-driven and fast.",
  },
  {
    name: "Talk to Maahi — Phase 2: psychological depth (~7–8 min)",
    text: "Maahi asks 9 deeper questions and up to 5 adaptive follow-ups when an answer is thin or emotionally rich. Topics: why now, last meaningful relationship, conflict in the first 10 minutes, how you know someone cares about you, how you show up when you love someone, work intensity, date-3 dealbreaker, what you bring that's hard to find, and what a partner needs to understand about you.",
  },
  {
    name: "Receive your Soul Snapshot",
    text: "BiggDate derives a Soul Profile from the conversation: attachment style (Secure / Anxious / Avoidant / Fearful-Avoidant), conflict style, love language given vs received, core values, growth areas, dealbreakers, and a written 2–3 sentence summary of who you are emotionally.",
  },
  {
    name: "See 1–5 curated matches per day",
    text: "Every day, BiggDate surfaces a small number of high-fit candidates. Each match comes with a narrative — why this pair would resonate, where the friction is, and one opening question that would be meaningful to both of you. No endless feed, no swipe spam.",
  },
  {
    name: "Soul Knock to start a conversation",
    text: "Interested in a match? Compose a question for them. They'll see it and answer. You then answer a reciprocal question. Only after both sides have answered do photos unlock and a chat thread open. This is BiggDate's intent gate — no contact without effort.",
  },
  {
    name: "Date and debrief",
    text: "After a date, BiggDate prompts a structured 3-question reflection: chemistry, what surprised you, and your decision. The reflection updates your future matches. Maahi remains available between events as a confidant who knows your patterns.",
  },
];

export default function HowItWorksPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "How it works", url: `${APP_URL}/how-it-works` },
  ]);
  const howTo = howToSchema({
    name: "How BiggDate works",
    description:
      "From signup to first date — the BiggDate flow in 7 steps. AI-led onboarding with Maahi, a derived Soul Profile, curated daily matches, intent-gated Soul Knock, and a structured post-date debrief.",
    totalTime: "PT20M",
    steps: STEPS,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(howTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <main
        className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
        style={{ color: "var(--bd-text)" }}
      >
        <header className="mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--bd-accent)" }}>
            How it works
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            From signup to first date — in seven steps
          </h1>
          <p className="mt-4 max-w-2xl text-sm" style={{ color: "var(--bd-text-faint)" }}>
            BiggDate is intentionally slow at the front and fast in the middle. Twenty minutes once, then a few well-chosen people per day.
          </p>
        </header>

        <ol className="space-y-8">
          {STEPS.map((step, i) => (
            <li key={step.name} className="flex gap-5">
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(229,39,224,0.12)",
                  border: "1px solid rgba(229,39,224,0.3)",
                  color: "var(--bd-accent)",
                }}
              >
                {i + 1}
              </div>
              <div>
                <h2 className="text-lg font-medium">{step.name}</h2>
                <p className="mt-2" style={{ color: "var(--bd-text-muted)" }}>
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-16 text-sm" style={{ color: "var(--bd-text-faint)" }}>
          See also: <a href="/compare" className="underline">how BiggDate compares to other apps</a>,{" "}
          <a href="/faq" className="underline">FAQ</a>,{" "}
          <a href="/about" className="underline">about</a>.
        </p>
      </main>
    </>
  );
}
