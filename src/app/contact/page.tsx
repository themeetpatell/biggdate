"use client";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircleMore, Users } from "lucide-react";
import { MARKETING_SOCIAL_LINKS } from "@/components/marketing-social-links";
import { MarketingPageShell } from "@/components/marketing-page-shell";
import { motion } from "framer-motion";

import { breadcrumbSchema, jsonLdString } from "@/lib/structured-data";



const CONTACT_LANES = [
  {
    icon: MessageCircleMore,
    title: "General questions",
    copy: "Product feedback, feature ideas, and anything you want the team to see.",
    href: "mailto:meet@biggventures.com?subject=BiggDate%20Question",
    cta: "Email the team",
  },
  {
    icon: Users,
    title: "Beta access",
    copy: "Want in, want to refer someone, or want to understand who we're building for.",
    href: "mailto:meet@biggventures.com?subject=BiggDate%20Beta%20Access",
    cta: "Ask about beta",
  },
  {
    icon: Mail,
    title: "Partnerships and press",
    copy: "Founder communities, events, partnerships, interviews, and thoughtful collaborations.",
    href: "mailto:meet@biggventures.com?subject=BiggDate%20Partnership",
    cta: "Start the conversation",
  },
];

const cardSurface: React.CSSProperties = {
  background: "linear-gradient(145deg, rgba(30, 36, 56, 0.4), rgba(15, 18, 30, 0.6))",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 36px 100px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.02)",
  backdropFilter: "blur(20px)",
};

