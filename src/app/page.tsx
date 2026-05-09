import type { Metadata } from "next";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingSocialRail } from "@/components/marketing-social-rail";
import { SimulationLanding } from "@/components/simulation-landing";

export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: "#060605",
        color: "var(--bd-text)",
      }}
    >
      <MarketingHeader activePage="home" />

      <SimulationLanding />

      <MarketingFooter />
      <MarketingSocialRail />
    </main>
  );
}

export const metadata: Metadata = {
  title: "BiggDate | AI Dating App for Intentional Adults",
  description: "BiggDate is the AI-led dating app that finds the one who's been waiting for you. Get curated daily matches based on your psychological Soul Profile built by Maahi.",
  keywords: ["AI dating app", "intentional dating", "matchmaking", "relationship app", "soul profile"],
  alternates: {
    canonical: "https://biggdate.app",
  },
  openGraph: {
    title: "BiggDate | AI Dating App for Intentional Adults",
    description: "BiggDate is the AI-led dating app that finds the one who's been waiting for you. Get curated daily matches based on your psychological Soul Profile.",
    url: "https://biggdate.app",
    type: "website",
  },
};
