import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Clock3,
  Compass,
  Gem,
  HeartHandshake,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { MarketingPageShell } from "@/components/marketing-page-shell";

export const metadata: Metadata = {
  title: "About BiggDate",
  description:
    "Learn why BiggDate exists and how we think about building a dating product for busy, intentional people.",
};

const PRINCIPLES = [
  {
    icon: Clock3,
    title: "Time is the product",
    body: "Most dating apps optimize for activity. We optimize for fewer wrong turns, fewer dead-end chats, and less calendar debt.",
  },
  {
    icon: Compass,
    title: "Context beats chemistry theater",
    body: "Attraction matters, but so do routines, conflict styles, communication habits, and the boring real-life details that decide whether something lasts.",
  },
  {
    icon: HeartHandshake,
    title: "Clarity is kinder",
    body: "We'd rather help people show up honestly than keep them trapped in endless maybes, mixed signals, and polished nonsense.",
  },
];

const AUDIENCE = [
  "Founders and operators whose calendars are already overbooked",
  "People tired of spending weeks learning what one good system could reveal earlier",
  "Daters who want warmth, not games, and substance, not performance",
];

const FOUNDERS = [
  {
    role: "CEO",
    icon: Gem,
    title: "Founder / CEO",
    focus:
      "Owns product vision, brand conviction, and the standard for a dating experience that feels premium without becoming performative.",
    accent: "rgba(255,20,147,0.18)",
  },
  {
    role: "CTO",
    icon: Code2,
    title: "Founder / CTO",
    focus:
      "Builds the systems layer: matching logic, AI intelligence, and the infrastructure that keeps the experience sharp, fast, and trustworthy.",
    accent: "rgba(123,159,255,0.18)",
  },
  {
    role: "CGO",
    icon: Megaphone,
    title: "Founder / CGO",
    focus:
      "Drives growth, partnerships, and community loops so the product reaches the right people instead of chasing empty top-of-funnel volume.",
    accent: "rgba(255,106,199,0.18)",
  },
];

export default function AboutPage() {
  return (
    <MarketingPageShell
      eyebrow="About BiggDate"
      title={
        <>
          Dating built for people
          <span className="block bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#7b9fff] bg-clip-text text-transparent">
            with real lives.
          </span>
        </>
      }
      description="BiggDate exists because modern dating keeps asking busy, thoughtful people to waste time proving the basics. We think the product should do more of that work upfront."
      activePage="about"
    >
      <section className="mx-auto grid max-w-5xl items-stretch gap-8 px-6 pb-14 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(15,18,30,0.96),rgba(28,14,31,0.88))] p-8 shadow-[0_32px_90px_rgba(0,0,0,0.3)] sm:p-10">
          <div className="absolute inset-y-8 left-8 w-px bg-gradient-to-b from-[#ff1493]/0 via-[#ff1493]/50 to-[#7b9fff]/0 sm:left-10" />
          <div className="pl-6 sm:pl-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7b9fff]">
              Why we exist
            </span>
            <p className="mt-5 max-w-2xl font-display text-2xl leading-[1.35] tracking-[-0.02em] text-[#f4efe8] sm:text-3xl">
              Dating apps kept asking thoughtful people to act like volume
              machines. BiggDate is what happens when the product starts
              respecting time, context, and actual adult lives.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <p className="text-sm leading-7 text-[#a8aabe] sm:text-base">
                We kept seeing the same pattern: smart people with full,
                ambitious lives were being pushed into high-volume dating
                behavior that rewarded stamina over substance.
              </p>
              <p className="text-sm leading-7 text-[#a8aabe] sm:text-base">
                BiggDate is our answer to that. We want it to feel closer to a
                good intro from someone who actually knows you: grounded,
                contextual, and honest about what makes a match workable.
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col rounded-[36px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(13,18,20,0.9),rgba(11,11,18,0.82))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)] sm:p-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8fd4a4]">
            <Sparkles className="size-3.5" />
            Who it&apos;s for
          </div>
          <div className="mt-6 space-y-4">
            {AUDIENCE.map((item, index) => (
              <div
                key={item}
                className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-black/18 px-5 py-5"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8fd4a4]/70">
                  0{index + 1}
                </span>
                <p className="mt-3 text-base leading-7 text-[#dceadf]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-14">
        <div className="mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4688a]">
            Our principles
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            The rules we want the product to live by.
          </h2>
        </div>

        <div className="space-y-4">
          {PRINCIPLES.map((principle, index) => {
            const Icon = principle.icon;

            return (
              <div
                key={principle.title}
                className="group relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(18,20,31,0.92),rgba(11,11,18,0.82))] p-7 sm:p-8"
              >
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/[0.04] to-transparent" />
                <div className="relative grid gap-5 sm:grid-cols-[84px_1fr] sm:items-start">
                  <div className="flex items-center gap-4 sm:block">
                    <div className="text-4xl font-semibold tracking-[-0.04em] text-white/10">
                      0{index + 1}
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                      <Icon className="size-5 text-[#f19bc5]" />
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <h3 className="text-xl font-semibold tracking-[-0.02em]">
                      {principle.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a8aabe] sm:text-base">
                      {principle.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-14">
        <div className="mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff6ac7]">
            Founding team
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Three distinct founder seats, one shared standard.
          </h2>
        </div>

        <div className="space-y-4">
          {FOUNDERS.map((founder, index) => {
            const Icon = founder.icon;

            return (
              <div
                key={founder.role}
                className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(16,18,28,0.94),rgba(24,12,25,0.9))] p-7 sm:p-8"
              >
                <div
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ background: founder.accent }}
                />
                <div className="grid gap-6 lg:grid-cols-[160px_1fr_72px] lg:items-center">
                  <div className="flex items-center gap-4 lg:block">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                      <Icon className="size-5 text-[#f8c6e8]" />
                    </div>
                    <div className="lg:mt-5">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8f92ab]">
                        Founder seat
                      </div>
                      <div className="mt-1 font-display text-3xl font-bold tracking-[-0.04em]">
                        {founder.role}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.02em]">
                      {founder.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a8aabe] sm:text-base">
                      {founder.focus}
                    </p>
                  </div>

                  <div className="text-right text-5xl font-semibold tracking-[-0.06em] text-white/8">
                    0{index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 sm:pb-24">
        <div className="flex flex-col gap-6 rounded-[30px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(10,14,26,0.92),rgba(22,14,24,0.9))] p-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff6ac7]">
              Keep in touch
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              If this sounds like your kind of dating product, say hi.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#a8aabe] sm:text-base">
              We&apos;re still early, which means the sharpest product input usually
              comes straight from people who are tired of the current options.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-5 py-3 text-sm font-medium text-[#f0ebe3] transition-all hover:border-white/[0.14] hover:bg-white/[0.08]"
            >
              Contact us
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#a855f7] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(212,104,138,0.35)] transition-transform hover:scale-[1.01]"
            >
              Join the beta
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