export default function ContactPage() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "Contact", url: `${APP_URL}/contact` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
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
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl px-6 pb-12 sm:pb-20"
      >
        <div className="space-y-4">
          {CONTACT_LANES.map((lane, index) => {
            const Icon = lane.icon;

            return (
              <a
                key={lane.title}
                href={lane.href}
                className="group relative block overflow-hidden rounded-[30px] p-7 transition-all hover:scale-[1.005] sm:p-8"
                style={cardSurface}
              >
                <div
                  className="absolute inset-y-0 left-0 w-20"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--bd-cyan-glow), transparent)",
                  }}
                />
                <div className="relative grid gap-5 md:grid-cols-[84px_1fr_auto] md:items-center">
                  <div className="flex items-center gap-4 md:block">
                    <div
                      className="text-4xl font-semibold tracking-[-0.04em]"
                      style={{ color: "var(--bd-text-faint)", opacity: 0.4 }}
                    >
                      0{index + 1}
                    </div>
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl md:mt-3"
                      style={{
                        background: "var(--bd-surface-overlay)",
                        border: "1px solid var(--bd-border)",
                      }}
                    >
                      <Icon
                        className="size-5"
                        style={{ color: "var(--bd-cyan)" }}
                      />
                    </div>
                  </div>
                  <div>
                    <h2
                      className="text-xl font-semibold tracking-[-0.02em]"
                      style={{ color: "var(--bd-text)" }}
                    >
                      {lane.title}
                    </h2>
                    <p
                      className="mt-3 max-w-2xl text-sm leading-7 sm:text-base"
                      style={{ color: "var(--bd-text-muted)" }}
                    >
                      {lane.copy}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-2 text-sm font-medium md:justify-self-end"
                    style={{ color: "var(--bd-text)" }}
                  >
                    {lane.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto grid max-w-5xl items-stretch gap-8 px-6 pb-14 lg:grid-cols-[1.02fr_0.98fr]"
      >
        <div
          className="relative flex h-full flex-col overflow-hidden rounded-[34px] p-8 sm:p-10"
          style={cardSurface}
        >
          <div
            className="absolute right-0 top-0 h-36 w-36 rounded-full blur-3xl"
            style={{ background: "var(--bd-blue-glow)" }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--bd-blue)" }}
          >
            Best way to reach us
          </span>
          <p
            className="mt-5 max-w-lg font-display text-3xl leading-[1.25] tracking-[-0.03em]"
            style={{ color: "var(--bd-text)" }}
          >
            Email is still the cleanest path when the context matters.
          </p>
          <p
            className="mt-6 max-w-xl text-sm leading-7 sm:text-base"
            style={{ color: "var(--bd-text-muted)" }}
          >
            Add a few lines on who you are, what you want to talk about, and any
            useful links. If it&apos;s a beta request, include what kind of
            dating product you wish existed instead of another app that wants
            more swipes.
          </p>
          <div className="mt-8 grid gap-3 sm:max-w-md">
            <a
              href="mailto:meet@biggventures.com"
              className="inline-flex items-center justify-between rounded-[22px] px-5 py-4 text-sm font-medium transition-all"
              style={{
                background: "var(--bd-surface)",
                border: "1px solid var(--bd-border)",
                color: "var(--bd-text)",
              }}
            >
              meet@biggventures.com
              <ArrowRight className="size-4" />
            </a>
            <div
              className="rounded-[22px] px-5 py-4 text-sm leading-6"
              style={{
                background: "var(--bd-surface-sunken)",
                border: "1px solid var(--bd-border)",
                color: "var(--bd-text-muted)",
              }}
            >
              Fastest replies usually come when the note is specific about
              product, beta, or partnership intent.
            </div>
          </div>

          <div className="mt-8">
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: "var(--bd-blue)", opacity: 0.85 }}
            >
              Channels
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MARKETING_SOCIAL_LINKS.map((channel) => {
                const tileStyle: React.CSSProperties = {
                  background: "var(--bd-surface)",
                  border: "1px solid var(--bd-border)",
                  color: "var(--bd-text)",
                };

                const content = (
                  <>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-[1.03]"
                      style={{
                        background: "var(--bd-surface-sunken)",
                        border: "1px solid var(--bd-border)",
                        color: "var(--bd-text)",
                      }}
                    >
                      <channel.Icon />
                    </span>
                    <span className="mt-3 text-sm font-medium">
                      {channel.label}
                    </span>
                  </>
                );

                if (channel.href) {
                  const href = channel.href;

                  return (
                    <a
                      key={channel.label}
                      href={href}
                      className="group flex min-h-[84px] flex-col items-start justify-between rounded-[20px] px-4 py-4 text-left transition-all"
                      style={tileStyle}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http") ? "noreferrer" : undefined
                      }
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div
                    key={channel.label}
                    className="group flex min-h-[84px] flex-col items-start justify-between rounded-[20px] px-4 py-4 text-left"
                    style={tileStyle}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="flex h-full flex-col rounded-[34px] p-8 sm:p-10"
          style={cardSurface}
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--bd-accent)" }}
          >
            What we can help with
          </span>
          <div className="mt-6 space-y-4">
            {[
              "Beta requests from founders, operators, and other busy people who want a higher-signal way to date.",
              "Product feedback from people who have strong opinions on what existing dating apps get wrong.",
              "Partnerships, community intros, and founder conversations that align with the product we're building.",
            ].map((copy, i) => (
              <div
                key={copy}
                className={`rounded-[24px] px-5 py-5 ${i === 1 ? "lg:ml-8" : ""}`}
                style={{
                  background: "var(--bd-surface-sunken)",
                  border: "1px solid var(--bd-border)",
                }}
              >
                <div
                  className="text-[10px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: "var(--bd-accent)", opacity: 0.8 }}
                >
                  0{i + 1}
                </div>
                <p
                  className="mt-3 text-sm leading-7 sm:text-base"
                  style={{ color: "var(--bd-text)" }}
                >
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl px-6 pb-16 sm:pb-24"
      >
        <div
          className="flex flex-col gap-6 rounded-[30px] p-8 sm:flex-row sm:items-end sm:justify-between sm:p-10"
          style={cardSurface}
        >
          <div className="max-w-2xl">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--bd-pink)" }}
            >
              Start here
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              New here? See what BiggDate is trying to fix first.
            </h2>
            <p
              className="mt-3 text-sm leading-7 sm:text-base"
              style={{ color: "var(--bd-text-muted)" }}
            >
              If you want the short version before reaching out, the about page
              explains the product philosophy in two minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all"
              style={{
                background: "var(--bd-surface)",
                border: "1px solid var(--bd-border)",
                color: "var(--bd-text)",
              }}
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
      </motion.section>
    </MarketingPageShell>
    </>
  );
}
