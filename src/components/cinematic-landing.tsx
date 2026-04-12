"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Fingerprint,
  Eye,
  Compass,
  Clock,
  Zap,
  ShieldCheck,
  Brain,
  Check,
  RefreshCw,
  Target,
  Lock,
  MessageCircle,
  Flame,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LifePreviewTimeline } from "@/components/life-preview-timeline";
import { MarketingFooter } from "@/components/marketing-footer";
import { MarketingSocialRail } from "@/components/marketing-social-rail";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/* ── constants ── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const WORDS_A = ["Strangers.", "Vibes.", "Profiles.", "Algorithms.", "Burnout."];
const WORDS_B = ["Intentionally.", "Deeply.", "Differently.", "Smarter.", "Boldly."];

const STEPS = [
  {
    num: "01",
    icon: Fingerprint,
    color: "#ff1493",
    title: "Tell us how you actually live",
    desc: "Your work hours, the texting style that drives you insane, the green flags nobody asks about. We use all of it.",
  },
  {
    num: "02",
    icon: Eye,
    color: "#7b9fff",
    title: "Preview before you commit",
    desc: "See if they fit your actual life before you clear your calendar for someone who talks over you.",
  },
  {
    num: "03",
    icon: Compass,
    color: "#d4688a",
    title: "Show up with the receipts",
    desc: "Walk in already knowing how they argue, how they recharge, and whether they’ll go quiet after a long week.",
  },
];

const UPGRADES = [
  {
    before: "Swipe 200 people. Match with 12. Talk to 2. Date zero.",
    after: "3 matches. Real ones. Two already suggested where to grab food.",
  },
  {
    before: "Ghost. Get ghosted. Convince yourself you\u2019re fine. Repeat.",
    after: "You know their whole deal before you\u2019ve typed a single letter.",
  },
  {
    before: "\u2018Hey :) how\u2019s your week going?\u2019 \u2014 into the void. Again.",
    after: "Openers that don\u2019t die after \u2018good thanks you?\u2019",
  },
  {
    before: "Spend all of Saturday praying they\u2019re not a nightmare in person.",
    after: "Walk in already knowing you like how they live their life.",
  },
];

const HACKS = [
  {
    icon: Clock,
    color: "#ff1493",
    title: "The Friday 7pm rule",
    desc: "If they won\u2019t spend a real evening with you, they\u2019re not spending a real life with you either.",
  },
  {
    icon: Brain,
    color: "#7b9fff",
    title: "Anxious \u2260 needy",
    desc: "Your attachment style is just your blueprint. We read it, match you accordingly, and don\u2019t make it weird.",
  },
  {
    icon: Zap,
    color: "#d4688a",
    title: "The spark is a scam",
    desc: "Butterflies are a terrible co-founder. The real test? Can you both survive a Wednesday at 9pm doing nothing.",
  },
  {
    icon: ShieldCheck,
    color: "#8fd4a4",
    title: "They went quiet. On purpose.",
    desc: "If they vanish the second your life gets busy, they weren\u2019t your person. Maahi could see it from the start.",
  },
];

const ROASTS: {
  icon: typeof RefreshCw;
  title: string;
  roast: string;
  span: "wide" | "narrow";
}[] = [
  {
    icon: RefreshCw,
    title: "The Swipe Treadmill",
    roast:
      "10,000 swipes. 47 matches. 3 conversations. 1 date. They showed up 22 minutes late, ordered a water, and explained Web3 to you for 45 minutes. App still sends the \u2018You\u2019re on a roll!\u2019 notification.",
    span: "wide",
  },
  {
    icon: Target,
    title: "The 97% Match",
    roast:
      "The algorithm called it fate. You lasted one brunch. Turns out 97% compatible doesn\u2019t filter for \u2018still uses \u201clol\u201d unironically\u2019 or \u2018sends 6-minute voice notes.\u2019",
    span: "narrow",
  },
  {
    icon: Lock,
    title: "The Velvet Rope",
    roast:
      "Six-week waitlist. Referral code. Linen-textured onboarding. First match had three photos and a bio that said \u2018ask me.\u2019 Very curated. Extremely mid.",
    span: "narrow",
  },
  {
    icon: MessageCircle,
    title: "The Hey Spiral",
    roast:
      "\u2018Hey :)\u2019 \u2014 \u2018Heyy! How\u2019s your week?\u2019 \u2014 \u2018Good haha you?\u2019 \u2014 silence forever. App fires a push: \u2018Don\u2019t let this one get away!\u2019 Babe. They\u2019ve been gone for three days.",
    span: "wide",
  },
];

function CyclingWord({
  words,
  index,
}: {
  words: string[];
  index: number;
}) {
  return (
    <span className="relative inline-block">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index % words.length]}
          className="inline-block bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#a87cdb] bg-clip-text text-transparent"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          exit={{ clipPath: "inset(0 0% 0 100%)", transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index % words.length]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function SectionTransition({
  tone = "warm",
}: {
  tone?: "warm" | "cool" | "rose" | "mint";
}) {
  const palette = {
    warm: {
      beam: "linear-gradient(90deg, transparent, rgba(232,146,124,0.4), transparent)",
      glow: "radial-gradient(circle, rgba(232,146,124,0.18), transparent 68%)",
      ring: "rgba(232,146,124,0.26)",
      sweep:
        "linear-gradient(90deg, transparent, rgba(255,235,220,0.85), rgba(232,146,124,0.1), transparent)",
    },
    cool: {
      beam: "linear-gradient(90deg, transparent, rgba(123,159,255,0.4), transparent)",
      glow: "radial-gradient(circle, rgba(123,159,255,0.18), transparent 68%)",
      ring: "rgba(123,159,255,0.24)",
      sweep:
        "linear-gradient(90deg, transparent, rgba(225,235,255,0.85), rgba(123,159,255,0.1), transparent)",
    },
    rose: {
      beam: "linear-gradient(90deg, transparent, rgba(212,104,138,0.42), transparent)",
      glow: "radial-gradient(circle, rgba(212,104,138,0.16), transparent 68%)",
      ring: "rgba(212,104,138,0.24)",
      sweep:
        "linear-gradient(90deg, transparent, rgba(255,226,238,0.82), rgba(212,104,138,0.1), transparent)",
    },
    mint: {
      beam: "linear-gradient(90deg, transparent, rgba(143,212,164,0.42), transparent)",
      glow: "radial-gradient(circle, rgba(143,212,164,0.18), transparent 68%)",
      ring: "rgba(143,212,164,0.22)",
      sweep:
        "linear-gradient(90deg, transparent, rgba(232,255,238,0.82), rgba(143,212,164,0.1), transparent)",
    },
  }[tone];

  return (
    <motion.div
      className="relative z-10 mx-auto flex h-10 w-full max-w-5xl items-center justify-center px-6"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="pointer-events-none absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <motion.div
        className="relative h-16 w-full max-w-xl"
        initial={{ scaleX: 0.76, opacity: 0, filter: "blur(8px)" }}
        whileInView={{ scaleX: 1, opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={{ duration: 1.05, ease: EASE }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: palette.glow }}
        />
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          style={{ background: palette.beam }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border backdrop-blur-sm"
          style={{
            borderColor: palette.ring,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18), rgba(255,255,255,0.02))",
            boxShadow: `0 0 28px ${palette.ring}`,
          }}
          animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 h-[2px] w-32 -translate-y-1/2 rounded-full blur-[1px]"
          style={{ background: palette.sweep }}
          animate={{ x: ["-8%", "112%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1.2,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── component ── */
