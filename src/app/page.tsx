import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CalendarHeart,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Layers3,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Stars,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LifePreviewTimeline } from "@/components/life-preview-timeline";

const AUDIENCE = [
  "Founders",
  "Operators",
  "PMs",
  "Engineers",
  "Designers",
  "Investors",
];

const USER_PROBLEMS = [
  {
    title: "Your life gets misread fast",
    body:
      "Late nights, launch weeks, travel, and ambition can look like inconsistency on normal dating apps, even when you are serious.",
  },
  {
    title: "Most apps optimize for noise",
    body:
      "More likes, more chats, more swiping. Very little context. Very little clarity. Too much time goes into people who were never really a fit.",
  },
  {
    title: "You need more than surface chemistry",
    body:
      "If someone does not understand your pace, pressure, or emotional rhythm, attraction alone will not carry the relationship very far.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Brain,
    title: "Build a real profile",
    body:
      "BiggDate learns how you love, how you handle pressure, what kind of life you are building, and what kind of partner can actually fit into it.",
  },
  {
    icon: Sparkles,
    title: "See the match before the mess",
    body:
      "Instead of a shallow profile and blind texting, you get a Life Preview - how the connection could feel, where it clicks, and where it could break.",
  },
  {
    icon: HeartHandshake,
    title: "Move with more intention",
    body:
      "When timing, intent, and compatibility line up, BiggDate helps you move toward a real intro instead of another dead-end chat thread.",
  },
];

const DIFFERENTIATORS = [
  {
    icon: Clock3,
    title: "Built for real schedules",
    body:
      "The product is designed for people with irregular work rhythms, not people with unlimited emotional admin time.",
  },
  {
    icon: Layers3,
    title: "Compatibility with context",
    body:
      "Not just vibe, photos, and banter. BiggDate looks at emotional pacing, lifestyle architecture, standards, and pressure patterns.",
  },
  {
    icon: MessagesSquare,
    title: "Questions normal apps never ask",
    body:
      "How do you want love to feel during a hard week? What kind of support feels grounding instead of intrusive? That is where real signal starts.",
  },
  {
    icon: ShieldCheck,
    title: "Less performative, more honest",
    body:
      "The experience is designed to lower noise and raise clarity so you can stop performing for strangers and start noticing actual fit.",
  },
];

const PROMISES = [
  "Less swipe fatigue",
  "Better emotional clarity",
  "Higher quality introductions",
  "A product that understands ambitious lives",
];

