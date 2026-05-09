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
  keywords: ["how BiggDate works", "AI dating process", "soul knock", "maahi onboarding", "dating app algorithm"],
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

import { MarketingPageShell } from "@/components/marketing-page-shell";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";
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
      <MarketingPageShell
        eyebrow="How it works"
        title="From signup to first date — in seven steps."
        description="BiggDate is intentionally slow at the front and fast in the middle. Twenty minutes once, then a few well-chosen people per day."
        activePage="how-it-works"
      >
        <div className="mx-auto max-w-3xl px-6 pb-20">
          <ol className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.li 
                key={step.name} 
                className="flex gap-6 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                style={{
                  background: "linear-gradient(145deg, rgba(30, 36, 56, 0.4), rgba(15, 18, 30, 0.6))",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 24px 70px rgba(0,0,0,0.14)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold relative z-10"
                  style={{
                    background: "rgba(229,39,224,0.15)",
                    border: "1px solid rgba(229,39,224,0.4)",
                    color: "var(--bd-accent)",
                    boxShadow: "0 0 20px rgba(229,39,224,0.2)",
                  }}
                >
                  {i + 1}
                </div>
                <div className="relative z-10 pt-1">
                  <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--bd-text)" }}>{step.name}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {step.text}
                  </p>
                </div>
                <div 
                  className="absolute left-0 top-0 w-2 h-full opacity-50"
                  style={{ background: "linear-gradient(to bottom, var(--bd-pink), var(--bd-blue))" }}
                />
              </motion.li>
            ))}
          </ol>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center text-sm" 
            style={{ color: "var(--bd-text-faint)" }}
          >
            See also: <a href="/compare" className="underline hover:text-white transition-colors">how BiggDate compares to other apps</a>,{" "}
            <a href="/faq" className="underline hover:text-white transition-colors">FAQ</a>,{" "}
            <a href="/about" className="underline hover:text-white transition-colors">about</a>.
          </motion.p>
        </div>
      </MarketingPageShell>
    </>
  );
}