export function CinematicLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    const start = setTimeout(() => {
      const id = setInterval(
        () => setCycleIndex((i) => i + 1),
        3500,
      );
      return () => clearInterval(id);
    }, 2800);
    return () => clearTimeout(start);
  }, []);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const navScale = useTransform(scrollY, [0, 140], [1, 0.985]);
  const navY = useTransform(scrollY, [0, 140], [0, -2]);
  const navBackgroundOpacity = useTransform(scrollY, [0, 140], [0.62, 0.84]);
  const navShadowOpacity = useTransform(scrollY, [0, 140], [0.18, 0.38]);
  const navBackground = useMotionTemplate`rgba(10, 12, 22, ${navBackgroundOpacity})`;
  const navShadow = useMotionTemplate`0 18px 48px rgba(0, 0, 0, ${navShadowOpacity})`;

  return (
    <main
      id="top"
      className="relative min-h-screen overflow-x-hidden bg-[#06060e] pt-20 text-[#f0ebe3] sm:pt-24"
      style={{ marginBottom: "calc(-72px - env(safe-area-inset-bottom, 0px))" }}
    >
      {/* ═══ Ambient orbs ═══ */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <motion.div
          className="absolute -left-72 -top-48 h-[700px] w-[700px] rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(232,146,124,0.18), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -right-52 top-[30%] h-[600px] w-[600px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(123,159,255,0.14), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-48 left-[40%] h-[500px] w-[500px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(212,104,138,0.12), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, 20, -25, 0], y: [0, -30, 10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ═══ Film grain ═══ */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* ═══ Sticky Nav ═══ */}
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
      >
        <motion.nav
          style={{
            y: navY,
            scale: navScale,
            backgroundColor: navBackground,
            boxShadow: navShadow,
          }}
          className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-3 overflow-hidden rounded-[28px] border border-white/[0.08] px-4 py-3 backdrop-blur-2xl backdrop-saturate-150 sm:px-5"
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at top left, rgba(212,104,138,0.18), transparent 36%), radial-gradient(circle at top right, rgba(123,159,255,0.14), transparent 34%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <a
            href="#top"
            className="relative flex min-w-0 items-center gap-3 rounded-2xl transition-opacity hover:opacity-90"
          >
            <Image
              src="/Biggdate-logo.png"
              alt="BiggDate"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl"
            />
            <span className="block truncate text-sm font-medium text-[#f0ebe3]">
              BiggDate
            </span>
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] p-1 md:flex">
            <a
              href="#how"
              className="rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#9ea2ba] transition-all hover:bg-[#7b9fff]/[0.14] hover:text-[#f0ebe3]"
            >
              Product
            </a>
            <a
              href="#demo"
              className="rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#9ea2ba] transition-all hover:bg-[#7b9fff]/[0.14] hover:text-[#f0ebe3]"
            >
              Maahi AI
            </a>
            <a
              href="#why-biggdate"
              className="rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#9ea2ba] transition-all hover:bg-[#7b9fff]/[0.14] hover:text-[#f0ebe3]"
            >
              Why BiggDate
            </a>
            <Link
              href="/about"
              className="rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#9ea2ba] transition-all hover:bg-[#7b9fff]/[0.14] hover:text-[#f0ebe3]"
            >
              About us
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#9ea2ba] transition-all hover:bg-[#7b9fff]/[0.14] hover:text-[#f0ebe3]"
            >
              Contact
            </Link>
          </div>

          <div className="relative flex items-center gap-2">
            <Link href="/auth?mode=login">
              <Button
                variant="ghost"
                className="hidden h-11 rounded-full border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-5 text-sm font-medium text-[#d7d9e5] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-[#f0ebe3] sm:inline-flex"
              >
                Enter BiggDate
              </Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button className="group relative h-11 overflow-hidden rounded-full px-6 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(232,146,124,0.3),0_12px_32px_rgba(212,104,138,0.4)] transition-all hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(232,146,124,0.4),0_16px_40px_rgba(212,104,138,0.5)]">
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#a855f7]" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff6ac7] via-[#f04fb8] to-[#b86ef7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10">Start Dating</span>
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger
                aria-label="Open navigation menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-[#f0ebe3] transition-all hover:border-white/[0.14] hover:bg-white/[0.08] md:hidden"
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] border-white/[0.08] bg-[#0b0d17]/95 text-[#f0ebe3] backdrop-blur-2xl sm:max-w-sm"
              >
                <SheetHeader className="border-b border-white/[0.06] px-5 py-5">
                  <SheetTitle className="text-[#f0ebe3]">Navigate BiggDate</SheetTitle>
                  <SheetDescription className="text-[#8f92ab]">
                    Open the landing sections, About us, and Contact from mobile.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-3 px-5 py-5">
                  <a
                    href="#how"
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-sm font-medium text-[#c2c5d8] transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-[#f0ebe3]"
                  >
                    Product
                  </a>
                  <a
                    href="#demo"
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-sm font-medium text-[#c2c5d8] transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-[#f0ebe3]"
                  >
                    Maahi AI
                  </a>
                  <a
                    href="#why-biggdate"
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-sm font-medium text-[#c2c5d8] transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-[#f0ebe3]"
                  >
                    Why BiggDate
                  </a>
                  <Link
                    href="/about"
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-sm font-medium text-[#c2c5d8] transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-[#f0ebe3]"
                  >
                    About us
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 text-sm font-medium text-[#c2c5d8] transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-[#f0ebe3]"
                  >
                    Contact
                  </Link>
                </div>

                <div className="mt-auto border-t border-white/[0.06] px-5 py-5">
                  <div className="grid gap-3">
                    <Link
                      href="/auth?mode=login"
                      className="inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] px-5 py-3 text-sm font-medium text-[#f0ebe3] transition-all hover:border-white/[0.14] hover:bg-white/[0.08]"
                    >
                      Enter BiggDate
                    </Link>
                    <a
                      href="mailto:hello@biggdate.com"
                      className="inline-flex items-center justify-center rounded-full border border-[#ff1493]/18 bg-[#ff1493]/10 px-5 py-3 text-sm font-medium text-[#f8c6e8] transition-all hover:border-[#ff1493]/30 hover:bg-[#ff1493]/14"
                    >
                      hello@biggdate.com
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.nav>
      </motion.header>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative z-10 flex min-h-[70vh] items-start justify-center px-6 pt-20 sm:min-h-[75vh] sm:pt-28"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="inline-block rounded-full border border-[#ff1493]/20 bg-[#ff1493]/[0.08] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff6ac7]">
              Private beta — for busy humans
            </span>
          </motion.div>

          {/* headline — fixed 4-line mobile layout, 2-line desktop layout */}
          <h1 className="mt-7 font-display font-bold tracking-[-0.03em] sm:mt-10">
            <div className="text-[2.6rem] leading-[1.22] sm:hidden">
              <motion.div
                initial={{ opacity: 0, y: 44, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
              >
                Stop Dating
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 44, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, delay: 0.47, ease: EASE }}
              >
                <CyclingWord words={WORDS_A} index={cycleIndex} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 44, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, delay: 0.59, ease: EASE }}
              >
                Start Loving
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 44, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, delay: 0.71, ease: EASE }}
              >
                <CyclingWord words={WORDS_B} index={cycleIndex} />
              </motion.div>
            </div>

            <div className="hidden text-[clamp(2.6rem,6.5vw,5.75rem)] leading-[1.18] sm:block">
              <motion.div
                className="whitespace-nowrap"
                initial={{ opacity: 0, y: 44, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
              >
                Stop Dating <CyclingWord words={WORDS_A} index={cycleIndex} />
              </motion.div>
              <motion.div
                className="whitespace-nowrap"
                initial={{ opacity: 0, y: 44, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, delay: 0.47, ease: EASE }}
              >
                Start Loving <CyclingWord words={WORDS_B} index={cycleIndex} />
              </motion.div>
            </div>
          </h1>

          {/* sub */}
          <motion.p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#a8aabe] sm:mt-8 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: EASE }}
          >
            You already optimize everything else.{" "}
            <span className="font-medium text-[#f3a5d7]">
              Your dating life deserves the same energy.
            </span>
          </motion.p>

          {/* ctas */}
          <motion.div
            className="mt-10 flex w-full flex-col items-stretch gap-4 px-2 sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.45, ease: EASE }}
          >
            <Link href="/auth" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#a855f7] px-8 py-6 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(255,20,147,0.34),0_20px_48px_rgba(212,104,138,0.45)] transition-all hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(255,20,147,0.44),0_24px_56px_rgba(212,104,138,0.55)] sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start your profile
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff6ac7] via-[#f04fb8] to-[#b86ef7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Button>
            </Link>
            <a href="#demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="ghost"
                className="w-full rounded-full border border-white/[0.1] px-8 py-6 text-base text-[#a8aabe] hover:bg-white/5 hover:text-[#f0ebe3] sm:w-auto"
              >
                See how it works
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
        >
          <motion.div
            className="h-10 w-[1px] bg-gradient-to-b from-white/30 to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      <SectionTransition tone="warm" />

      {/* ══════════════════════════════════════════════
          DEMO — Meet Maahi
      ══════════════════════════════════════════════ */}
      <motion.section
        id="demo"
        className="relative z-10 mx-auto max-w-4xl px-6 py-12 sm:py-24"
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: EASE }}
      >
        <div className="mb-10 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7b9fff]">
            Meet Maahi
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            The honest friend you actually need.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#a8aabe]">
            Maahi asks the uncomfortable stuff your group chat dances around.
            <br className="hidden sm:block" />
            No judgment. No sugarcoating. Just clarity.
          </p>
        </div>

        {/* chat frame */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0e1a]/90 shadow-[0_40px_100px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="h-px bg-gradient-to-r from-transparent via-[#ff1493]/40 to-transparent" />
          <div className="h-[28rem] sm:h-[34rem] lg:h-[38rem]">
            <LifePreviewTimeline />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#7b9fff]/20 to-transparent" />
        </div>
      </motion.section>

      <SectionTransition tone="cool" />

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section id="how" className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:py-24">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff6ac7]">
            How it works
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Three steps. No swiping into the void.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.14] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.15,
                  ease: EASE,
                }}
              >
                {/* top glow line */}
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${step.color}30, transparent)`,
                  }}
                />

                {/* icon + number row */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06]"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}18, ${step.color}08)`,
                    }}
                  >
                    <Icon className="size-5" style={{ color: step.color }} />
                  </div>
                  <span
                    className="font-display text-4xl font-bold"
                    style={{ color: `${step.color}15` }}
                  >
                    {step.num}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#a8aabe]">
                  {step.desc}
                </p>

                {/* hover glow */}
                <div
                  className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle, ${step.color}12, transparent 70%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      <SectionTransition tone="rose" />

      {/* ══════════════════════════════════════════════
          THE REWRITE — split-panel transformation
      ══════════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-14 sm:py-28">
        {/* section ambient */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(143,212,164,0.04), transparent)",
          }}
        />

        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4688a]">
            The glow-up
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Your dating story,{" "}
            <span className="bg-gradient-to-r from-[#8fd4a4] to-[#7bc4e8] bg-clip-text text-transparent">
              rewritten.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-[#5a5d72]">
            The loop you’ve been stuck in? That ends here.
          </p>
        </motion.div>

        {/* column headers */}
        <motion.div
          className="mb-6 grid grid-cols-[1fr_48px_1fr] items-center gap-4 px-1 sm:grid-cols-[1fr_64px_1fr]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400/60" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#5a3a3a]">
              Before
            </span>
          </div>
          <div />
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#3a5a47]">
              After
            </span>
            <span className="h-2 w-2 rounded-full bg-[#8fd4a4]/70 shadow-[0_0_8px_rgba(143,212,164,0.6)]" />
          </div>
        </motion.div>

        {/* rows */}
        <div className="relative space-y-4">
          {/* animated central spine */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 sm:block"
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(143,212,164,0.2) 20%, rgba(123,196,232,0.15) 80%, transparent)",
              transformOrigin: "top",
            }}
          />

          {UPGRADES.map((item, i) => (
            <motion.div
              key={i}
              className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_64px_1fr] sm:gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {/* BEFORE card */}
              <motion.div
                className="group relative overflow-hidden rounded-2xl border border-red-900/20 bg-gradient-to-br from-[#160c0c] to-[#0e0a0a] px-6 py-5"
                variants={{
                  hidden: { opacity: 0, x: -32 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.6, delay: i * 0.1, ease: EASE },
                  },
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent" />
                <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.04),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative text-sm leading-relaxed text-[#4a3a3a] line-through decoration-red-500/40 sm:text-base">
                  {item.before}
                </div>
              </motion.div>

              {/* center node */}
              <motion.div
                className="flex items-center justify-center"
                variants={{
                  hidden: { opacity: 0, scale: 0.5 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.4,
                      delay: 0.35 + i * 0.1,
                      ease: EASE,
                    },
                  },
                }}
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.07] bg-[#0d0f1a] shadow-[0_0_20px_rgba(143,212,164,0.08)]">
                  <span className="text-[10px] font-bold tabular-nums text-[#4a5070]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut",
                    }}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(143,212,164,0.12), transparent 70%)",
                    }}
                  />
                </div>
              </motion.div>

              {/* AFTER card */}
              <motion.div
                className="group relative overflow-hidden rounded-2xl border border-[#8fd4a4]/10 bg-gradient-to-br from-[#0c1610] to-[#0a120e] px-6 py-5"
                variants={{
                  hidden: { opacity: 0, x: 32 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.6,
                      delay: 0.5 + i * 0.1,
                      ease: EASE,
                    },
                  },
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8fd4a4]/25 to-transparent" />
                <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(143,212,164,0.06),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8fd4a4]/12 shadow-[0_0_10px_rgba(143,212,164,0.2)]">
                    <Check className="size-2.5 text-[#8fd4a4]" />
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-[#c8e8d5] sm:text-base">
                    {item.after}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* bottom CTA nudge */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          <Link href="/auth">
            <button className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(232,146,124,0.3),0_16px_40px_rgba(212,104,138,0.4)] transition-all hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(232,146,124,0.4),0_20px_48px_rgba(212,104,138,0.5)]">
              <span className="absolute inset-0 bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#a855f7]" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#ff6ac7] via-[#f04fb8] to-[#b86ef7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10 flex items-center gap-3">
                Start writing your new story
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </Link>
        </motion.div>
      </section>

      <SectionTransition tone="mint" />

      {/* ══════════════════════════════════════════════
          COMPETITOR ROAST
      ══════════════════════════════════════════════ */}
      <section
        id="why-biggdate"
        className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:py-24"
      >
        {/* ambient warm glow for this section */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(232,168,92,0.06), transparent)",
          }}
        />

        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff4db8]">
            <Flame className="size-3.5" />
            Honest reviews
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            We love other dating apps.{" "}
            <span className="bg-gradient-to-r from-[#ff4db8] to-[#ff1493] bg-clip-text text-transparent">
              (We&apos;re lying.)
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#a8aabe]">
            A love letter to every app that wasted your Sunday.
            <br className="hidden sm:block" />
            No names. Absolutely no lawyers.
          </p>
        </motion.div>

        {/* bento grid — zigzag layout */}
        <div className="grid gap-4 md:grid-cols-5">
          {ROASTS.map((roast, i) => {
            const Icon = roast.icon;
            const isWide = roast.span === "wide";
            return (
              <motion.div
                key={i}
                className={`group relative overflow-hidden rounded-2xl border border-[#ff4db8]/[0.1] bg-gradient-to-b from-[#161018] to-[#0f0a12] p-7 sm:p-8 ${
                  isWide ? "md:col-span-3" : "md:col-span-2"
                }`}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.1,
                  ease: EASE,
                }}
              >
                {/* top glow line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4db8]/25 to-transparent" />

                {/* icon + title */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ff4db8]/[0.1] bg-[#ff4db8]/[0.06]">
                    <Icon className="size-[18px] text-[#ff4db8]" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-[#f0ebe3]">
                    {roast.title}
                  </h3>
                </div>

                {/* roast text */}
                <p className="mt-4 text-[15px] leading-[1.7] text-[#9b8e82]">
                  {roast.roast}
                </p>

                {/* corner glow on hover */}
                <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(232,168,92,0.08),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {/* subtle inner shine */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent" />
              </motion.div>
            );
          })}
        </div>

        {/* punchline */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
        >
          <p className="inline-block rounded-full border border-[#ff4db8]/10 bg-[#ff4db8]/[0.04] px-6 py-3 text-sm font-medium text-[#f3a5d7]">
            BiggDate doesn&apos;t waste your Thursday nights. We take that personally.
          </p>
        </motion.div>
      </section>

      <SectionTransition tone="warm" />

      {/* ══════════════════════════════════════════════
          DATING HACKS
      ══════════════════════════════════════════════ */}
      <section id="hacks" className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:py-24">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7b9fff]">
            Dating intel
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Stuff nobody told you but everyone needed to hear.
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {HACKS.map((hack, i) => {
            const Icon = hack.icon;
            return (
              <motion.div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.14] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: EASE,
                }}
              >
                {/* top glow */}
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${hack.color}25, transparent)`,
                  }}
                />

                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06]"
                    style={{
                      background: `linear-gradient(135deg, ${hack.color}18, ${hack.color}06)`,
                    }}
                  >
                    <Icon className="size-5" style={{ color: hack.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.01em]">
                      {hack.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#a8aabe]">
                      {hack.desc}
                    </p>
                  </div>
                </div>

                {/* hover glow */}
                <div
                  className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle, ${hack.color}10, transparent 70%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      <SectionTransition tone="cool" />

      {/* ══════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════ */}
      <motion.section
        className="relative z-10 mx-auto max-w-4xl px-6 py-12 sm:py-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-10 text-center backdrop-blur-sm sm:p-16">
          {/* top glow line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7b9fff]/25 to-transparent" />

          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Your startup has a pitch deck.
          </h2>
          <p className="mt-2 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#7b9fff] bg-clip-text text-transparent">
              Your love life should too.
            </span>
          </p>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#a8aabe]">
            Private beta. Real people. No algorithm pretending it knows your soul.
          </p>

          <div className="mt-8">
            <Link href="/auth">
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full px-10 py-6 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(232,146,124,0.3),0_20px_50px_rgba(212,104,138,0.45)] transition-all hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(232,146,124,0.4),0_26px_58px_rgba(212,104,138,0.55)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#a855f7]" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff6ac7] via-[#f04fb8] to-[#b86ef7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10 flex items-center">
                  Join the beta — it&apos;s free
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-[#7d7f96]">
            No swiping. No Sunday dread. Just people who actually show up.
          </p>
        </div>
      </motion.section>

      <MarketingFooter />
      <MarketingSocialRail />
    </main>
  );
}
