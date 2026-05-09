"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUp, X, Sparkles, Lock } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { splitAssistantBubbles } from "@/components/chat-message";

const ANON_STARTERS = [
  "How do you actually work?",
  "Is this just another dating app?",
  "What's a soul profile?",
];

const AUTH_STARTERS = [
  "What's my attachment style?",
  "Tell me about my latest match",
  "Am I repeating any patterns?",
];

export function MaahiChat() {
  const pathname = usePathname();
  const router = useRouter();
  const { userId, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  // Stable transport — recreating on every render breaks the connection
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/companion/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ 
    transport,
    onError: (err) => {
      if (err.message.includes("limit reached")) {
        console.log("[Analytics] maahi_quota_exhausted");
        fetchQuota(); // Refresh quota to reflect the hard limit
      }
    }
  });

  const isAuthed = Boolean(userId);
  const starters = isAuthed ? AUTH_STARTERS : ANON_STARTERS;
  const greeting = isAuthed && profile?.name ? `Hey ${profile.name.split(" ")[0]}` : "Hey, I'm Maahi";
  const subtitle = isAuthed
    ? "Quick check-ins live here. For deep work, head to your full Maahi space."
    : "Your relationship guide. Ask me anything about how this works or what makes us different.";

  const isStreaming = status === "streaming" || status === "submitted";

  // Quota state
  const [quota, setQuota] = useState<{ allowed: boolean; limit: number; used: number; plan: string } | null>(null);

  const fetchQuota = useCallback(async () => {
    if (!isAuthed) return;
    try {
      const res = await fetch("/api/companion/quota");
      if (res.ok) {
        setQuota(await res.json());
      }
    } catch { /* ignore */ }
  }, [isAuthed]);

  useEffect(() => {
    if (open && isAuthed && !quota) {
      console.log("[Analytics] maahi_opened_free_user");
      fetchQuota();
    }
  }, [open, isAuthed, quota, fetchQuota]);

  // Re-fetch quota after a message is sent
  useEffect(() => {
    if (status === "ready" && messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      fetchQuota();
    }
  }, [status, messages, fetchQuota]);

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
    
    // Check local quota before sending if we know they are out
    if (quota && !quota.allowed) {
       console.log("[Analytics] maahi_quota_exhausted");
       return;
    }

    if (messages.length === 0) {
      console.log("[Analytics] maahi_first_message_sent");
    }

    sendMessage({ text });
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, isStreaming, sendMessage, quota, messages.length]);

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
    pathname === "/companion" ||
    pathname === "/simulation"
  ) {
    return null;
  }

  const limitReached = quota && !quota.allowed;
  const isNearLimit = quota && quota.limit > 0 && quota.used >= quota.limit - 3 && !limitReached;
  
  if (isNearLimit && open) {
    console.log("[Analytics] maahi_warning_shown");
  }

  return (
    <>
      {/* Chat panel — pinned to the right edge of the centered content frame */}
      {open && (
        <div className="pointer-events-none fixed inset-x-0 z-50" style={{ bottom: "calc(100px + env(safe-area-inset-bottom, 0px))" }}>
          <div
            className="relative mx-auto px-4 sm:px-6"
            style={{ maxWidth: "var(--bd-app-max-w)" }}
          >
        <div
          className="pointer-events-auto absolute right-4 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl sm:right-6 sm:w-[400px]"
          style={{
            bottom: 0,
            height: "min(560px, calc(100vh - 7rem))",
            background: "var(--bd-bg)",
            border: "1px solid var(--bd-border)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,0,255,0.06)",
          }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
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
            <div className="flex items-center gap-3">
              {quota && quota.limit > 0 && (
                <div className="text-[10px] font-medium tracking-wide">
                  <span style={{ color: isNearLimit || limitReached ? "#ef8cab" : "var(--bd-text-muted)" }}>
                    {quota.limit - quota.used} / {quota.limit}
                  </span>
                  <span className="ml-1 opacity-50 uppercase">Free Left</span>
                </div>
              )}
              <button
                onClick={() => setOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bd-surface-hover)]"
              >
                <X className="size-4" style={{ color: "var(--bd-text-muted)" }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div
                  className="mb-4 flex size-12 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(255,0,255,0.1)" }}
                >
                  <Sparkles className="size-5" style={{ color: "var(--bd-accent)" }} />
                </div>
                <p className="text-sm font-medium">{greeting}</p>
                <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed" style={{ color: "var(--bd-text-muted)" }}>
                  {subtitle}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {starters.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage({ text: q })}
                      disabled={limitReached}
                      className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors hover:bg-[var(--bd-surface-hover)] disabled:opacity-50"
                      style={{
                        background: "var(--bd-surface)",
                        border: "1px solid var(--bd-border)",
                        color: "var(--bd-text-muted)",
                      }}
                    >
                      {q}
                    </button>
                  ))}
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
                  const bubbles = isUser ? [text] : splitAssistantBubbles(text);
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex max-w-[85%] flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
                        {bubbles.map((bubble, index) => (
                          <div
                            key={index}
                            className="rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap"
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
                            {bubble}
                          </div>
                        ))}
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
            {limitReached ? (
              <div className="rounded-xl border border-[#d4688a]/20 bg-[#d4688a]/5 p-4 text-center">
                <Lock className="mx-auto mb-2 size-5 text-[#ef8cab] opacity-80" />
                <p className="mb-3 text-[13px] font-medium text-[#ef8cab]">You've reached your free limit</p>
                <p className="mb-4 text-[11px] text-[#ef8cab]/70">Upgrade to BiggDate Premium for unlimited deep-dive sessions with Maahi.</p>
                <button
                  onClick={() => {
                    console.log("[Analytics] maahi_upgrade_clicked");
                    router.push("/settings/billing");
                  }}
                  className="w-full rounded-lg bg-[#d4688a]/15 py-2 text-xs font-semibold text-[#ef8cab] transition hover:bg-[#d4688a]/25"
                >
                  Upgrade to Premium
                </button>
              </div>
            ) : (
              <div
                className="flex flex-col gap-1.5 rounded-xl p-1.5"
                style={{
                  background: "var(--bd-surface)",
                  border: isNearLimit ? "1px solid rgba(239, 140, 171, 0.4)" : "1px solid var(--bd-border)",
                }}
              >
                {isNearLimit && (
                  <p className="px-2 pt-1 text-[10px] font-medium text-[#ef8cab]">
                    Only {quota.limit - quota.used} messages left this week
                  </p>
                )}
                <div className="flex items-end gap-1.5">
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
            )}
          </div>
          </div>
          </div>
        </div>
      )}

      {/* Floating trigger button — pinned to the right edge of the centered frame */}
      <div className="pointer-events-none fixed inset-x-0 z-50" style={{ bottom: "calc(82px + env(safe-area-inset-bottom, 0px))" }}>
        <div
          className="relative mx-auto px-4 sm:px-6"
          style={{ maxWidth: "var(--bd-app-max-w)" }}
        >
          <button
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto absolute right-4 flex size-14 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 sm:right-6"
            style={{
              bottom: 0,
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
        </div>
      </div>
    </>
  );
}
