"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, X, Sparkles } from "lucide-react";

export function MaahiChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/maahi" }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  // Hide on landing, auth, and onboarding — those have their own flows
  if (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/auth" ||
    pathname === "/onboarding" ||
    pathname === "/companion"
  ) {
    return null;
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl sm:right-6 sm:w-[400px]"
          style={{
            bottom: "calc(100px + env(safe-area-inset-bottom, 0px))",
            height: "min(560px, calc(100vh - 7rem))",
            background: "var(--bd-bg)",
            border: "1px solid var(--bd-border)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,0,255,0.06)",
          }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              borderBottom: "1px solid var(--bd-border)",
              background: "var(--bd-surface)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex size-7 items-center justify-center rounded-lg"
                style={{ background: "rgba(255,0,255,0.12)" }}
              >
                <Sparkles className="size-3.5" style={{ color: "var(--bd-accent)" }} />
              </div>
              <div>
                <span className="text-sm font-semibold">Maahi</span>
                <span className="ml-1.5 text-[11px]" style={{ color: "var(--bd-text-faint)" }}>
                  AI Guide
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bd-surface-hover)]"
            >
              <X className="size-4" style={{ color: "var(--bd-text-muted)" }} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div
                  className="mb-4 flex size-12 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(255,0,255,0.1)" }}
                >
                  <Sparkles className="size-5" style={{ color: "var(--bd-accent)" }} />
                </div>
                <p className="text-sm font-medium">Hey, I&apos;m Maahi</p>
                <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed" style={{ color: "var(--bd-text-muted)" }}>
                  Your relationship guide. Ask me anything about dating, compatibility, or your profile.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {["How do I improve my profile?", "What's my attachment style?", "Dating tips for founders"].map(
                    (q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage({ text: q })}
                        className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-[var(--bd-surface-hover)]"
                        style={{
                          background: "var(--bd-surface)",
                          border: "1px solid var(--bd-border)",
                          color: "var(--bd-text-muted)",
                        }}
                      >
                        {q}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((m) => {
                  const text =
                    m.parts
                      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                      .map((p) => p.text)
                      .join("") || "";
                  if (!text) return null;
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed"
                        style={
                          isUser
                            ? {
                                background: "rgba(255,0,255,0.12)",
                                color: "var(--bd-text)",
                              }
                            : {
                                background: "var(--bd-surface)",
                                color: "var(--bd-text)",
                              }
                        }
                      >
                        {text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-3 pb-3 pt-1">
            <div
              className="flex items-end gap-1.5 rounded-xl p-1.5"
              style={{
                background: "var(--bd-surface)",
                border: "1px solid var(--bd-border)",
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask Maahi..."
                rows={1}
                className="flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-[13px] text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] focus:outline-none"
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="flex size-7 flex-shrink-0 items-center justify-center rounded-lg transition-all disabled:opacity-30"
                style={{
                  background:
                    input.trim() && !isStreaming ? "var(--bd-accent)" : "rgba(255,255,255,0.06)",
                }}
              >
                <ArrowUp
                  className="size-3.5"
                  style={{ color: input.trim() && !isStreaming ? "#000" : "var(--bd-text-faint)" }}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 z-50 flex size-14 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 sm:right-6"
        style={{
          bottom: "calc(82px + env(safe-area-inset-bottom, 0px))",
          background: open
            ? "var(--bd-surface)"
            : "linear-gradient(135deg, var(--bd-accent), var(--bd-pink))",
          border: open ? "1px solid var(--bd-border)" : "none",
          boxShadow: open ? "none" : "0 8px 32px rgba(255,0,255,0.3)",
        }}
        aria-label={open ? "Close Maahi" : "Chat with Maahi"}
      >
        {open ? (
          <X className="size-5" style={{ color: "var(--bd-text-muted)" }} />
        ) : (
          <Sparkles className="size-5 text-black" />
        )}
      </button>
    </>
  );
}
