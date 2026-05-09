import type { Metadata } from "next";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
