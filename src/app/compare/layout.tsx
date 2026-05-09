import type { Metadata } from "next";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";
const TITLE = "BiggDate vs Bumble vs Tinder vs Hinge vs Boo · Comparison";
const DESCRIPTION =
  "Compare BiggDate to Bumble, Tinder, Hinge, and Boo on onboarding depth, match volume, psychological profiling, contact gating, and AI relationship coaching. Find the right dating app for serious relationships in India and beyond.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["BiggDate vs Bumble", "BiggDate vs Hinge", "dating app comparison", "Tinder alternative", "Hinge alternative"],
  alternates: { canonical: `${APP_URL}/compare` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${APP_URL}/compare`,
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
