import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: "🧠",
    title: "Soul Discovery",
    desc: "7-minute AI conversation that understands you deeper than any questionnaire ever could.",
  },
  {
    icon: "🔮",
    title: "Life Previews",
    desc: "See what your life could look like with someone — a cinematic vision of your future together.",
  },
  {
    icon: "🤝",
    title: "Agent Matching",
    desc: "Your AI agent negotiates with theirs. Only introductions that make sense for both sides.",
  },
  {
    icon: "📈",
    title: "Growth Loop",
    desc: "Post-date debriefs, coaching, and real-time readiness tracking. You get better at love.",
  },
];

const COMPARISON = [
  { label: "Profile", them: "Photos + bio", us: "Soul profile + attachment map" },
  { label: "Matching", them: "Swipe on looks", us: "AI Life Previews of your future" },
  { label: "Intros", them: "Unlimited spam", us: "Curated + concierge-mediated" },
  { label: "After dates", them: "Nothing", us: "Debrief + coaching + growth" },
  { label: "Goal", them: "Engagement time", us: "Meaningful connections" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Orbs */}
      <div
        className="pointer-events-none fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--bd-rose)", animation: "orb2 18s ease-in-out infinite" }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight" style={{ color: "var(--bd-accent)" }}>
          BiggDate
        </span>
        <div className="flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost" size="sm" className="text-[var(--bd-text-muted)] hover:text-[var(--bd-text)]">
              Log in
            </Button>
          </Link>
          <Link href="/auth">
            <Button
              size="sm"
              className="bg-[var(--bd-accent)] text-black font-semibold hover:opacity-90 rounded-full px-5"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-4xl mx-auto">
        <Badge className="mb-6 bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border-none text-xs tracking-wide page-enter">
          AI-POWERED DATING
        </Badge>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05] mb-6 page-enter page-enter-delay-1">
          See your <span style={{ color: "var(--bd-accent)" }}>future</span>,<br />
          not just a profile
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 page-enter page-enter-delay-2" style={{ color: "var(--bd-text-muted)" }}>
          The first dating app that shows you what life looks like with someone before you ever meet.
          Soul profiling. Life Previews. Relationship coaching. The way dating should work.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 page-enter page-enter-delay-3">
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-[var(--bd-accent)] text-black font-bold text-base rounded-full px-8 py-6 hover:opacity-90"
              style={{ animation: "glow 3s ease-in-out infinite" }}
            >
              Discover Your Soul Profile
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 border-[var(--bd-border)] text-[var(--bd-text-muted)] hover:text-[var(--bd-text)] hover:border-[var(--bd-accent)]"
            >
              How It Works
            </Button>
          </a>
        </div>

        {/* Social proof */}
        <div className="flex gap-8 mt-14 text-center">
          {[
            ["2,847", "Soul Profiles"],
            ["89%", "Readiness Growth"],
            ["12 min", "Avg. Discovery"],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-2xl font-bold" style={{ color: "var(--bd-accent)" }}>{num}</div>
              <div className="text-xs mt-1" style={{ color: "var(--bd-text-faint)" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Dating, <span style={{ color: "var(--bd-accent)" }}>reimagined</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-5 stagger-children">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 border bd-card-hover hover:border-[var(--bd-accent)]/30"
              style={{
                background: "var(--bd-surface)",
                borderColor: "var(--bd-border)",
              }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--bd-text-muted)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Life Preview teaser */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div
          className="rounded-3xl p-8 sm:p-12 border text-center"
          style={{
            background: "linear-gradient(135deg, var(--bd-surface) 0%, rgba(180,140,255,0.05) 100%)",
            borderColor: "var(--bd-border-glow)",
          }}
        >
          <div className="text-4xl mb-4">🔮</div>
          <h2 className="text-3xl font-bold mb-4">Life Previews</h2>
          <p className="text-base max-w-xl mx-auto mb-6" style={{ color: "var(--bd-text-muted)" }}>
            Every other app shows you a person. We show you a <strong className="text-[var(--bd-text)]">future</strong>.
            AI-generated visions of what your first year together could look like — the morning
            routines, the turning points, the growth, and the honest truths.
          </p>
          <p
            className="text-sm italic max-w-lg mx-auto"
            style={{ color: "var(--bd-accent)", opacity: 0.8 }}
          >
            &quot;You&apos;d meet at a farmer&apos;s market — she&apos;d notice your laugh first. The first three months
            would be electric...&quot;
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Not another swiping app
        </h2>
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--bd-border)" }}>
          <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wider px-5 py-3" style={{ background: "var(--bd-surface)", color: "var(--bd-text-faint)" }}>
            <span />
            <span>Them</span>
            <span style={{ color: "var(--bd-accent)" }}>BiggDate</span>
          </div>
          {COMPARISON.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-3 px-5 py-3 text-sm border-t"
              style={{
                borderColor: "var(--bd-border)",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
              }}
            >
              <span className="font-medium">{row.label}</span>
              <span style={{ color: "var(--bd-text-muted)" }}>{row.them}</span>
              <span style={{ color: "var(--bd-green)" }}>{row.us}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center px-6 py-24">
        <h2 className="text-4xl font-bold mb-4">Ready to meet yourself first?</h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "var(--bd-text-muted)" }}>
          5 minutes. Zero swiping. One soul profile that changes how you date forever.
        </p>
        <Link href="/auth">
          <Button
            size="lg"
            className="bg-[var(--bd-rose)] text-white font-bold text-base rounded-full px-10 py-6 hover:opacity-90"
          >
            Start Your Soul Discovery
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-xs" style={{ color: "var(--bd-text-faint)" }}>
        &copy; 2026 BiggDate. The future of dating.
      </footer>
    </div>
  );
}
