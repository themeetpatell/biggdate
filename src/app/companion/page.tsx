"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { ChatMessage } from "@/components/chat-message";

// ── Conversation starters — no emojis, just honest words ────────────────────
const STARTERS = [
  "I'm overthinking someone",
  "I got ghosted",
  "Something good happened",
  "Am I repeating patterns?",
  "I'm anxious about a date",
  "What should I work on?",
  "I feel disconnected lately",
  "I need to vent",
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function greeting(name: string): string {
  const h = new Date().getHours();
  if (h < 5) return `Still up, ${name}?`;
  if (h < 12) return `Good morning, ${name}.`;
  if (h < 17) return `Hey, ${name}.`;
  if (h < 21) return `Good evening, ${name}.`;
  return `Hey, ${name}.`;
}

function contextLine(attachment: string): string {
  const map: Record<string, string> = {
    Secure: "You're steady in love — that's rarer than people realize.",
    Anxious: "Your heart feels deeply. That's not a flaw, it's a gift.",
    Avoidant: "You protect what matters to you. That's not coldness.",
    "Fearful-Avoidant": "You want closeness and safety both. They can coexist.",
  };
  return map[attachment] || "I'm here with you, no judgment.";
}

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(212,104,138,0.6)",
            animation: `maahiDot 1.3s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MaahiPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Stable transport — recreating on every render causes instability
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/companion/chat",
        body: { context: {} },
      }),
    []
  );

  const { messages, sendMessage, status } = useChat({ transport });
  const isStreaming = status === "streaming" || status === "submitted";
  const hasMessages = messages.length > 0;
  const lastMemoryUpdateRef = useRef(0);

  useEffect(() => {
    if (!authLoading && !profile) router.push("/onboarding");
  }, [profile, authLoading, router]);

  // Auto-scroll when messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Background memory update — fires every 3 AI responses, non-blocking
  useEffect(() => {
    if (status !== "ready") return;
    const aiCount = messages.filter((m) => m.role === "assistant").length;
    if (aiCount > 0 && aiCount % 3 === 0 && aiCount !== lastMemoryUpdateRef.current) {
      lastMemoryUpdateRef.current = aiCount;
      fetch("/api/companion/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      }).catch(() => {});
    }
  }, [status, messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  };

  if (authLoading || !profile) return null;

  return (
    <div
      style={{
        height: "100dvh",
        background: "#0A0A0F",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Ambient glows ── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-20%",
          right: "-15%",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "#d4688a",
          opacity: 0.07,
          filter: "blur(110px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: "-10%",
          left: "-12%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#B48CFF",
          opacity: 0.05,
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Sticky Maahi header — only when conversation is active ── */}
      {hasMessages && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "rgba(10,10,15,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "12px 20px",
          }}
        >
          <div
            style={{
              maxWidth: 480,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(212,104,138,0.2), rgba(180,140,255,0.15))",
                border: "1px solid rgba(212,104,138,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: "rgba(212,104,138,0.8)",
                flexShrink: 0,
              }}
            >
              ✦
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Maahi
            </span>
            {isStreaming && (
              <div style={{ marginLeft: 2 }}>
                <TypingDots />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Scrollable body ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: hasMessages
              ? "24px 20px 160px"
              : "56px 24px 160px",
          }}
        >
          {!hasMessages ? (
            /* ── Empty state — Maahi is present ── */
            <>
              {/* Maahi presence element */}
              <div style={{ marginBottom: 40 }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                  {/* Outer breathing ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -10,
                      borderRadius: "50%",
                      border: "1px solid rgba(212,104,138,0.12)",
                      animation: "breatheOuter 4s ease-in-out infinite",
                    }}
                  />
                  {/* Inner breathing ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      border: "1px solid rgba(212,104,138,0.2)",
                      animation: "breatheInner 4s ease-in-out infinite 0.5s",
                    }}
                  />
                  {/* Core */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(212,104,138,0.18), rgba(180,140,255,0.12))",
                      border: "1px solid rgba(212,104,138,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "rgba(212,104,138,0.8)",
                    }}
                  >
                    ✦
                  </div>
                </div>

                <h1
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 10px",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                  }}
                >
                  {greeting(profile.name)}
                </h1>
                <p
                  style={{
                    fontSize: 16,
                    color: "rgba(255,255,255,0.4)",
                    margin: "0 0 6px",
                    lineHeight: 1.65,
                  }}
                >
                  {contextLine(profile.attachment || "")}
                </p>
                <p
                  style={{
                    fontSize: 16,
                    color: "rgba(255,255,255,0.28)",
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  What&apos;s alive for you today?
                </p>
              </div>

              {/* Conversation starters — flowing chips */}
              <div>
                <p
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.18)",
                    margin: "0 0 14px",
                  }}
                >
                  Or start here
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage({ text: s })}
                      style={{
                        padding: "9px 16px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.5)",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        cursor: "pointer",
                        lineHeight: 1.4,
                        transition: "border-color 0.15s, color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.borderColor =
                          "rgba(212,104,138,0.3)";
                        (e.target as HTMLButtonElement).style.color =
                          "rgba(255,255,255,0.75)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.borderColor =
                          "rgba(255,255,255,0.08)";
                        (e.target as HTMLButtonElement).style.color =
                          "rgba(255,255,255,0.5)";
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ── Active conversation ── */
            <>
              {/* Messages */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
              <div ref={bottomRef} style={{ height: 1 }} />
            </>
          )}
        </div>
      </div>

      {/* ── Input bar — sits above the bottom nav ── */}
      <div
        style={{
          position: "fixed",
          bottom: "calc(82px + env(safe-area-inset-bottom, 0px))",
          left: 0,
          right: 0,
          zIndex: 40,
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "12px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Talk to Maahi…"
            disabled={isStreaming}
            style={{
              flex: 1,
              height: 46,
              borderRadius: 23,
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: 14,
              padding: "0 20px",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(212,104,138,0.4)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.09)";
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              border: "none",
              cursor: input.trim() && !isStreaming ? "pointer" : "default",
              background:
                input.trim() && !isStreaming
                  ? "linear-gradient(135deg, #e8927c, #d4688a)"
                  : "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            {isStreaming ? (
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.15)",
                  borderTopColor: "rgba(255,255,255,0.6)",
                  animation: "maahiSpin 0.8s linear infinite",
                }}
              />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={input.trim() ? "#fff" : "rgba(255,255,255,0.25)"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes breatheOuter {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50%       { transform: scale(1.18); opacity: 0.8; }
        }
        @keyframes breatheInner {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.1); opacity: 1; }
        }
        @keyframes maahiDot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.75); }
          40%           { opacity: 1;   transform: scale(1.25); }
        }
        @keyframes maahiSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
