import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact BiggDate | Beta Access & Partnerships",
  description:
    "Reach the BiggDate team for beta access, product questions, partnerships, or general feedback about our AI dating app.",
  keywords: ["contact biggdate", "dating app beta access", "biggdate partnerships", "dating app support"],
  alternates: {
    canonical: "https://biggdate.app/contact",
  },
  openGraph: {
    title: "Contact BiggDate | Beta Access & Partnerships",
    description: "Reach the BiggDate team for beta access, product questions, partnerships, or general feedback.",
    url: "https://biggdate.app/contact",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
