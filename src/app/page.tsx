import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CalendarHeart,
  Eye,
  HeartHandshake,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Stars,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SIGNALS = [
  { value: "11.2k", label: "Soul signals captured" },
  { value: "3.4x", label: "More intentional intros" },
  { value: "89%", label: "Users say they felt seen" },
];

const STORY_STEPS = [
  {
    icon: Brain,
    title: "Soul Discovery",
    copy:
      "A sharp AI conversation reads your attachment style, romantic blind spots, standards, and relationship tempo in minutes.",
  },
  {
    icon: Eye,
    title: "Life Preview",
    copy:
      "Before you waste a week texting, BiggDate shows you the emotional rhythm, chemistry pattern, and first-year story arc.",
  },
  {
    icon: HeartHandshake,
    title: "Curated Introduction",
    copy:
      "No inbox chaos. No random likes. Just a guided intro when both agents see actual long-term signal.",
  },
];

const DIFFERENCE = [
  { label: "What gets optimized", other: "Attention and swipes", biggdate: "Alignment and actual readiness" },
  { label: "What you learn", other: "Height, bio, 6 photos", biggdate: "Conflict style, depth, pacing, values" },
  { label: "Before the first date", other: "Guesswork and projection", biggdate: "A compatibility brief and likely friction map" },
  { label: "After the date", other: "Silence", biggdate: "Debrief, coaching, pattern correction" },
];

const HIGHLIGHTS = [
  {
    title: "Built for people tired of performing",
    body:
      "The product feels less like a marketplace and more like a high-context introduction service with a brain.",
  },
  {
    title: "Looks premium because it is opinionated",
    body:
      "Every screen pushes toward one thing: fewer empty interactions and more emotionally coherent matches.",
  },
  {
    title: "AI that increases standards",
    body:
      "BiggDate does not make dating noisier. It gives language to what your gut already knew but could not explain.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "For the first time, a dating product described the emotional texture of a match instead of just selling me access.",
    author: "Maya, 29",
    role: "Brand strategist",
  },
  {
    quote:
      "The pre-date brief was brutal in the best way. It called out exactly where I tend to mistake intensity for compatibility.",
    author: "Aarav, 31",
    role: "Founder",
  },
  {
    quote:
      "It feels like the app is protecting my time instead of trying to keep me scrolling.",
    author: "Sofia, 27",
    role: "Architect",
  },
];

