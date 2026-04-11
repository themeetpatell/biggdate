import { useState, useEffect, useRef } from "react";

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const colors = {
  bg: "#0A0A0F",
  surface: "#111118",
  surfaceHover: "#1A1A24",
  border: "rgba(255,255,255,0.07)",
  borderGlow: "rgba(180,140,255,0.25)",
  accent: "#B48CFF",
  accentSoft: "rgba(180,140,255,0.15)",
  accentGlow: "rgba(180,140,255,0.4)",
  rose: "#FF6B8A",
  roseGlow: "rgba(255,107,138,0.3)",
  gold: "#F5C842",
  goldGlow: "rgba(245,200,66,0.25)",
  text: "#F0EEF8",
  textMuted: "#8A87A0",
  textFaint: "#4A4760",
  green: "#4FFFB0",
  greenGlow: "rgba(79,255,176,0.25)",
};

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: ${colors.bg};
      color: ${colors.text};

      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${colors.bg}; }
    ::-webkit-scrollbar-thumb { background: ${colors.textFaint}; border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes orb1 {
      0%, 100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(40px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.95); }
    }
    @keyframes orb2 {
      0%, 100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(-50px, 20px) scale(0.9); }
      66% { transform: translate(30px, -40px) scale(1.05); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(180,140,255,0.3); }
      50% { box-shadow: 0 0 40px rgba(180,140,255,0.6), 0 0 80px rgba(180,140,255,0.2); }
    }
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes progressFill {
      from { width: 0; }
      to { width: var(--target-width); }
    }

    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .fade-in { animation: fadeIn 0.4s ease forwards; }

    textarea:focus, input:focus, button:focus { outline: none; }

    .glass {
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(20px);
      border: 1px solid ${colors.border};
    }

    .message-bubble {
      animation: fadeUp 0.3s ease forwards;
    }

    @media (max-width: 640px) {
      .hide-mobile { display: none !important; }
    }
  `}</style>
);

// ─── Orb Background ───────────────────────────────────────────────────────────
const OrbBg = ({ variant = "default" }) => {
  const configs = {
    default: [
      { color: "180,140,255", x: "15%", y: "20%", size: 500, anim: "orb1 12s ease-in-out infinite" },
      { color: "255,107,138", x: "75%", y: "60%", size: 400, anim: "orb2 15s ease-in-out infinite" },
      { color: "79,255,176", x: "50%", y: "85%", size: 300, anim: "orb1 18s ease-in-out infinite reverse" },
    ],
    report: [
      { color: "245,200,66", x: "10%", y: "30%", size: 450, anim: "orb1 14s ease-in-out infinite" },
      { color: "180,140,255", x: "80%", y: "20%", size: 350, anim: "orb2 16s ease-in-out infinite" },
    ],
    match: [
      { color: "255,107,138", x: "20%", y: "15%", size: 500, anim: "orb2 13s ease-in-out infinite" },
      { color: "180,140,255", x: "70%", y: "70%", size: 400, anim: "orb1 17s ease-in-out infinite" },
    ],
  };
  const orbs = configs[variant] || configs.default;
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {orbs.map((orb, i) => (
        <div key={i} style={{
          position: "absolute",
          left: orb.x, top: orb.y,
          width: orb.size, height: orb.size,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${orb.color},0.18) 0%, rgba(${orb.color},0.06) 50%, transparent 70%)`,
          transform: "translate(-50%,-50%)",
          animation: orb.anim,
          filter: "blur(1px)",
        }} />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />
    </div>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ size = 20, color = colors.accent }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid rgba(255,255,255,0.1)`,
    borderTop: `2px solid ${color}`,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  }} />
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value, max, color = colors.accent, label }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: colors.textMuted }}>{label}</span>
          <span style={{ fontSize: 13, color, fontWeight: 500 }}>{pct}%</span>
        </div>
      )}
      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          borderRadius: 99,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: `0 0 12px ${color}66`,
          transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
};

// ─── Screen: Landing ─────────────────────────────────────────────────────────
const LandingScreen = ({ onStart }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const features = [
    { icon: "◈", title: "Deep Soul Profiling", desc: "AI-powered psychology sessions map your attachment style, values, and relationship patterns" },
    { icon: "⟐", title: "Agent-to-Agent Matching", desc: "Your AI ambassador negotiates compatibility with others while you live your life" },
    { icon: "◉", title: "Relationship Readiness", desc: "Become the partner you want to attract — measurable emotional growth coaching" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      <OrbBg />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Nav */}
        <nav style={{
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.rose})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 700, animation: "glow 3s ease infinite",
            }}>✦</div>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>BiggDate</span>
          </div>
          <div style={{
            padding: "8px 18px",
            borderRadius: 99,
            border: `1px solid ${colors.border}`,
            fontSize: 13,
            color: colors.textMuted,
            cursor: "default",
          }}>Beta · Invite Only</div>
        </nav>

        {/* Hero */}
        <div style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "80px 32px 60px",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 99,
            background: colors.accentSoft,
            border: `1px solid ${colors.borderGlow}`,
            fontSize: 12,
            color: colors.accent,
            fontWeight: 500,
            marginBottom: 32,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            <span style={{ animation: "pulse 2s ease infinite" }}>◆</span>
            The last dating app you'll ever need
          </div>

          <h1 style={{
            letterSpacing: "-0.025em", fontSize: "clamp(38px, 7vw, 68px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: 24,
            background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.accent} 50%, ${colors.rose} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Find love by<br />
            <span style={{ color: colors.accent, fontWeight: 300 }}>finding yourself</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2.5vw, 19px)",
            color: colors.textMuted,
            lineHeight: 1.7,
            maxWidth: 520,
            margin: "0 auto 48px",
            fontWeight: 300,
          }}>
            Not another swipe app. An AI companion that transforms who you are as a partner — then matches your soul, not your selfie.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onStart} style={{
              padding: "16px 40px",
              borderRadius: 16,
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.rose})`,
              border: "none",
              color: "#fff",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
              boxShadow: `0 8px 32px ${colors.accentGlow}, 0 2px 8px rgba(0,0,0,0.4)`,
              transition: "all 0.2s ease",
              letterSpacing: "0.01em",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${colors.accentGlow}, 0 4px 12px rgba(0,0,0,0.4)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 32px ${colors.accentGlow}, 0 2px 8px rgba(0,0,0,0.4)`; }}
            >
              Begin Your Journey
            </button>
            <button style={{
              padding: "16px 32px",
              borderRadius: 16,
              background: "transparent",
              border: `1px solid ${colors.border}`,
              color: colors.textMuted,
              fontSize: 16,
              cursor: "pointer",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.color = colors.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; }}
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Features */}
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 32px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease 0.4s",
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: "32px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${colors.border}`,
              transition: "all 0.3s ease",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.borderGlow; e.currentTarget.style.background = "rgba(180,140,255,0.06)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{
                fontSize: 28,
                marginBottom: 16,
                color: colors.accent,
                fontWeight: 300,
              }}>{f.icon}</div>
              <h3 style={{
                letterSpacing: "-0.025em", fontSize: 20,
                fontWeight: 500,
                marginBottom: 10,
                color: colors.text,
              }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
          padding: "40px 32px",
          display: "flex",
          justifyContent: "center",
          gap: "clamp(32px, 8vw, 80px)",
          flexWrap: "wrap",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease 0.6s",
        }}>
          {[
            { n: "79%", label: "of daters burned out by apps" },
            { n: "11%", label: "find current algorithms good" },
            { n: "3×", label: "better dates after soul profiling" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                letterSpacing: "-0.025em", fontSize: 40,
                fontWeight: 500,
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.rose})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{s.n}</div>
              <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Onboarding Chat ──────────────────────────────────────────────────
const OnboardingScreen = ({ onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(0);
  const [userName, setUserName] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const bottomRef = useRef(null);
  const cleanText = (text) => text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/#+\s/g, '').trim();

  const SYSTEM_PROMPT = `You are a world-class relationship psychologist — the most perceptive person someone has ever talked to. You think like a Gottman therapist, speak like a trusted best friend texting.

ABSOLUTE FORMAT RULES — never break these:
- Entire response = max 1 reaction (5-8 words max) + 1 question. That's it.
- Questions must be SHORT and PUNCHY. Under 12 words.
- No paragraphs. No therapy-speak. No explaining yourself.
- Sound like a smart friend texting — not a chatbot or therapist.
- Never say generic things like "that makes sense" or "great answer".
- Say something that shows you truly GET them. Make them feel seen.

QUESTION EXAMPLES — this is the energy:
BAD: "When things get tough, do you tend to pull away and need space, or talk it through?"
GOOD: "Fight or flight — which one are you?"

BAD: "What are you looking for in a partner?"
GOOD: "What's the thing you keep hoping someone will just get about you?"

BAD: "How do you handle conflict?"
GOOD: "Last time you were hurt — did you go quiet or go in?"

BAD: "How emotionally available are you?"
GOOD: "Scale of 1-10 — how ready do you actually feel for something real?"

BAD: "Tell me about past relationships"
GOOD: "What's a pattern you keep seeing in your own love life?"

SHARP REACTIONS — examples of making them feel seen:
"That's avoidant coded, honestly."
"That's someone who loves hard."
"Sounds like you've been the one who cared more."
"That's a lot of self-awareness."
"That tracks — you prioritize depth."

FLOW — uncover in this order:
1. Name
2. Conflict style (reveals attachment fast)
3. Past pattern they keep repeating
4. What they truly need vs what they settle for
5. Current readiness / walls up?
6. Dealbreaker (reveals core values instantly)
7. "What do people always get wrong about you?"

After 7 exchanges, append on its own line:
PROFILE_COMPLETE:{"name":"[name]","attachment":"[Secure/Anxious/Avoidant/Fearful-Avoidant]","attachmentScore":[60-95],"readinessScore":[40-90],"growthAreas":["area1","area2","area3"],"strengths":["strength1","strength2","strength3"],"coreValues":["value1","value2","value3"],"summary":"[2-sentence sharp summary of who they are as a partner]","coachingFocus":"[the single thing that would transform their love life]"}

First message: Exactly this — "Hey, I'm your BiggDate guide. What's your name?" Nothing more.`;
  useEffect(() => {
    // Initial greeting
    // Hardcode the first message — instant, no API call, no duplicate
    setMessages([{ role: "assistant", content: "Hey, I'm your BiggDate guide. What's your name?" }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function callClaude(history, userMessage) {
    const msgs = [...history, { role: "user", content: userMessage }];
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: msgs,
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "I'm here with you. Tell me more.";
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newHistory = [...conversationHistory, { role: "user", content: userMsg }];
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    setQuestionCount(q => q + 1);

    const response = await callClaude(conversationHistory, userMsg);

    // Check for profile completion
    if (response.includes("PROFILE_COMPLETE:")) {
      const parts = response.split("PROFILE_COMPLETE:");
      const cleanResponse = parts[0].trim();
      try {
        const profile = JSON.parse(parts[1].trim());
        setMessages(prev => [...prev, { role: "assistant", content: cleanResponse }]);
        setLoading(false);
        setTimeout(() => onComplete(profile), 2000);
        return;
      } catch (e) {}
    }

    setConversationHistory([...newHistory, { role: "assistant", content: response }]);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  }

  const progress = Math.min(questionCount / 7, 1);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      <OrbBg />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(10,10,15,0.8)",
          backdropFilter: "blur(20px)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `linear-gradient(135deg, ${colors.accent}40, ${colors.rose}40)`,
              border: `1px solid ${colors.borderGlow}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>✦</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>BiggDate Guide</div>
              <div style={{ fontSize: 12, color: colors.green, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.green, display: "inline-block", animation: "pulse 2s ease infinite" }} />
                Mapping your soul
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 6 }}>
              Phase 1 — Deep Profiling
            </div>
            <div style={{ width: 140, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
              <div style={{
                height: "100%",
                width: `${progress * 100}%`,
                borderRadius: 99,
                background: `linear-gradient(90deg, ${colors.accent}, ${colors.rose})`,
                transition: "width 0.8s ease",
                boxShadow: `0 0 8px ${colors.accent}66`,
              }} />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ maxWidth: 680, width: "100%", margin: "0 auto" }}>
            {messages.map((msg, i) => (
              <div key={i} className="message-bubble" style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 20,
              }}>
                {msg.role === "assistant" && (
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, ${colors.accent}40, ${colors.rose}40)`,
                    border: `1px solid ${colors.borderGlow}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, marginRight: 12, marginTop: 4,
                  }}>✦</div>
                )}
                <div style={{
                  maxWidth: "80%",
                  padding: "16px 20px",
                  borderRadius: msg.role === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                  background: msg.role === "user"
                    ? `linear-gradient(135deg, ${colors.accent}30, ${colors.rose}20)`
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${msg.role === "user" ? colors.borderGlow : colors.border}`,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: colors.text,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}>
                  {msg.content.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/^#+\s/gm, '').trim()}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `linear-gradient(135deg, ${colors.accent}40, ${colors.rose}40)`,
                  border: `1px solid ${colors.borderGlow}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14,
                }}>✦</div>
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "20px 20px 20px 6px",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${colors.border}`,
                  display: "flex", gap: 6, alignItems: "center",
                }}>
                  {[0, 150, 300].map(delay => (
                    <div key={delay} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: colors.accent,
                      animation: `pulse 1.2s ease ${delay}ms infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div style={{
          padding: "16px 16px 24px",
          borderTop: `1px solid ${colors.border}`,
          background: "rgba(10,10,15,0.9)",
          backdropFilter: "blur(20px)",
          flexShrink: 0,
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", gap: 12, alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Share openly — your words shape your BiggDate profile…"
              rows={1}
              style={{
                flex: 1,
                padding: "14px 18px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${colors.border}`,
                color: colors.text,
                fontSize: 15,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
                fontWeight: 300,
                resize: "none",
                lineHeight: 1.5,
                transition: "border-color 0.2s ease",
                minHeight: 52,
                maxHeight: 120,
                overflowY: "auto",
              }}
              onFocus={e => e.currentTarget.style.borderColor = colors.borderGlow}
              onBlur={e => e.currentTarget.style.borderColor = colors.border}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: input.trim() && !loading
                ? `linear-gradient(135deg, ${colors.accent}, ${colors.rose})`
                : "rgba(255,255,255,0.06)",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
              transition: "all 0.2s ease",
              boxShadow: input.trim() && !loading ? `0 4px 20px ${colors.accentGlow}` : "none",
            }}>
              {loading ? <Spinner size={18} /> : "↑"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Readiness Report ─────────────────────────────────────────────────
const ReportScreen = ({ profile, onContinue }) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [coachPlan, setCoachPlan] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    generateCoachingPlan();
  }, []);

  async function generateCoachingPlan() {
    setLoadingPlan(true);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Based on this soul profile, create a warm, inspiring 30-day relationship readiness coaching plan. 
Profile: ${JSON.stringify(profile)}
Format as 3 phases of 10 days each. Be specific and actionable but poetic. Each phase: title + 2-3 practices.
Keep it under 400 words. No markdown headers, just flowing text with clear phase labels like "Phase 1 (Days 1-10):" etc.`
        }]
      }),
    });
    const data = await res.json();
    setCoachPlan(data.content?.[0]?.text || "");
    setLoadingPlan(false);
  }

  const attachmentColors = {
    "Secure": colors.green,
    "Anxious": colors.gold,
    "Avoidant": colors.rose,
    "Fearful-Avoidant": colors.accent,
  };
  const attachColor = attachmentColors[profile.attachment] || colors.accent;

  const tabs = ["overview", "strengths", "growth", "coaching"];

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <OrbBg variant="report" />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{
          padding: "24px 24px 0",
          maxWidth: 760,
          margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease",
        }}>
          <div style={{
            padding: "4px 12px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 99,
            background: "rgba(79,255,176,0.1)",
            border: "1px solid rgba(79,255,176,0.25)",
            fontSize: 12,
            color: colors.green,
            marginBottom: 20,
            fontWeight: 500,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            <span>◆</span> BiggDate Profile Complete
          </div>

          <h1 style={{
            letterSpacing: "-0.025em", fontSize: "clamp(28px, 6vw, 48px)",
            fontWeight: 500,
            marginBottom: 8,
            lineHeight: 1.2,
          }}>
            {profile.name}'s<br />
            <span style={{ color: colors.accent, fontWeight: 300 }}>Relationship Blueprint</span>
          </h1>
          <p style={{ color: colors.textMuted, fontSize: 16, lineHeight: 1.6, maxWidth: 520, fontWeight: 300, marginBottom: 32 }}>
            {profile.summary}
          </p>

          {/* Score Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Readiness Score", value: profile.readinessScore, color: colors.accent, icon: "◈" },
              { label: "Attachment Style", value: profile.attachment, isText: true, color: attachColor, icon: "⟐" },
              { label: "Values Clarity", value: profile.attachmentScore, color: colors.gold, icon: "◉" },
            ].map((card, i) => (
              <div key={i} style={{
                padding: "24px 20px",
                borderRadius: 20,
                background: `rgba(255,255,255,0.03)`,
                border: `1px solid ${colors.border}`,
                transition: "all 0.3s ease",
              }}>
                <div style={{ fontSize: 20, color: card.color, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</div>
                {card.isText ? (
                  <div style={{ fontSize: 18, fontWeight: 500, color: card.color }}>{card.value}</div>
                ) : (
                  <>
                    <div style={{ fontSize: 28, fontWeight: 600, color: card.color, letterSpacing: "-0.025em" }}>{card.value}</div>
                    <div style={{ marginTop: 10 }}>
                      <ProgressBar value={card.value} max={100} color={card.color} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex",
            gap: 4,
            padding: "6px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${colors.border}`,
            marginBottom: 24,
            overflowX: "auto",
          }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 12,
                border: "none",
                background: activeTab === tab ? `linear-gradient(135deg, ${colors.accent}40, ${colors.rose}20)` : "transparent",
                color: activeTab === tab ? colors.text : colors.textMuted,
                fontSize: 13,
                fontWeight: activeTab === tab ? 500 : 400,
                cursor: "pointer",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
                transition: "all 0.2s ease",
                borderColor: activeTab === tab ? colors.borderGlow : "transparent",
                borderWidth: 1,
                borderStyle: "solid",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{
            padding: "28px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${colors.border}`,
            marginBottom: 32,
            minHeight: 200,
          }}>
            {activeTab === "overview" && (
              <div className="fade-in">
                <h3 style={{ letterSpacing: "-0.025em", fontSize: 22, marginBottom: 20 }}>Your Core Values</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
                  {(profile.coreValues || []).map((v, i) => (
                    <span key={i} style={{
                      padding: "8px 18px",
                      borderRadius: 99,
                      background: colors.accentSoft,
                      border: `1px solid ${colors.borderGlow}`,
                      fontSize: 14,
                      color: colors.accent,
                      fontWeight: 500,
                    }}>{v}</span>
                  ))}
                </div>
                <h3 style={{ letterSpacing: "-0.025em", fontSize: 22, marginBottom: 16 }}>Attachment Pattern</h3>
                <div style={{
                  padding: "20px",
                  borderRadius: 16,
                  background: `rgba(${attachColor === colors.green ? "79,255,176" : attachColor === colors.gold ? "245,200,66" : attachColor === colors.rose ? "255,107,138" : "180,140,255"},0.08)`,
                  border: `1px solid ${attachColor}44`,
                }}>
                  <div style={{ fontSize: 18, fontWeight: 500, color: attachColor, marginBottom: 8 }}>{profile.attachment}</div>
                  <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
                    {profile.attachment === "Secure" && "You bring emotional stability and clear communication to relationships. You're a rare and deeply valuable partner."}
                    {profile.attachment === "Anxious" && "You love deeply and show up fully — but fear of abandonment can create patterns worth exploring. Your sensitivity is a gift waiting to be channeled."}
                    {profile.attachment === "Avoidant" && "You value independence and depth, but closeness can feel threatening. With awareness, your self-sufficiency becomes a strength, not a wall."}
                    {profile.attachment === "Fearful-Avoidant" && "You crave deep connection but fear it equally. This inner tension is your greatest growth edge — and your greatest source of empathy for others."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "strengths" && (
              <div className="fade-in">
                <h3 style={{ letterSpacing: "-0.025em", fontSize: 22, marginBottom: 20 }}>What You Bring to Love</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {(profile.strengths || []).map((s, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "16px 20px",
                      borderRadius: 14,
                      background: "rgba(79,255,176,0.05)",
                      border: "1px solid rgba(79,255,176,0.15)",
                    }}>
                      <div style={{ color: colors.green, fontSize: 18, marginTop: 1, flexShrink: 0 }}>✓</div>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 15 }}>{s}</div>
                        <div style={{ fontSize: 13, color: colors.textMuted }}>A defining quality of how you love</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "growth" && (
              <div className="fade-in">
                <h3 style={{ letterSpacing: "-0.025em", fontSize: 22, marginBottom: 8 }}>Your Growth Edge</h3>
                <p style={{ color: colors.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
                  These aren't flaws — they're your most potent opportunities for transformation.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {(profile.growthAreas || []).map((g, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "16px 20px",
                      borderRadius: 14,
                      background: "rgba(180,140,255,0.06)",
                      border: `1px solid ${colors.borderGlow}`,
                    }}>
                      <div style={{ color: colors.accent, fontSize: 16, marginTop: 2, flexShrink: 0 }}>◈</div>
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: 4, fontSize: 15 }}>{g}</div>
                        <div style={{ fontSize: 13, color: colors.textMuted }}>Working on this will transform your relationships</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 24, padding: "20px",
                  borderRadius: 16,
                  background: `rgba(245,200,66,0.06)`,
                  border: `1px solid ${colors.goldGlow}`,
                }}>
                  <div style={{ fontSize: 12, color: colors.gold, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Primary Focus</div>
                  <div style={{ fontSize: 15, lineHeight: 1.7 }}>{profile.coachingFocus}</div>
                </div>
              </div>
            )}

            {activeTab === "coaching" && (
              <div className="fade-in">
                <h3 style={{ letterSpacing: "-0.025em", fontSize: 22, marginBottom: 8 }}>Your 30-Day Readiness Plan</h3>
                <p style={{ color: colors.textMuted, fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
                  A personalized path to becoming the partner you want to attract.
                </p>
                {loadingPlan ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0" }}>
                    <Spinner color={colors.accent} />
                    <span style={{ color: colors.textMuted, fontSize: 14 }}>Crafting your personal growth plan…</span>
                  </div>
                ) : (
                  <div style={{
                    fontSize: 14,
                    lineHeight: 1.9,
                    color: colors.textMuted,
                    whiteSpace: "pre-wrap",
                  }}>{coachPlan}</div>
                )}
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{
            padding: "28px",
            borderRadius: 24,
            background: `linear-gradient(135deg, ${colors.accentSoft}, rgba(255,107,138,0.08))`,
            border: `1px solid ${colors.borderGlow}`,
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}>
            <div>
              <div style={{ letterSpacing: "-0.025em", fontSize: 22, marginBottom: 8 }}>
                Ready to meet your matches?
              </div>
              <p style={{ color: colors.textMuted, fontSize: 14, maxWidth: 360 }}>
                Your relationship profile is live. Let BiggDate's agent find 3 deeply compatible people for you this week.
              </p>
            </div>
            <button onClick={onContinue} style={{
              padding: "14px 32px",
              borderRadius: 14,
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.rose})`,
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
              boxShadow: `0 8px 24px ${colors.accentGlow}`,
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Activate AI Matching →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Matches ──────────────────────────────────────────────────────────
const MatchesScreen = ({ profile }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [agentThinking, setAgentThinking] = useState(false);
  const [agentMessage, setAgentMessage] = useState("");
  const [activeView, setActiveView] = useState("matches");

  useEffect(() => {
    generateMatches();
  }, []);

  async function generateMatches() {
    setLoading(true);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Create 3 deeply compatible match profiles for this person. Profile: ${JSON.stringify(profile)}

Return ONLY a JSON array, no markdown:
[
  {
    "name": "First name",
    "age": 28,
    "city": "city name",
    "profession": "job title",
    "attachment": "Secure/Anxious/Avoidant",
    "compatibilityScore": 87,
    "sharedValues": ["value1","value2"],
    "whyTheyWork": "2 sentence explanation of why this match is powerful",
    "conversationStarter": "A thoughtful, specific conversation starter based on both profiles",
    "potentialFriction": "One honest potential challenge to navigate",
    "emoji": "A single emoji that captures their energy"
  }
]`
        }]
      }),
    });
    const data = await res.json();
    try {
      const text = data.content?.[0]?.text || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      setMatches(JSON.parse(clean));
    } catch (e) {
      setMatches([
        { name: "Aria", age: 29, city: "London", profession: "UX Designer", attachment: "Secure", compatibilityScore: 91, sharedValues: ["Authenticity", "Growth"], whyTheyWork: "You both prize depth over surface. Your emotional styles complement rather than clash.", conversationStarter: "I heard you're passionate about creativity — what's a project you've done that you're most proud of?", potentialFriction: "Both of you tend to need processing time after conflict.", emoji: "🌿" },
        { name: "James", age: 32, city: "NYC", profession: "Writer", attachment: "Anxious", compatibilityScore: 84, sharedValues: ["Depth", "Honesty"], whyTheyWork: "His emotional expressiveness meets your need for real connection. Together you'd create remarkable depth.", conversationStarter: "What's a book that changed how you see yourself?", potentialFriction: "His need for reassurance may test your patience at first.", emoji: "✍️" },
        { name: "Mia", age: 27, city: "Paris", profession: "Architect", attachment: "Secure", compatibilityScore: 88, sharedValues: ["Beauty", "Adventure"], whyTheyWork: "She brings structure to your creative energy. Your values align in the ways that matter most long-term.", conversationStarter: "If you could design your ideal Saturday from scratch, what would it look like?", potentialFriction: "Her independence may sometimes feel like distance.", emoji: "🏛️" }
      ]);
    }
    setLoading(false);
  }

  async function activateAgent(match) {
    setSelectedMatch(match);
    setAgentThinking(true);
    setActiveView("agent");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are ${profile.name}'s AI dating agent. You've just "negotiated" compatibility with ${match.name}'s agent. Write a warm, insightful briefing to ${profile.name} about this match.

${profile.name}'s profile: ${JSON.stringify(profile)}
Match: ${JSON.stringify(match)}

Include: why the agent selected this person, what to know before meeting, the pre-date conversation guide (3 questions to ask), and what to watch for. Be warm, specific, human. Under 350 words.`
        }]
      }),
    });
    const data = await res.json();
    setAgentMessage(data.content?.[0]?.text || "");
    setAgentThinking(false);
  }

  const getCompatColor = (score) => {
    if (score >= 88) return colors.green;
    if (score >= 80) return colors.accent;
    return colors.gold;
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <OrbBg variant="match" />
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{
          padding: "24px",
          borderBottom: `1px solid ${colors.border}`,
          background: "rgba(10,10,15,0.8)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.rose})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700,
                  }}>✦</div>
                  <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>BiggDate</span>
                </div>
                <div style={{ fontSize: 13, color: colors.textMuted }}>Agent-curated for {profile.name}</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {["matches", "coach"].map(v => (
                  <button key={v} onClick={() => setActiveView(v)} style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    border: `1px solid ${activeView === v ? colors.borderGlow : colors.border}`,
                    background: activeView === v ? colors.accentSoft : "transparent",
                    color: activeView === v ? colors.accent : colors.textMuted,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
                    transition: "all 0.2s ease",
                    textTransform: "capitalize",
                  }}>{v}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 60px" }}>

          {/* Matches View */}
          {(activeView === "matches" || activeView === "agent") && (
            <>
              {activeView === "matches" && (
                <>
                  <div style={{ marginBottom: 32 }}>
                    <div style={{
                      padding: "4px 12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      borderRadius: 99,
                      background: "rgba(255,107,138,0.1)",
                      border: "1px solid rgba(255,107,138,0.25)",
                      fontSize: 12,
                      color: colors.rose,
                      marginBottom: 16,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      ◆ This Week's BiggDate Matches
                    </div>
                    <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
                      3 people worth knowing
                    </h2>
                    <p style={{ color: colors.textMuted, fontSize: 15, fontWeight: 300 }}>
                      Your AI agent evaluated {loading ? "..." : "thousands"} of profiles. These three made the cut.
                    </p>
                  </div>

                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{
                          height: 160, borderRadius: 24,
                          background: `linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)`,
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.5s ease infinite",
                          border: `1px solid ${colors.border}`,
                        }} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {matches.map((match, i) => (
                        <div key={i} style={{
                          padding: "28px",
                          borderRadius: 24,
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${colors.border}`,
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.borderGlow; e.currentTarget.style.transform = "translateY(-3px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                            {/* Avatar */}
                            <div style={{
                              width: 64, height: 64, borderRadius: 20, flexShrink: 0,
                              background: `linear-gradient(135deg, ${colors.accent}40, ${colors.rose}30)`,
                              border: `2px solid ${colors.borderGlow}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 28,
                            }}>{match.emoji}</div>

                            <div style={{ flex: 1, minWidth: 200 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                                <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.025em" }}>
                                  {match.name}, {match.age}
                                </span>
                                <span style={{
                                  padding: "3px 10px",
                                  borderRadius: 99,
                                  background: `${getCompatColor(match.compatibilityScore)}20`,
                                  border: `1px solid ${getCompatColor(match.compatibilityScore)}44`,
                                  fontSize: 12,
                                  color: getCompatColor(match.compatibilityScore),
                                  fontWeight: 600,
                                }}>{match.compatibilityScore}% match</span>
                              </div>
                              <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>
                                {match.profession} · {match.city} · {match.attachment} attachment
                              </div>
                              <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7, marginBottom: 16 }}>
                                {match.whyTheyWork}
                              </p>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                                {(match.sharedValues || []).map((v, j) => (
                                  <span key={j} style={{
                                    padding: "4px 12px",
                                    borderRadius: 99,
                                    background: colors.accentSoft,
                                    border: `1px solid ${colors.borderGlow}`,
                                    fontSize: 12,
                                    color: colors.accent,
                                  }}>{v}</span>
                                ))}
                              </div>

                              <div style={{
                                padding: "14px 16px",
                                borderRadius: 12,
                                background: "rgba(245,200,66,0.06)",
                                border: "1px solid rgba(245,200,66,0.2)",
                                marginBottom: 16,
                              }}>
                                <div style={{ fontSize: 11, color: colors.gold, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>💬 Conversation Starter</div>
                                <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.6, fontStyle: "italic" }}>"{match.conversationStarter}"</div>
                              </div>

                              <button onClick={() => activateAgent(match)} style={{
                                padding: "12px 24px",
                                borderRadius: 12,
                                background: `linear-gradient(135deg, ${colors.accent}30, ${colors.rose}20)`,
                                border: `1px solid ${colors.borderGlow}`,
                                color: colors.text,
                                fontSize: 14,
                                cursor: "pointer",
                                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
                                fontWeight: 500,
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                                onMouseEnter={e => { e.currentTarget.style.background = colors.accentSoft; }}
                                onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${colors.accent}30, ${colors.rose}20)`; }}
                              >
                                <span>✦</span> Get Agent Briefing
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Agent Briefing View */}
              {activeView === "agent" && selectedMatch && (
                <div className="fade-in">
                  <button onClick={() => setActiveView("matches")} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "transparent", border: "none",
                    color: colors.textMuted, cursor: "pointer",
                    fontSize: 14, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
                    marginBottom: 28, padding: 0,
                    transition: "color 0.2s ease",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = colors.text}
                    onMouseLeave={e => e.currentTarget.style.color = colors.textMuted}
                  >
                    ← Back to matches
                  </button>

                  <div style={{
                    padding: "4px 12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 99,
                    background: colors.accentSoft,
                    border: `1px solid ${colors.borderGlow}`,
                    fontSize: 12,
                    color: colors.accent,
                    marginBottom: 20,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    ◆ Agent Briefing
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                    <div style={{
                      width: 72, height: 72, borderRadius: 22,
                      background: `linear-gradient(135deg, ${colors.accent}40, ${colors.rose}30)`,
                      border: `2px solid ${colors.borderGlow}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 32, animation: "float 3s ease infinite",
                    }}>{selectedMatch.emoji}</div>
                    <div>
                      <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" }}>
                        {selectedMatch.name}, {selectedMatch.age}
                      </h2>
                      <p style={{ color: colors.textMuted, fontSize: 14 }}>{selectedMatch.profession} · {selectedMatch.city}</p>
                    </div>
                  </div>

                  <div style={{
                    padding: "28px",
                    borderRadius: 24,
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${colors.border}`,
                    marginBottom: 24,
                  }}>
                    {agentThinking ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <Spinner color={colors.accent} size={24} />
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Your agent is working…</div>
                          <div style={{ fontSize: 13, color: colors.textMuted }}>Analyzing compatibility and preparing your briefing</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 15, lineHeight: 1.9, color: colors.textMuted, fontWeight: 300, whiteSpace: "pre-wrap" }}>
                        {agentMessage}
                      </div>
                    )}
                  </div>

                  {!agentThinking && (
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <button style={{
                        flex: 1, minWidth: 160,
                        padding: "14px 24px",
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.rose})`,
                        border: "none",
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
                        boxShadow: `0 6px 20px ${colors.accentGlow}`,
                        transition: "all 0.2s ease",
                      }}>
                        Request Introduction
                      </button>
                      <button style={{
                        flex: 1, minWidth: 160,
                        padding: "14px 24px",
                        borderRadius: 14,
                        background: "transparent",
                        border: `1px solid ${colors.border}`,
                        color: colors.textMuted,
                        fontSize: 15,
                        cursor: "pointer",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
                        transition: "all 0.2s ease",
                      }}>
                        Pass
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Coach View */}
          {activeView === "coach" && (
            <CoachView profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Coach View ───────────────────────────────────────────────────────────────
const CoachView = ({ profile }) => {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Welcome back, ${profile.name}. I've been thinking about you.\n\nYou're ${profile.readinessScore}% relationship-ready — and that number grows every day you show up for yourself. Your ${profile.attachment} attachment style means ${profile.attachment === "Secure" ? "you're already bringing stability and clarity to connections" : "there's beautiful work ahead in how you give and receive love"}.\n\nWhat's on your mind today? I'm here for whatever you need — processing a date, working through a pattern, or simply talking about where you are right now.`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const cleanText = (text) => text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/#+\s/g, '').trim();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    const newHistory = [...history, { role: "user", content: msg }];
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        system: `You are BiggDate's relationship intelligence coach for ${profile.name}. 
Profile: ${JSON.stringify(profile)}
You know their attachment style, growth areas, strengths, and coaching focus intimately.
Be warm, insightful, occasionally challenging when needed. Ask powerful questions. Reference their specific profile. 
You're like the world's best relationship therapist meets a brilliant, caring best friend.
Keep responses concise but profound — 2-4 paragraphs max.`,
        messages: [...newHistory],
      }),
    });
    const data = await res.json();
    const reply = data.content?.[0]?.text || "I'm here.";
    setHistory([...newHistory, { role: "assistant", content: reply }]);
    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          padding: "4px 12px",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          borderRadius: 99,
          background: "rgba(79,255,176,0.1)",
          border: "1px solid rgba(79,255,176,0.25)",
          fontSize: 12,
          color: colors.green,
          marginBottom: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>◆ BiggDate Coach · Always On</div>
        <h2 style={{ letterSpacing: "-0.025em", fontSize: 28 }}>
          Your personal guide
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto", marginBottom: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} className="message-bubble" style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: "rgba(79,255,176,0.15)",
                border: "1px solid rgba(79,255,176,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, marginRight: 10, marginTop: 3, color: colors.green,
              }}>✦</div>
            )}
            <div style={{
              maxWidth: "80%",
              padding: "14px 18px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? colors.accentSoft : "rgba(255,255,255,0.04)",
              border: `1px solid ${msg.role === "user" ? colors.borderGlow : colors.border}`,
              fontSize: 14,
              lineHeight: 1.8,
              fontWeight: 300,
              whiteSpace: "pre-wrap",
            }}>{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: "rgba(79,255,176,0.15)",
              border: "1px solid rgba(79,255,176,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: colors.green,
            }}>✦</div>
            <div style={{
              padding: "14px 18px",
              borderRadius: "18px 18px 18px 4px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${colors.border}`,
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 150, 300].map(d => (
                <div key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: colors.green, animation: `pulse 1.2s ease ${d}ms infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Talk to your coach…"
          rows={1}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${colors.border}`,
            color: colors.text,
            fontSize: 14,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
            resize: "none",
            lineHeight: 1.5,
            minHeight: 48,
          }}
          onFocus={e => e.currentTarget.style.borderColor = "rgba(79,255,176,0.4)"}
          onBlur={e => e.currentTarget.style.borderColor = colors.border}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: input.trim() && !loading ? "rgba(79,255,176,0.2)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${input.trim() && !loading ? "rgba(79,255,176,0.4)" : colors.border}`,
          color: input.trim() && !loading ? colors.green : colors.textFaint,
          cursor: input.trim() && !loading ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, transition: "all 0.2s ease",
        }}>
          {loading ? <Spinner size={16} color={colors.green} /> : "↑"}
        </button>
      </div>
    </div>
  );
};

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [profile, setProfile] = useState(null);

  const handleOnboardingComplete = (p) => {
    setProfile(p);
    setScreen("report");
  };

  return (
    <>
      <GlobalStyle />
      {screen === "landing" && (
        <LandingScreen onStart={() => setScreen("onboarding")} />
      )}
      {screen === "onboarding" && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      {screen === "report" && profile && (
        <ReportScreen profile={profile} onContinue={() => setScreen("matches")} />
      )}
      {screen === "matches" && profile && (
        <MatchesScreen profile={profile} />
      )}
    </>
  );
}
