"use client";

import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { motion } from "framer-motion";
import { MarketingFooter } from "@/components/marketing-footer";
import {
  MarketingHeader,
  type MarketingHeaderActivePage,
} from "@/components/marketing-header";
import { MarketingSocialRail } from "@/components/marketing-social-rail";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export function MarketingPageShell({
  eyebrow,
  title,
  description,
  activePage,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  activePage: MarketingHeaderActivePage;
  children: ReactNode;
}) {
  return (
    <div className={nunito.variable}>
      <main
        className="relative min-h-screen overflow-x-hidden pt-24 sm:pt-24"
        style={{
          background: "#060605",
          color: "var(--bd-text)",
        }}
      >
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute -left-72 -top-48 h-[700px] w-[700px] rounded-full blur-[90px]"
            style={{
              background: "radial-gradient(circle, var(--bd-pink-glow), transparent 70%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
            className="absolute -right-52 top-[24%] h-[620px] w-[620px] rounded-full blur-[90px]"
            style={{
              background: "radial-gradient(circle, var(--bd-blue-glow), transparent 70%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 3, delay: 1, ease: "easeOut" }}
            className="absolute bottom-0 left-[35%] h-[420px] w-[420px] rounded-full blur-[90px]"
            style={{
              background: "radial-gradient(circle, var(--bd-accent-glow), transparent 70%)",
            }}
          />
        </div>

        <div
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(var(--bd-text-faint) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
          }}
        />

        <MarketingHeader activePage={activePage} />

        <section className="relative z-10 px-6 pb-10 pt-4 sm:pb-16 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex max-w-5xl flex-col items-center rounded-[32px] p-8 text-center backdrop-blur-2xl sm:p-12 relative overflow-hidden"
            style={{
              background: "rgba(20, 24, 40, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 36px 100px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.02)",
            }}
          >
            <motion.div 
              className="absolute inset-0 z-0 opacity-30 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: "url('/noise.png')",
                backgroundSize: "100px",
              }}
            />
            <span
              className="relative z-10 inline-flex rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{
                background: "rgba(229,39,224,0.08)",
                border: "1px solid rgba(229,39,224,0.25)",
                color: "var(--bd-pink)",
              }}
            >
              {eyebrow}
            </span>
            <h1 className="relative z-10 mt-8 max-w-4xl font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl !leading-[1.15]" style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}>
              {title}
            </h1>
            <p
              className="relative z-10 mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {description}
            </p>
          </motion.div>
        </section>

        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>

        <MarketingFooter />
        <MarketingSocialRail />
      </main>
    </div>
  );
}
