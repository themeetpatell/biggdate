import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
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
  activePage: "about" | "contact";
  children: ReactNode;
}) {
  return (
    <div className={nunito.variable}>
      <main className="relative min-h-screen overflow-x-hidden bg-[#06060e] pt-20 text-[#f0ebe3] sm:pt-24">
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <div
            className="absolute -left-72 -top-48 h-[700px] w-[700px] rounded-full opacity-70 blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, rgba(232,146,124,0.18), transparent 70%)",
            }}
          />
          <div
            className="absolute -right-52 top-[24%] h-[620px] w-[620px] rounded-full opacity-60 blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, rgba(123,159,255,0.16), transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-[35%] h-[420px] w-[420px] rounded-full opacity-50 blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, rgba(212,104,138,0.14), transparent 70%)",
            }}
          />
        </div>

        <div
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        <MarketingHeader activePage={activePage} />

        <section className="relative z-10 px-6 pb-10 pt-14 sm:pb-16 sm:pt-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[32px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-8 text-center shadow-[0_36px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-12">
            <span className="inline-flex rounded-full border border-[#ff1493]/20 bg-[#ff1493]/[0.08] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6ac7]">
              {eyebrow}
            </span>
            <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#a8aabe] sm:text-lg">
              {description}
            </p>
          </div>
        </section>

        <div className="relative z-10">{children}</div>

        <MarketingFooter />
        <MarketingSocialRail />
      </main>
    </div>
  );
}
