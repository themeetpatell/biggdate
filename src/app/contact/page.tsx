import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircleMore, Users } from "lucide-react";
import { MARKETING_SOCIAL_LINKS } from "@/components/marketing-social-links";
import { MarketingPageShell } from "@/components/marketing-page-shell";

export const metadata: Metadata = {
  title: "Contact BiggDate",
  description:
    "Reach the BiggDate team for beta access, product questions, partnerships, or general feedback.",
};

const CONTACT_LANES = [
  {
    icon: MessageCircleMore,
    title: "General questions",
    copy: "Product feedback, feature ideas, and anything you want the team to see.",
    href: "mailto:hello@biggdate.com?subject=BiggDate%20Question",
    cta: "Email the team",
  },
  {
    icon: Users,
    title: "Beta access",
    copy: "Want in, want to refer someone, or want to understand who we're building for.",
    href: "mailto:hello@biggdate.com?subject=BiggDate%20Beta%20Access",
    cta: "Ask about beta",
  },
  {
    icon: Mail,
    title: "Partnerships and press",
    copy: "Founder communities, events, partnerships, interviews, and thoughtful collaborations.",
    href: "mailto:hello@biggdate.com?subject=BiggDate%20Partnership",
    cta: "Start the conversation",
  },
];

export default function ContactPage() {
  return (
    <MarketingPageShell
      eyebrow="Contact BiggDate"
      title={
        <>
          Reach the team without
          <span className="block bg-gradient-to-r from-[#8fd4a4] via-[#7b9fff] to-[#d4688a] bg-clip-text text-transparent">
            the corporate maze.
          </span>
        </>
      }
      description="If you want to talk product, beta access, partnerships, or what modern dating apps keep getting wrong, this is the page."
      activePage="contact"
    >
      <section className="mx-auto max-w-5xl px-6 pb-12 sm:pb-20">
        <div className="space-y-4">
          {CONTACT_LANES.map((lane, index) => {
            const Icon = lane.icon;

            return (
              <a
                key={lane.title}
                href={lane.href}
                className="group relative block overflow-hidden rounded-[30px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(15,18,30,0.96),rgba(13,11,20,0.86))] p-7 transition-all hover:border-white/[0.14] hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-8"
              >
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#8fd4a4]/10 to-transparent" />
                <div className="relative grid gap-5 md:grid-cols-[84px_1fr_auto] md:items-center">
                  <div className="flex items-center gap-4 md:block">
                    <div className="text-4xl font-semibold tracking-[-0.04em] text-white/10">
                      0{index + 1}
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] md:mt-3">
                      <Icon className="size-5 text-[#8fd4a4]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.02em]">
                      {lane.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a8aabe] sm:text-base">
                      {lane.copy}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#f0ebe3] md:justify-self-end">
                    {lane.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl items-stretch gap-8 px-6 pb-14 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[34px] border border-[#7b9fff]/15 bg-[linear-gradient(180deg,rgba(123,159,255,0.08),rgba(9,13,24,0.82))] p-8 sm:p-10">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#7b9fff]/10 blur-3xl" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7b9fff]">
            Best way to reach us
          </span>
          <p className="mt-5 max-w-lg font-display text-3xl leading-[1.25] tracking-[-0.03em] text-[#d9e1f5]">
            Email is still the cleanest path when the context matters.
          </p>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#a8aabe] sm:text-base">
            Add a few lines on who you are, what you want to talk about, and any
            useful links. If it&apos;s a beta request, include what kind of dating
            product you wish existed instead of another app that wants more
            swipes.
          </p>
          <div className="mt-8 grid gap-3 sm:max-w-md">
            <a
              href="mailto:hello@biggdate.com"
              className="inline-flex items-center justify-between rounded-[22px] border border-white/[0.08] bg-white/[0.05] px-5 py-4 text-sm font-medium text-[#f0ebe3] transition-all hover:border-white/[0.14] hover:bg-white/[0.08]"
            >
              hello@biggdate.com
              <ArrowRight className="size-4" />
            </a>
            <div className="rounded-[22px] border border-white/[0.06] bg-black/15 px-5 py-4 text-sm leading-6 text-[#c7d3ea]">
              Fastest replies usually come when the note is specific about
              product, beta, or partnership intent.
            </div>
          </div>

          <div className="mt-8">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7b9fff]/80">
              Channels
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MARKETING_SOCIAL_LINKS.map((channel) => {
                const tileClassName =
                  "group flex min-h-[84px] flex-col items-start justify-between rounded-[20px] border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-left text-[#d8e2f6] transition-all hover:border-white/[0.14] hover:bg-white/[0.06]";

                const content = (
                  <>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-black/15 text-[#f0ebe3] transition-transform group-hover:scale-[1.03]">
                      <channel.Icon />
                    </span>
                    <span className="mt-3 text-sm font-medium">{channel.label}</span>
                  </>
                );

                if (channel.href) {
                  const href = channel.href;

                  return (
                    <a
                      key={channel.label}
                      href={href}
                      className={tileClassName}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div key={channel.label} className={tileClassName}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col rounded-[34px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(16,12,24,0.92),rgba(9,14,24,0.9))] p-8 sm:p-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff6ac7]">
            What we can help with
          </span>
          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-white/[0.06] bg-black/20 px-5 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#ff6ac7]/75">
                01
              </div>
              <p className="mt-3 text-sm leading-7 text-[#d8d0df] sm:text-base">
                Beta requests from founders, operators, and other busy people who
                want a higher-signal way to date.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/[0.06] bg-black/20 px-5 py-5 lg:ml-8">
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#ff6ac7]/75">
                02
              </div>
              <p className="mt-3 text-sm leading-7 text-[#d8d0df] sm:text-base">
                Product feedback from people who have strong opinions on what
                existing dating apps get wrong.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/[0.06] bg-black/20 px-5 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#ff6ac7]/75">
                03
              </div>
              <p className="mt-3 text-sm leading-7 text-[#d8d0df] sm:text-base">
                Partnerships, community intros, and founder conversations that
                align with the product we&apos;re building.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 sm:pb-24">
        <div className="flex flex-col gap-6 rounded-[30px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(16,12,24,0.92),rgba(9,14,24,0.9))] p-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4688a]">
              Start here
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              New here? See what BiggDate is trying to fix first.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#a8aabe] sm:text-base">
              If you want the short version before reaching out, the about page
              explains the product philosophy in two minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-5 py-3 text-sm font-medium text-[#f0ebe3] transition-all hover:border-white/[0.14] hover:bg-white/[0.08]"
            >
              Read about us
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
