"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Sparkles } from "lucide-react";
import { DefaultChatTransport } from "ai";

export function LifePreviewTimeline() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/maahi",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";
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

  const displayMessages = messages.length > 0
    ? messages
    : [
        {
          id: "initial",
          role: "assistant" as const,
          parts: [{ type: "text" as const, text: "Hi. I'm Maahi - the AI that helps builders date with more context. I pay attention to work rhythm, ambition, and emotional patterns, not just attraction.\n\nWhat part of your life tends to be hardest for a partner to understand?" }],
        },
      ];

  return (
    <div className="flex flex-col h-full">
      {/* Maahi header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/5">
        <div className="relative shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--bd-rose), #a855f7)",
              boxShadow: "0 0 16px rgba(0,102,255,0.5)",
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
              background: "rgba(34,197,94,0.1)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.25)",
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
                    background: "linear-gradient(135deg, var(--bd-rose), #a855f7)",
                    boxShadow: "0 0 8px rgba(0,102,255,0.35)",
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
                          background: "linear-gradient(135deg, var(--bd-rose), #7c3aed)",
                          color: "#fff",
                          borderRadius: "18px 4px 18px 18px",
                        }
                      : {
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "var(--bd-text)",
                          borderRadius: "4px 18px 18px 18px",
                          whiteSpace: "pre-wrap",
                        }
                  }
                >
                  {textContent}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && displayMessages[displayMessages.length - 1]?.role === "user" && (
          <div className="flex gap-3 animate-in fade-in duration-300">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
              style={{ background: "linear-gradient(135deg, var(--bd-rose), #a855f7)" }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div
              className="flex items-center gap-1 px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
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

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-2 py-2 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
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
              background: "linear-gradient(135deg, var(--bd-rose), #7c3aed)",
            }}
          >
            <ArrowUp className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