const PREVIEW_BEATS = [
  "How fast the relationship will feel emotionally safe",
  "What chemistry is real vs. projected",
  "The first conflict likely to show up",
  "Whether your life rhythms actually fit",
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bd-bg)] text-[var(--bd-text)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(255,107,138,0.18), transparent 28%), radial-gradient(circle at 84% 14%, rgba(245,200,66,0.15), transparent 26%), radial-gradient(circle at 70% 72%, rgba(79,255,176,0.12), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 28%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent 95%)",
        }}
      />

      <div className="pointer-events-none absolute left-[-8rem] top-24 h-80 w-80 rounded-full blur-[110px]" style={{ background: "rgba(255,107,138,0.16)" }} />
      <div className="pointer-events-none absolute right-[-10rem] top-0 h-[28rem] w-[28rem] rounded-full blur-[120px]" style={{ background: "rgba(245,200,66,0.14)" }} />
      <div className="pointer-events-none absolute bottom-[-8rem] left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full blur-[120px]" style={{ background: "rgba(79,255,176,0.12)" }} />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl border"
            style={{
              borderColor: "rgba(255,255,255,0.12)",
              background: "linear-gradient(135deg, rgba(255,107,138,0.24), rgba(245,200,66,0.24))",
            }}
          >
            <Stars className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bd-text-faint)]">
              BiggDate
            </div>
            <div className="text-sm text-[var(--bd-text-muted)]">Dating with context, not chaos</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge className="hidden border-none bg-white/8 px-3 py-1 text-[10px] tracking-[0.22em] text-[var(--bd-gold)] sm:inline-flex">
            PRIVATE BETA
          </Badge>
          <Link href="/auth">
            <Button variant="ghost" className="rounded-full px-4 text-[var(--bd-text-muted)] hover:text-[var(--bd-text)]">
              Log in
            </Button>
          </Link>
          <Link href="/auth">
            <Button
              className="rounded-full border-0 px-5 font-semibold text-black"
              style={{ background: "linear-gradient(135deg, var(--bd-gold), #ff9d74)" }}
            >
              Join Beta
            </Button>
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="max-w-3xl">
          <Badge className="mb-6 border-none bg-white/8 px-4 py-1.5 text-[11px] tracking-[0.24em] text-[var(--bd-rose)] page-enter">
            THE ANTI-SWIPE APP
          </Badge>

          <h1 className="page-enter page-enter-delay-1 text-[3.2rem] font-bold leading-[0.95] tracking-[-0.06em] sm:text-[4.6rem] lg:text-[6.5rem]">
            Stop
            <span className="mx-3 inline-block text-[var(--bd-gold)]">guessing</span>
            who someone is.
          </h1>

          <p className="page-enter page-enter-delay-2 mt-6 max-w-2xl text-lg leading-8 text-[var(--bd-text-muted)] sm:text-xl">
            BiggDate reads the emotional architecture of a match before you invest your time.
            Soul profiling. Life previews. Guided intros. Real post-date growth.
            This is what dating looks like when the product is designed to get you off the app.
          </p>

          <div className="page-enter page-enter-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth">
              <Button
                size="lg"
                className="group rounded-full border-0 px-8 py-6 text-base font-semibold text-black"
                style={{ background: "linear-gradient(135deg, var(--bd-gold), #ff9d74)" }}
              >
                Start your soul profile
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#difference">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/12 bg-white/3 px-8 py-6 text-base text-[var(--bd-text)] hover:border-[var(--bd-rose)] hover:bg-white/6"
              >
                Why this beats swiping
              </Button>
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {SIGNALS.map((signal, index) => (
              <div
                key={signal.label}
                className={`page-enter rounded-[1.75rem] border p-4 page-enter-delay-${Math.min(index + 2, 5)}`}
                style={{
                  borderColor: "rgba(255,255,255,0.09)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                }}
              >
                <div className="text-2xl font-semibold text-[var(--bd-text)]">{signal.value}</div>
                <div className="mt-1 text-sm leading-6 text-[var(--bd-text-muted)]">{signal.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative page-enter page-enter-delay-4">
          <div
            className="absolute inset-x-[10%] top-[-8%] h-28 rounded-full blur-3xl"
            style={{ background: "rgba(255,107,138,0.22)" }}
          />

          <div
            className="relative overflow-hidden rounded-[2rem] border p-4 sm:p-5"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              background:
                "linear-gradient(180deg, rgba(16,17,24,0.96), rgba(10,10,15,0.92))",
              boxShadow: "0 18px 70px rgba(0,0,0,0.34)",
            }}
          >
            <div className="flex items-center justify-between rounded-[1.4rem] border px-4 py-3" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-[var(--bd-text-faint)]">Live preview</div>
                <div className="mt-1 text-lg font-semibold">What your future together actually feels like</div>
              </div>
              <div className="rounded-full border px-3 py-1 text-xs text-[var(--bd-green)]" style={{ borderColor: "rgba(79,255,176,0.24)", background: "rgba(79,255,176,0.08)" }}>
                Intent match +92
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="space-y-4">
                <div className="rounded-[1.5rem] border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg" style={{ background: "rgba(255,107,138,0.14)" }}>
                      A
                    </div>
                    <div>
                      <div className="font-medium">You</div>
                      <div className="text-sm text-[var(--bd-text-muted)]">Depth-first. Slow burn. Needs emotional steadiness.</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg" style={{ background: "rgba(245,200,66,0.14)" }}>
                      M
                    </div>
                    <div>
                      <div className="font-medium">Mila, 29</div>
                      <div className="text-sm text-[var(--bd-text-muted)]">Secure. Warm. Stylish. High follow-through.</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(255,107,138,0.08), rgba(255,255,255,0.03))" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--bd-text-muted)]">Emotional forecast</span>
                    <span className="text-sm font-semibold text-[var(--bd-gold)]">Strong signal</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full w-[84%] rounded-full" style={{ background: "linear-gradient(90deg, var(--bd-rose), var(--bd-gold))" }} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--bd-text-muted)]">
                    This one feels calm fast. Chemistry is strong, but the bigger story is consistency.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border p-5" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))" }}>
                <div className="flex items-center gap-2 text-[var(--bd-gold)]">
                  <Sparkles className="size-4" />
                  <span className="text-xs uppercase tracking-[0.22em]">Year-one preview</span>
                </div>

                <p className="mt-4 text-[1.05rem] leading-8 text-[var(--bd-text)] sm:text-lg">
                  You would probably start as a <span className="text-[var(--bd-gold)]">slow, surprisingly easy connection</span>.
                  The attraction is obvious, but the real differentiator is pace: neither of you needs to force closeness.
                  Around month three, your instinct to withdraw under pressure meets her instinct to clarify early.
                  That friction is not a red flag. It is the exact place where the match either becomes trust or falls apart.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {PREVIEW_BEATS.map((item) => (
                    <div key={item} className="rounded-2xl border px-4 py-3 text-sm text-[var(--bd-text-muted)]" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)" }}>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.4rem] border px-4 py-4" style={{ borderColor: "rgba(79,255,176,0.18)", background: "rgba(79,255,176,0.06)" }}>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 text-[var(--bd-green)]" />
                    <p className="text-sm leading-6 text-[var(--bd-text-muted)]">
                      BiggDate only opens the intro once the emotional signal, timing, and intent alignment all clear the threshold.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((item, index) => (
            <div
              key={item.title}
              className={`rounded-[1.8rem] border p-6 page-enter page-enter-delay-${Math.min(index + 1, 5)}`}
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018))",
              }}
            >
              <div className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--bd-text-faint)]">
                Why it feels different
              </div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--bd-text-muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8" id="difference">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--bd-rose)]">The product thesis</div>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
            Tinder optimized for volume.
            <br />
            <span className="text-[var(--bd-gold)]">BiggDate optimizes for consequence.</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[var(--bd-text-muted)]">
            The category keeps treating dating like discovery. The real problem is evaluation.
            BiggDate is built to tell you whether a connection can actually hold weight once reality shows up.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="grid grid-cols-[1.05fr_1fr_1fr] border-b px-5 py-4 text-xs uppercase tracking-[0.22em] sm:px-7" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
            <span className="text-[var(--bd-text-faint)]">System</span>
            <span className="text-[var(--bd-text-muted)]">Typical app</span>
            <span className="text-[var(--bd-gold)]">BiggDate</span>
          </div>
          {DIFFERENCE.map((row, index) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-4 border-b px-5 py-5 sm:grid-cols-[1.05fr_1fr_1fr] sm:px-7"
              style={{
                borderColor: index === DIFFERENCE.length - 1 ? "transparent" : "rgba(255,255,255,0.07)",
                background: index % 2 === 0 ? "rgba(255,255,255,0.018)" : "transparent",
              }}
            >
              <div className="text-sm font-semibold text-[var(--bd-text)]">{row.label}</div>
              <div className="text-sm leading-7 text-[var(--bd-text-muted)]">{row.other}</div>
              <div className="text-sm leading-7 text-[var(--bd-green)]">{row.biggdate}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] border p-6 sm:p-8" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))" }}>
            <div className="flex items-center gap-2 text-[var(--bd-gold)]">
              <MessagesSquare className="size-4" />
              <span className="text-xs uppercase tracking-[0.22em]">How it works</span>
            </div>

            <div className="mt-8 space-y-8">
              {STORY_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                        <Icon className="size-5 text-[var(--bd-text)]" />
                      </div>
                      {index < STORY_STEPS.length - 1 ? (
                        <div className="mt-3 h-full w-px bg-white/10" />
                      ) : null}
                    </div>
                    <div className="pb-4">
                      <div className="text-sm uppercase tracking-[0.22em] text-[var(--bd-text-faint)]">
                        Step {index + 1}
                      </div>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--bd-text-muted)]">{step.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border p-6 sm:p-8" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(135deg, rgba(255,107,138,0.09), rgba(245,200,66,0.08) 55%, rgba(255,255,255,0.03))" }}>
              <div className="flex items-center gap-2 text-[var(--bd-rose)]">
                <CalendarHeart className="size-4" />
                <span className="text-xs uppercase tracking-[0.22em]">Post-date intelligence</span>
              </div>
              <h3 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Every date makes your next choice smarter.
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--bd-text-muted)]">
                The app does not stop at the intro. It helps you debrief what happened,
                separate signal from fantasy, and raise your relational taste over time.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(10,10,15,0.34)" }}>
                  <TrendingUp className="size-5 text-[var(--bd-gold)]" />
                  <div className="mt-3 text-lg font-medium">Pattern correction</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--bd-text-muted)]">
                    See the recurring dynamic that keeps showing up before it costs you another month.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(10,10,15,0.34)" }}>
                  <Sparkles className="size-5 text-[var(--bd-green)]" />
                  <div className="mt-3 text-lg font-medium">Readiness growth</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--bd-text-muted)]">
                    Improve the way you choose, communicate, and pace intimacy with actual feedback loops.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <div
                  key={item.author}
                  className="rounded-[1.8rem] border p-5"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
                  }}
                >
                  <p className="text-sm leading-7 text-[var(--bd-text)]">“{item.quote}”</p>
                  <div className="mt-5 text-sm font-medium">{item.author}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--bd-text-faint)]">{item.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-6 lg:px-8">
        <div
          className="overflow-hidden rounded-[2.4rem] border px-6 py-8 sm:px-10 sm:py-10"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            background:
              "linear-gradient(135deg, rgba(255,107,138,0.12), rgba(245,200,66,0.1) 42%, rgba(79,255,176,0.09) 100%)",
          }}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.24em] text-[var(--bd-text-faint)]">Ready when you are</div>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
                If the category feels broken, your standards probably are not too high.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[var(--bd-text-muted)]">
                Join the beta and get a dating product that treats chemistry, timing, and emotional readiness like they actually matter.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="rounded-full border-0 px-8 py-6 text-base font-semibold text-black"
                  style={{ background: "linear-gradient(135deg, var(--bd-gold), #ff9d74)" }}
                >
                  Start your profile
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/14 bg-black/15 px-8 py-6 text-base text-[var(--bd-text)] hover:bg-black/20"
                >
                  Explore beta access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
