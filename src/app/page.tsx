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
  title: "The BiggDate Story — A Love You Haven't Lived Yet",
  description: "Somewhere out there, she's looking too. Watch the story of how BiggDate finds the one who's been waiting for you — chapter by chapter.",
};
