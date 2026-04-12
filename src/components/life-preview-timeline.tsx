"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Sparkles } from "lucide-react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";

export function LifePreviewTimeline() {
  const [input, setInput] = useState("");

  // Stable transport — recreating on every render causes instability
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/maahi" }),
    []
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "streaming" || status === "submitted";
  const aiResponseCount = messages.filter((m) => m.role === "assistant").length;
  const showSignupNudge = aiResponseCount >= 3;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const SUGGESTIONS = [
    "I mass-reject on hinge lol",
    "my calendar runs my love life",
    "I'm lowkey afraid of settling",
    "how do builders even date??",
  ];

  const displayMessages = messages.length > 0
    ? messages
    : [
        {
          id: "initial",
          role: "assistant" as const,
          parts: [{ type: "text" as const, text: "hey, i'm maahi. think of me as the friend who actually tells you why your situationship isn't working.\n\nso — what's your biggest dating crime rn?" }],
        },
      ];

  return (
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,rgba(10,16,29,0.8),rgba(7,12,23,0.96))]">
      {/* Maahi header */}
      <div className="flex items-center gap-3 border-b border-white/8 px-5 pb-4 pt-5">
        <div className="relative shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(129,171,255,0.28), rgba(217,111,176,0.22))",
              boxShadow: "0 14px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{ background: "#22c55e", borderColor: "rgba(10,10,15,0.95)" }}
          />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Maahi</p>
          <p className="text-[11px]" style={{ color: "var(--bd-text-faint)" }}>
            Builder match intelligence · Online
          </p>
        </div>
        <div className="ml-auto">
          <span
            className="text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-full"
            style={{
              background: "rgba(34,197,94,0.12)",
              color: "#7ef0a4",
              border: "1px solid rgba(126,240,164,0.16)",
            }}
          >
            Live
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scroll-smooth">
        {displayMessages.map((msg) => {
          const isYou = msg.role === "user";
          const textContent =
            msg.parts
              ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("") || "";

          if (!textContent) return null;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${isYou ? "flex-row-reverse" : "flex-row"}`}
              style={{ animationDuration: "250ms" }}
            >
              {!isYou && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(129,171,255,0.22), rgba(217,111,176,0.18))",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
                  }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}

              <div className={`max-w-[80%] ${isYou ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    isYou
                      ? {
                          background: "linear-gradient(135deg, rgba(113,134,255,0.98), rgba(238,134,195,0.92))",
                          color: "#fff",
                          borderRadius: "18px 4px 18px 18px",
                          boxShadow: "0 16px 34px rgba(111,134,255,0.22)",
                        }
                      : {
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "var(--bd-text)",
                          borderRadius: "4px 18px 18px 18px",
                          whiteSpace: "pre-wrap",
                          backdropFilter: "blur(20px)",
                        }
                  }
                >
                  {textContent}
                </div>
              </div>
            </div>
          );
        })}

        {/* Suggestion chips — show only on initial state */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in slide-in-from-bottom-2" style={{ animationDuration: "400ms", animationDelay: "300ms", animationFillMode: "both" }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  sendMessage({ text: s });
                  setInput("");
                }}
                className="rounded-full px-3.5 py-2 text-[12px] font-medium transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--bd-text-muted)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {isLoading && displayMessages[displayMessages.length - 1]?.role === "user" && (
          <div className="flex gap-3 animate-in fade-in duration-300">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(129,171,255,0.22), rgba(217,111,176,0.18))",
                boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
              }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div
              className="flex items-center gap-1 px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px 18px 18px 18px",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "120ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "240ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Sign-up nudge — appears after 3 AI responses */}
      {showSignupNudge && (
        <div
          className="mx-4 mb-3 rounded-2xl px-4 py-3 text-center animate-in fade-in slide-in-from-bottom-2"
          style={{
            background: "linear-gradient(135deg, rgba(212,104,138,0.12), rgba(113,134,255,0.10))",
            border: "1px solid rgba(212,104,138,0.2)",
            animationDuration: "350ms",
          }}
        >
          <p className="text-[12px] text-white/60 mb-2">
            Maahi can go deeper when she knows your full story.
          </p>
          <Link
            href="/auth"
            className="inline-block rounded-full px-5 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #d4688a, #7186ff)",
            }}
          >
            Create your free profile →
          </Link>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-2 py-2 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Maahi what your life actually looks like..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 text-sm text-[var(--bd-text)] outline-none placeholder:text-[var(--bd-text-faint)]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
            style={{
              background: "linear-gradient(135deg, rgba(255,226,243,0.98), rgba(182,231,255,0.94))",
              boxShadow: "0 10px 24px rgba(108,132,255,0.2)",
            }}
          >
            <ArrowUp className="w-4 h-4 text-[#0b1020]" />
          </button>
        </form>
      </div>
    </div>
  );
}
