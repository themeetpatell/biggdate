import type { Metadata } from "next";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingSocialRail } from "@/components/marketing-social-rail";
import { SimulationLanding } from "@/components/simulation-landing";

export const metadata: Metadata = {
  title: "The BiggDate Story — See How It Works",
  description: "An end-to-end cinematic walkthrough of how BiggDate finds your person — from soul profile to life preview.",
};

export default function SimulationPage() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: "#060605",
        color: "var(--bd-text)",
      }}
    >
      <MarketingHeader activePage="simulation" />

      <SimulationLanding />

      <MarketingFooter />
      <MarketingSocialRail />
    </main>
  );
}
