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
      <main
        className="relative min-h-screen overflow-x-hidden pt-24 sm:pt-24"
        style={{
          background: "var(--bd-bg)",
          color: "var(--bd-text)",
        }}
      >
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <div
            className="absolute -left-72 -top-48 h-[700px] w-[700px] rounded-full opacity-70 blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, var(--bd-pink-glow), transparent 70%)",
            }}
          />
          <div
            className="absolute -right-52 top-[24%] h-[620px] w-[620px] rounded-full opacity-60 blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, var(--bd-blue-glow), transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-[35%] h-[420px] w-[420px] rounded-full opacity-50 blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, var(--bd-accent-glow), transparent 70%)",
            }}
          />
        </div>

        <div
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(var(--bd-text-faint) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        <MarketingHeader activePage={activePage} />

        <section className="relative z-10 px-6 pb-10 pt-4 sm:pb-16 sm:pt-24">
          <div
            className="mx-auto flex max-w-5xl flex-col items-center rounded-[32px] p-8 text-center backdrop-blur-xl sm:p-12"
            style={{
              background: "var(--bd-glass-bg)",
              border: "1px solid var(--bd-border)",
              boxShadow: "0 36px 100px rgba(0,0,0,0.18)",
            }}
          >
            <span
              className="inline-flex rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{
                background: "var(--bd-accent-soft)",
                border: "1px solid var(--bd-border-glow)",
                color: "var(--bd-pink)",
              }}
            >
              {eyebrow}
            </span>
            <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p
              className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--bd-text-muted)" }}
            >
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
