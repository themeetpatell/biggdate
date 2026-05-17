import Link from "next/link";
import type { Metadata } from "next";

// Reached only via redirect from proxy.ts when the visitor's IP is geolocated
// to an EEA member state, the UK, or Switzerland. BiggDate currently has no
// EU representative under GDPR Art. 27 and no UK rep under UK-GDPR, so we
// can't lawfully offer the service in those regions. Privacy + Terms both
// declare this; the proxy is what makes the declaration true.

export const metadata: Metadata = {
  title: "BiggDate is not available in your region",
  description:
    "BiggDate is not currently offered in the European Economic Area, the United Kingdom, or Switzerland.",
  robots: { index: false, follow: false },
};

export default function RegionBlockedPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-16"
      style={{ background: "var(--bd-bg)", color: "var(--bd-text)" }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-8 sm:p-10"
        style={{
          background: "var(--bd-glass-bg)",
          border: "1px solid var(--bd-border)",
          boxShadow:
            "inset 0 1px 0 var(--bd-surface-overlay), 0 32px 90px rgba(0,0,0,0.18)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--bd-text-muted)" }}
        >
          BiggDate
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          We&apos;re not live in your region yet.
        </h1>
        <p
          className="mt-4 text-[15px] leading-relaxed"
          style={{ color: "var(--bd-text-muted)" }}
        >
          BiggDate is currently offered in India, the UAE, the United States,
          and select other markets. We are <strong>not</strong> live in the
          European Economic Area, the United Kingdom, or Switzerland.
        </p>
        <p
          className="mt-3 text-[15px] leading-relaxed"
          style={{ color: "var(--bd-text-muted)" }}
        >
          If you believe you&apos;re seeing this in error — for example, you&apos;re
          travelling — please reach us at{" "}
          <a
            href="mailto:hello@biggdate.com"
            className="underline"
            style={{ color: "var(--bd-text)" }}
          >
            hello@biggdate.com
          </a>
          .
        </p>
        <p
          className="mt-6 text-xs"
          style={{ color: "var(--bd-text-faint)" }}
        >
          Why? GDPR / UK-GDPR require us to appoint a local representative
          before we offer the service. We&apos;re working on it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/privacy"
            className="rounded-full px-4 py-2 text-sm font-medium underline underline-offset-4"
            style={{ color: "var(--bd-text)" }}
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="rounded-full px-4 py-2 text-sm font-medium underline underline-offset-4"
            style={{ color: "var(--bd-text)" }}
          >
            Terms
          </Link>
        </div>
      </div>
    </main>
  );
}
