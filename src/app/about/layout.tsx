import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BiggDate | The App for Busy Professionals",
  description:
    "Learn why BiggDate exists and how our founding team builds an intentional dating product for busy, thoughtful people like founders and operators.",
  keywords: ["about biggdate", "dating app founders", "intentional dating", "dating app for professionals"],
  alternates: {
    canonical: "https://biggdate.app/about",
  },
  openGraph: {
    title: "About BiggDate | The App for Busy Professionals",
    description: "Learn why BiggDate exists and how we think about building a dating product for busy, intentional people.",
    url: "https://biggdate.app/about",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