export default function LandingPage() {
  return (
    <main
      id="top"
      className="relative min-h-screen overflow-hidden text-[#17141f]"
      style={{
        background:
          "radial-gradient(circle at 12% 0%, rgba(103,82,255,0.12), transparent 26%), radial-gradient(circle at 88% 8%, rgba(108,222,255,0.14), transparent 24%), linear-gradient(180deg, #f7f5ff 0%, #ffffff 38%, #f5f7fb 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(103,82,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(103,82,255,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.92), transparent 94%)",
        }}
      />

      <div className="pointer-events-none absolute left-[-8rem] top-12 h-72 w-72 rounded-full blur-[110px]" style={{ background: "rgba(103,82,255,0.14)" }} />
      <div className="pointer-events-none absolute right-[-6rem] top-8 h-80 w-80 rounded-full blur-[120px]" style={{ background: "rgba(108,222,255,0.12)" }} />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border"
            style={{
              borderColor: "rgba(92,79,209,0.14)",
              background: "linear-gradient(135deg, rgba(92,79,209,0.16), rgba(116,198,239,0.16))",
            }}
          >
            <Stars className="size-5 text-[#5246ba]" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[#6f67a2]">
              BiggDate
            </div>
            <div className="text-sm text-[#66617f]">For people who build things</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge className="hidden border-none bg-[#eeebff] px-3 py-1 text-[10px] tracking-[0.22em] text-[#5c4fd1] sm:inline-flex">
            PRIVATE BETA
          </Badge>
          <Link href="/auth">
            <Button variant="ghost" className="rounded-full px-4 text-[#66617f] hover:bg-white/80 hover:text-[#17141f]">
              Log in
            </Button>
          </Link>
          <Link href="/auth">
            <Button
              className="rounded-full border-0 px-5 font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #5c4fd1, #74c6ef)" }}
            >
              Join beta
            </Button>
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="page-enter">
            <Badge className="mb-5 border-none bg-[#ede8ff] px-4 py-1.5 text-[11px] tracking-[0.24em] text-[#6f63d6]">
              DATING WITH CONTEXT
            </Badge>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] tracking-[-0.05em] text-[#17141f] sm:text-6xl lg:text-7xl">
              Meet someone who
              <br />
              <span className="text-[#5146ba]">actually gets your life.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-xl leading-9 text-[#4e4a62]">
              BiggDate is a dating product for founders, operators, PMs, engineers,
              designers, and investors who want more than chemistry on a screen. It helps
              you find someone who understands your pace, your pressure, and the life you
              are building.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {AUDIENCE.map((item) => (
                <span
                  key={item}
                  className="rounded-full px-4 py-2 text-sm font-medium"
                  style={{
                    background: "rgba(255,255,255,0.78)",
                    border: "1px solid rgba(92,79,209,0.12)",
                    color: "#3f3a58",
                    boxShadow: "0 10px 26px rgba(80,67,181,0.05)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="group rounded-full border-0 px-8 py-6 text-base font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #5548c9, #74c6ef)" }}
                >
                  Start your profile
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-[#d9d2ff] bg-white/80 px-8 py-6 text-base text-[#2a2537] hover:bg-white"
                >
                  See how it works
                </Button>
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {PROMISES.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[1.2rem] border bg-white/72 px-4 py-3"
                  style={{ borderColor: "rgba(92,79,209,0.1)" }}
                >
                  <CheckCircle2 className="size-4 text-[#5c4fd1]" />
                  <span className="text-sm text-[#44405a]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="page-enter page-enter-delay-2">
            <div
              className="overflow-hidden rounded-[2rem] border"
              style={{
                background: "linear-gradient(180deg, #111627 0%, #0d1222 100%)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 30px 80px rgba(31,26,51,0.22)",
              }}
            >
              <div className="border-b px-5 py-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-[#8ea6c5]">
                      Live preview
                    </div>
                    <div className="mt-1 text-xl font-semibold text-[#edf5ff]">
                      What BiggDate feels like
                    </div>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{
                      background: "rgba(127,201,239,0.12)",
                      border: "1px solid rgba(127,201,239,0.2)",
                      color: "#8fe8ff",
                    }}
                  >
                    AI guided
                  </span>
                </div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
                <div className="border-b p-5 lg:border-b-0 lg:border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="space-y-3">
                    {[
                      "Learns your emotional rhythm, not just your type.",
                      "Understands pressure, ambition, and dating pace.",
                      "Shows likely fit before you burn a week on texting.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-[1.4rem] p-4 text-sm leading-7 text-[#edf5ff]"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 size-4 text-[#8fe8ff]" />
                    <p className="text-xs leading-6 text-[#8ea6c5]">
                      The product is designed to reduce guesswork and move you toward fewer,
                      stronger connections.
                    </p>
                  </div>
                </div>

                <div className="min-h-[520px]">
                  <LifePreviewTimeline />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.24em] text-[#78729c]">Why normal dating apps break here</div>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[#17141f] sm:text-5xl">
            The problem is not that you need more options.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5d5974]">
            The problem is that most products do not understand what your life actually
            asks from a relationship.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {USER_PROBLEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.9rem] border bg-white/76 p-6"
              style={{
                borderColor: "rgba(92,79,209,0.12)",
                boxShadow: "0 12px 34px rgba(80,67,181,0.04)",
              }}
            >
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#17141f]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d5974]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8" id="how-it-works">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.24em] text-[#78729c]">How BiggDate works</div>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[#17141f] sm:text-5xl">
            A better path from attraction to actual fit.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border bg-white/78 p-6"
                style={{
                  borderColor: "rgba(92,79,209,0.12)",
                  boxShadow: "0 12px 34px rgba(80,67,181,0.04)",
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(92,79,209,0.12), rgba(116,198,239,0.18))" }}
                >
                  <Icon className="size-5 text-[#5246ba]" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-[#17141f]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d5974]">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
          <div
            className="rounded-[2rem] border p-6 sm:p-8"
            style={{
              borderColor: "rgba(92,79,209,0.12)",
              background: "rgba(255,255,255,0.78)",
              boxShadow: "0 14px 36px rgba(80,67,181,0.04)",
            }}
          >
            <div className="flex items-center gap-2 text-[#5c4fd1]">
              <Users2 className="size-4" />
              <span className="text-xs uppercase tracking-[0.22em]">Who it is for</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#17141f] sm:text-4xl">
              People whose lives are ambitious, full, and hard to explain in a bio.
            </h2>
            <p className="mt-4 text-base leading-8 text-[#5d5974]">
              BiggDate is built for people who want a serious connection without pretending
              they live simple, generic lives. You want someone who gets your world - and
              can still meet you with emotional steadiness inside it.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {DIFFERENTIATORS.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.8rem] border bg-white/76 p-5"
                  style={{
                    borderColor: "rgba(92,79,209,0.12)",
                    boxShadow: "0 12px 34px rgba(80,67,181,0.04)",
                  }}
                >
                  <Icon className="size-5 text-[#5246ba]" />
                  <div className="mt-4 text-lg font-medium text-[#17141f]">{item.title}</div>
                  <p className="mt-2 text-sm leading-7 text-[#5d5974]">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-6 lg:px-8">
        <div
          className="overflow-hidden rounded-[2.4rem] border px-6 py-8 sm:px-10 sm:py-10"
          style={{
            borderColor: "rgba(92,79,209,0.14)",
            background:
              "linear-gradient(135deg, rgba(92,79,209,0.12), rgba(116,198,239,0.12) 55%, rgba(255,255,255,0.78) 100%)",
            boxShadow: "0 22px 60px rgba(80,67,181,0.08)",
          }}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.24em] text-[#706999]">Ready when you are</div>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[#17141f] sm:text-5xl">
                If you are tired of swiping without context, this is the better way in.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#504b67]">
                Start your profile and let BiggDate learn how you love, what you need, and
                what kind of relationship can actually fit the life you are building.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="rounded-full border-0 px-8 py-6 text-base font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #5548c9, #74c6ef)" }}
                >
                  Start your profile
                </Button>
              </Link>
              <a href="#top">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/60 bg-white/78 px-8 py-6 text-base text-[#2a2537] hover:bg-white"
                >
                  Back to top
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <CalendarHeart className="mt-1 size-4 text-[#5246ba]" />
            <p className="max-w-4xl text-sm leading-7 text-[#56516d]">
              BiggDate is for people who build things and want their dating life to make
              sense too.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
