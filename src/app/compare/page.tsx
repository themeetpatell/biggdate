"use client";
import {
  breadcrumbSchema,
  faqPageSchema,
  jsonLdString,
} from "@/lib/structured-data";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

const TITLE = "BiggDate vs Bumble vs Tinder vs Hinge vs Boo · Comparison";
const DESCRIPTION =
  "Compare BiggDate to Bumble, Tinder, Hinge, and Boo on onboarding depth, match volume, psychological profiling, contact gating, and AI relationship coaching. Find the right dating app for serious relationships in India and beyond.";



interface CompareRow {
  dimension: string;
  biggdate: string;
  bumble: string;
  tinder: string;
  hinge: string;
  boo: string;
}

const ROWS: CompareRow[] = [
  {
    dimension: "Primary intent",
    biggdate: "Serious relationships, marriage-track",
    bumble: "Mixed, women-first messaging",
    tinder: "Mostly casual",
    hinge: "Serious, designed to be deleted",
    boo: "Mixed, MBTI-compat focus",
  },
  {
    dimension: "Onboarding model",
    biggdate: "20-min AI conversation with Maahi",
    bumble: "5-min form + photo upload + prompts",
    tinder: "3-min form + photos",
    hinge: "10-min prompts + photos + basic facts",
    boo: "MBTI-style quiz + photos",
  },
  {
    dimension: "Psychological profile",
    biggdate: "Attachment style, conflict, love languages",
    bumble: "None",
    tinder: "None",
    hinge: "Limited (basic prompts only)",
    boo: "MBTI personality types",
  },
  {
    dimension: "Match volume",
    biggdate: "1–5 curated per day",
    bumble: "High-volume feed",
    tinder: "Very high feed",
    hinge: "Medium curated feed",
    boo: "High-volume feed",
  },
  {
    dimension: "Contact gating",
    biggdate: "Soul Knock — both must answer first",
    bumble: "Match → women send first within 24h",
    tinder: "Mutual swipe → either can send",
    hinge: "Like a prompt + first message",
    boo: "Mutual like → either can send",
  },
  {
    dimension: "Photos shown before contact",
    biggdate: "Hidden until both have demonstrated intent",
    bumble: "Always visible",
    tinder: "Always visible",
    hinge: "Always visible",
    boo: "Always visible",
  },
  {
    dimension: "AI relationship companion",
    biggdate: "Yes — Maahi (always available)",
    bumble: "No",
    tinder: "No",
    hinge: "No",
    boo: "AI chatbots, not a profiler",
  },
  {
    dimension: "Post-date debrief loop",
    biggdate: "Yes — structured 3-question reflection",
    bumble: "No",
    tinder: "No",
    hinge: "Yes — light feedback",
    boo: "No",
  },
  {
    dimension: "India-first context (DPDP, INR, market)",
    biggdate: "Yes",
    bumble: "No",
    tinder: "No",
    hinge: "No",
    boo: "No",
  },
  {
    dimension: "Ad-driven",
    biggdate: "No (subscription only)",
    bumble: "No",
    tinder: "Some ad units",
    hinge: "No",
    boo: "Some ad units",
  },
  {
    dimension: "Best for",
    biggdate: "Founders, professionals, marriage-track",
    bumble: "Women-led contact preference",
    tinder: "High-volume casual",
    hinge: "Relationship-track US/UK users",
    boo: "MBTI enthusiasts",
  },
];

const COMPARE_FAQ = [
  {
    question: "Which app is best for serious relationships?",
    answer:
      "BiggDate and Hinge are both designed for serious dating. BiggDate goes further by replacing the photo-first feed with a Soul Knock — both users must answer a question for each other before photos unlock. Hinge keeps the swipe-and-like model but emphasizes prompts and is positioned as \"designed to be deleted.\" If you're explicitly marriage-track or in India, BiggDate is purpose-built for that. If you're in the US/UK and want a familiar feed model with more depth than Tinder, Hinge is a strong choice.",
  },
  {
    question: "Why do BiggDate users not see photos until later?",
    answer:
      "Photos before intent train users to make 0.5-second decisions on appearance. BiggDate gates photos behind a Soul Knock — both users answer a question for each other before photos unlock. This filters out low-effort interest and forces actual engagement with who the person is, not just how they look in their best lighting.",
  },
  {
    question: "Is BiggDate's onboarding really 20 minutes?",
    answer:
      "Yes, intentionally. The 20-minute conversation with Maahi extracts attachment style, conflict pattern, love languages, dealbreakers, and growth areas — signal that a 5-minute form can't approximate. Anyone unwilling to invest 20 minutes is probably not the user we want, and the depth of onboarding self-selects users who are serious about a relationship.",
  },
  {
    question: "How does BiggDate compare to arranged-marriage platforms in India?",
    answer:
      "BiggDate is not an arranged-marriage platform. It does not involve family setups, biodata exchange, or family-driven decision making. It is a relationship app for adults choosing their own partners — \"marriage eventually\" is one of the supported intents, alongside \"ready for real love\" and \"just exploring.\" BiggDate does ask, in onboarding, how much family approval matters to you, which surfaces compatibility around that question without making the experience family-led.",
  },
  {
    question: "Does Bumble or Tinder have anything like Maahi?",
    answer:
      "No. Neither Bumble nor Tinder has a structured AI relationship profiler that conducts a directed interview, derives a psychological profile, and remains available as an ongoing companion. Both have basic AI features for icebreakers and content moderation, but no equivalent to BiggDate's Maahi.",
  },
];

