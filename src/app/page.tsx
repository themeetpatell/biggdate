import { Nunito } from "next/font/google";
import { CinematicLanding } from "@/components/cinematic-landing";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export default function LandingPage() {
  return (
    <div className={nunito.variable}>
      <CinematicLanding />
    </div>
  );
}
