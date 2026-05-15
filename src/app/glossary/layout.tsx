import type { Metadata } from "next";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";
const TITLE = "BiggDate Glossary · Soul Profile, Maahi, Attachment Style, and more";
const DESCRIPTION =
  "Plain-language definitions of every concept BiggDate uses — Soul Profile, Soul Knock, Maahi, attachment style, conflict style, love languages, date debrief, Pink Tick verification, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["BiggDate glossary", "dating app terms", "Soul Profile", "Soul Knock", "Maahi AI"],
  alternates: { canonical: `${APP_URL}/glossary` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${APP_URL}/glossary`,
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
