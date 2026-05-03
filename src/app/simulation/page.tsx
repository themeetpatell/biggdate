import type { Metadata } from "next";
import { SimulationLanding } from "@/components/simulation-landing";

export const metadata: Metadata = {
  title: "The BiggDate Story — See How It Works",
  description: "An end-to-end cinematic walkthrough of how BiggDate finds your person — from soul profile to life preview.",
};

export default function SimulationPage() {
  return (
    <div style={{ background: "#030308", minHeight: "100vh" }}>
      <SimulationLanding />
    </div>
  );
}
