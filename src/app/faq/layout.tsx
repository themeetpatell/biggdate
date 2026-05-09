import type { Metadata } from "next";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";
const TITLE = "Frequently Asked Questions · BiggDate";
const DESCRIPTION =
  "How BiggDate works, what makes it different from Bumble and Tinder, pricing, privacy, and how the AI relationship profiler Maahi builds your psychological profile.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["BiggDate FAQ", "AI dating app questions", "Maahi AI profiler", "soul profile dating", "dating app faq"],
  alternates: { canonical: `${APP_URL}/faq` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${APP_URL}/faq`,
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
