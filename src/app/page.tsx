import { Nunito } from "next/font/google";
import { CinematicLanding } from "@/components/cinematic-landing";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export default function LandingPage() {
  // The cinematic landing is a dark-by-design experience (neon orbs,
  // gradient hero, deep gradients). We scope-lock it to dark so theme
  // toggles elsewhere on the site don't break its look. Every other
  // marketing surface (about, contact, compare, glossary, questions, vs,
  // faq, how-it-works, auth) themes correctly.
  return (
    <div className={`dark ${nunito.variable}`} style={{ colorScheme: "dark" }}>
      <CinematicLanding />
    </div>
  );
}