import { MarketingPageShell } from "@/components/marketing-page-shell";
import { motion } from "framer-motion";

export default function ComparePage() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "Compare", url: `${APP_URL}/compare` },
  ]);
  const faq = faqPageSchema(COMPARE_FAQ);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <MarketingPageShell
        eyebrow="Comparison"
        title="BiggDate vs Bumble vs Tinder vs Hinge vs Boo."
        description="An honest, dimension-by-dimension comparison of the major dating apps. Updated 2026-05-01."
        activePage="compare"
      >
        <div className="mx-auto max-w-5xl px-6 pb-20">
          {/* Comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="overflow-x-auto rounded-[24px] border relative"
            style={{ 
              borderColor: "rgba(255,255,255,0.08)", 
              background: "linear-gradient(145deg, rgba(30, 36, 56, 0.4), rgba(15, 18, 30, 0.6))",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 70px rgba(0,0,0,0.2)"
            }}
          >
            <table className="w-full min-w-[760px] text-left text-[14px]">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th className="px-6 py-5 font-semibold" style={{ color: "var(--bd-text-faint)" }}>
                    Dimension
                  </th>
                  <th className="px-6 py-5 font-semibold text-[15px]" style={{ color: "var(--bd-accent)" }}>BiggDate</th>
                  <th className="px-6 py-5 font-semibold">Bumble</th>
                  <th className="px-6 py-5 font-semibold">Tinder</th>
                  <th className="px-6 py-5 font-semibold">Hinge</th>
                  <th className="px-6 py-5 font-semibold">Boo</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.dimension} className="group hover:bg-white/5 transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="px-6 py-4 font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                      {row.dimension}
                    </td>
                    <td className="px-6 py-4 font-medium" style={{ color: "var(--bd-text)" }}>{row.biggdate}</td>
                    <td className="px-6 py-4" style={{ color: "rgba(255,255,255,0.5)" }}>{row.bumble}</td>
                    <td className="px-6 py-4" style={{ color: "rgba(255,255,255,0.5)" }}>{row.tinder}</td>
                    <td className="px-6 py-4" style={{ color: "rgba(255,255,255,0.5)" }}>{row.hinge}</td>
                    <td className="px-6 py-4" style={{ color: "rgba(255,255,255,0.5)" }}>{row.boo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Verdict per app */}
          <section className="mt-20 grid gap-6 sm:grid-cols-2">
            <Verdict title="Choose BiggDate if…" bullets={[
              "You want a relationship, not a feed",
              "You're in India or value India-first context",
              "You're a founder, professional, or builder who wants depth",
              "You're tired of swipe culture and willing to invest 20 minutes up front",
              "You want an AI companion that remembers your patterns over time",
            ]} accent />
            <Verdict title="Choose Hinge if…" bullets={[
              "You're in the US/UK and want a familiar feed model",
              "You like the prompt-first profile format",
              "Marriage-track is important but you don't want a 20-min conversation",
            ]} />
            <Verdict title="Choose Bumble if…" bullets={[
              "You prefer women-make-the-first-move dynamics",
              "You want both dating and platonic networking in one app",
              "You're comfortable with a high-volume feed",
            ]} />
            <Verdict title="Choose Tinder if…" bullets={[
              "You want maximum volume and casual energy",
              "You're traveling and want quick connections",
              "You're not specifically looking for a long-term relationship right now",
            ]} />
          </section>

          {/* FAQ */}
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-24"
          >
            <h2 className="text-3xl font-light tracking-tight text-center mb-12">Comparison questions</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              {COMPARE_FAQ.map((qa, i) => (
                <motion.div 
                  key={qa.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl p-6 relative overflow-hidden group"
                  style={{
                    background: "linear-gradient(145deg, rgba(30, 36, 56, 0.4), rgba(15, 18, 30, 0.6))",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <h3 className="text-lg font-medium">{qa.question}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {qa.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center text-sm" 
            style={{ color: "var(--bd-text-faint)" }}
          >
            See also: <a href="/how-it-works" className="underline hover:text-white transition-colors">how BiggDate works</a>,{" "}
            <a href="/faq" className="underline hover:text-white transition-colors">FAQ</a>,{" "}
            <a href="/about" className="underline hover:text-white transition-colors">about</a>.
          </motion.p>
        </div>
      </MarketingPageShell>
    </>
  );
}

function Verdict({
  title,
  bullets,
  accent,
}: {
  title: string;
  bullets: string[];
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: accent ? "rgba(229,39,224,0.3)" : "rgba(255,255,255,0.08)",
        background: accent
          ? "linear-gradient(180deg, rgba(45,16,70,0.36), rgba(21,13,40,0.24))"
          : "rgba(20,24,40,0.4)",
      }}
    >
      <h3 className="text-base font-semibold" style={{ color: accent ? "var(--bd-accent)" : "var(--bd-text)" }}>
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-[13px]" style={{ color: "var(--bd-text-muted)" }}>
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span style={{ color: accent ? "var(--bd-accent)" : "var(--bd-text-faint)" }}>—</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
