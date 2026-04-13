"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AmbientLayer, ACT_COLORS, type Act } from "@/components/onboarding/ambient-layer";
import { ThinkingPulse } from "@/components/onboarding/thinking-pulse";
import {
  QuickReplies,
  parseChips,
  parseMultiSelect,
  hasAgeRange,
  hasDatePicker,
} from "@/components/onboarding/quick-replies";
import { SoulSignal } from "@/components/onboarding/soul-signal";
import { OnboardingMessage, getMessageText } from "@/components/chat-message";
import { useAuth } from "@/components/auth-provider";

function getAct(aiMessageCount: number): Act {
  if (aiMessageCount <= 2) return 1;
  if (aiMessageCount <= 4) return 2;
  if (aiMessageCount <= 6) return 3;
  if (aiMessageCount <= 7) return 4;
  return 5;
}

const PLACEHOLDERS: Record<Act, string> = {
  1: "What feels true right now...",
  2: "Take your time...",
  3: "Be honest...",
  4: "Dream a little...",
  5: "Last thing...",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh, hydrateProfile, loading: authLoading, userId, profile } = useAuth();
  const sessionId = useRef(
    `onboarding-${Math.random().toString(36).slice(2, 10)}`,
  );

  const [input, setInput] = useState("");
  const [revealing, setRevealing] = useState(false);
  const [derivingStarted, setDerivingStarted] = useState(false);
  const [deriveError, setDeriveError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100dvh");

  const autoStarted = useRef(false);
  const profileCompleteDetected = useRef(false);
  const initMessageId = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Guard: redirect away if user already has a completed profile
  useEffect(() => {
    if (authLoading) return;
    if (!userId) return; // AuthProvider handles unauthenticated redirect
    if (profile?.name) {
      router.replace("/soul-snapshot");
    }
  }, [authLoading, userId, profile, router]);

  // Stable transport — must not be recreated on every render or sendMessage
  // identity changes, which cancels the auto-start timer mid-countdown.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { sessionId: sessionId.current },
      }),
    [],
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isStreaming = status === "streaming" || status === "submitted";

  const scrollConversationToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const el = scrollAreaRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior });
    },
    [],
  );

  // Auto-start: fire __BEGIN__ only after auth is confirmed and user has no profile.
  // autoStarted is set INSIDE the timeout so that if the effect re-runs (e.g. due
  // to sendMessage identity change) we clear the stale timer and reschedule — the
  // last scheduled invocation wins and sets the flag only when it actually fires.
  useEffect(() => {
    if (authLoading || !userId || profile?.name) return;
    if (autoStarted.current) return;
    const timer = setTimeout(() => {
      if (autoStarted.current) return;
      autoStarted.current = true;
      sendMessage({ text: "__BEGIN__" });
    }, 1200);
    return () => clearTimeout(timer);
  }, [authLoading, userId, profile, sendMessage]);

  // Track the ID of the init trigger message (first user message)
  useEffect(() => {
    const firstUser = messages.find((m) => m.role === "user");
    if (firstUser && !initMessageId.current) {
      initMessageId.current = firstUser.id;
    }
  }, [messages]);

  // Detect PROFILE_COMPLETE in latest AI message — fires only once
  useEffect(() => {
    if (profileCompleteDetected.current) return;
    if (isStreaming) return;
    const lastAI = messages.filter((m) => m.role === "assistant").at(-1);
    if (!lastAI) return;
    const text = getMessageText(lastAI);
    if (text.includes("PROFILE_COMPLETE")) {
      profileCompleteDetected.current = true;
      setRevealing(true);
    }
  }, [messages, isStreaming]);

  // Derive profile — runs once when revealing becomes true
  useEffect(() => {
    if (!revealing || derivingStarted) return;
    setDerivingStarted(true);

    const transcript = messages
      .map((m) => `${m.role}: ${getMessageText(m)}`)
      .join("\n");

    fetch("/api/profile/derive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      })
      .then(async (response) => {
        const profile = await response.json();
        if (!response.ok) {
          throw new Error(profile?.error || "Failed to derive profile");
        }
        return profile;
      })
      .then((profile) => {
        if (profile?.name) {
          hydrateProfile(profile);
          router.replace("/soul-snapshot");
          void refresh();
        } else {
          setDeriveError(true);
        }
      })
      .catch(() => {
        setDeriveError(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealing]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollConversationToBottom("smooth");
  }, [messages, isStreaming, scrollConversationToBottom]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateViewportHeight = () => {
      const nextHeight = window.visualViewport?.height ?? window.innerHeight;
      const nextViewportHeight = `${Math.round(nextHeight)}px`;
      setViewportHeight(nextViewportHeight);
      document.documentElement.style.setProperty(
        "--bd-viewport-height",
        nextViewportHeight,
      );
    };

    updateViewportHeight();

    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);

    return () => {
      visualViewport?.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
      document.documentElement.style.removeProperty("--bd-viewport-height");
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyHeight = document.body.style.height;
    const previousHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.height = previousBodyHeight;
      document.documentElement.style.height = previousHtmlHeight;
    };
  }, []);

  useEffect(() => {
    if (!isInputFocused) return;

    const frame = window.requestAnimationFrame(() => {
      scrollConversationToBottom("smooth");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isInputFocused, viewportHeight, scrollConversationToBottom]);

  // Derived state
  const aiMessageCount = messages.filter((m) => m.role === "assistant").length;
  const act = getAct(aiMessageCount);
  const accentColor = ACT_COLORS[act];

  // User answers excluding the init trigger
  const completedQuestions = Math.min(
    messages.filter(
      (m) => m.role === "user" && m.id !== initMessageId.current,
    ).length,
    11,
  );

  // Messages to display — filter init trigger + PROFILE_COMPLETE messages
  const visibleMessages = messages.filter((m) => {
    if (m.id === initMessageId.current) return false;
    if (getMessageText(m).includes("PROFILE_COMPLETE")) return false;
    return true;
  });

  // Extract chips from last AI message (only when streaming is done)
  const lastAIMessage = messages.filter((m) => m.role === "assistant").at(-1);
  const lastAIText = useMemo(() => {
    if (isStreaming || !lastAIMessage) return "";
    const text = getMessageText(lastAIMessage);
    if (text.includes("PROFILE_COMPLETE")) return "";
    return text;
  }, [lastAIMessage, isStreaming]);

  const currentChips = useMemo(() => parseChips(lastAIText), [lastAIText]);
  const currentMultiSelect = useMemo(() => parseMultiSelect(lastAIText), [lastAIText]);
  const currentShowAgeRange = useMemo(() => hasAgeRange(lastAIText), [lastAIText]);
  const currentShowDatePicker = useMemo(() => hasDatePicker(lastAIText), [lastAIText]);
  const showAnyInlineUI =
    currentChips.length > 0 ||
    currentMultiSelect.length > 0 ||
    currentShowAgeRange ||
    currentShowDatePicker;

  const handleSend = useCallback(
    (text?: string) => {
      const txt = (text ?? input).trim();
      if (!txt || isStreaming) return;
      sendMessage({ text: txt });
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    [input, isStreaming, sendMessage],
  );

  const handleChipSelect = useCallback(
    (chip: string) => handleSend(chip),
    [handleSend],
  );

  const handleSayMore = useCallback(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const isWelcome = visibleMessages.length === 0 && !isStreaming;

  // Blank screen while auth loads or while redirecting a user with existing profile
  if (authLoading || (!authLoading && userId && profile?.name)) {
    return (
      <div
        style={{
          background: "var(--bd-bg)",
          height: viewportHeight,
        }}
      />
    );
  }

  // Ritual reveal overlay
  if (revealing || deriveError) {
    return (
      <>
        <AmbientLayer act={5} />
        <div
          className="fixed inset-0 flex flex-col items-center justify-center gap-6"
          style={{ zIndex: 10 }}
        >
          {deriveError ? (
            <>
              <motion.p
                className="text-xl font-light tracking-wide"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ color: "var(--bd-text)", opacity: 0.7 }}
              >
                Something went wrong building your profile.
              </motion.p>
              <motion.button
                onClick={() => {
                  setDeriveError(false);
                  setDerivingStarted(false);
                  setRevealing(true);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="rounded-full px-6 py-2 text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "var(--bd-text)",
                }}
              >
                Try again
              </motion.button>
            </>
          ) : (
            <motion.p
              className="text-2xl font-light tracking-wide"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ color: "var(--bd-text)" }}
            >
              Wait a few seconds, we are analysing.
            </motion.p>
          )}
        </div>
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 flex min-h-0 flex-col overflow-hidden"
      style={{
        background: "var(--bd-bg)",
        height: viewportHeight,
      }}
    >
      <AmbientLayer act={act} />

      {/* Header */}
      <header
        className="relative flex-shrink-0 px-4 pb-3 pt-4"
        style={{ zIndex: 10 }}
      >
        <div
          className="mx-auto flex max-w-2xl items-center justify-between gap-4 rounded-[24px] px-4 py-3"
          style={{
            background: "rgba(12,16,30,0.72)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 10px 34px rgba(0,0,0,0.18)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${accentColor}30, rgba(255,255,255,0.08))`,
                border: `1px solid ${accentColor}35`,
                boxShadow: `0 8px 24px ${accentColor}18`,
              }}
            >
              <span style={{ fontSize: 16 }}>✨</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--bd-text)", margin: 0 }}>
                Maahi
              </p>
              <p className="text-[11px]" style={{ color: "var(--bd-text-faint)", opacity: 0.65, margin: 0 }}>
                Building your profile, one real answer at a time
              </p>
            </div>
          </div>

          {!isWelcome && (
            <div
              className="rounded-full px-3 py-1 text-[11px] font-semibold tabular-nums"
              style={{
                color: accentColor,
                background: `${accentColor}12`,
                border: `1px solid ${accentColor}25`,
                whiteSpace: "nowrap",
              }}
            >
              {completedQuestions}/11
            </div>
          )}
        </div>
      </header>

      {/* Content area */}
      <div
        ref={scrollAreaRef}
        className="onboarding-scroll relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
        style={{
          zIndex: 10,
          WebkitOverflowScrolling: "touch",
          scrollPaddingBottom: "calc(7rem + env(safe-area-inset-bottom, 0px))",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <AnimatePresence mode="wait">
          {isWelcome ? (
            <motion.div
              key="welcome"
              className="flex h-full flex-col items-center justify-center px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-3xl font-light tracking-tight sm:text-4xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: "var(--bd-text)" }}
              >
                Tell me something real
                <br />
                <span style={{ color: accentColor, opacity: 0.75 }}>
                  and I&apos;ll show you who you are.
                </span>
              </motion.h1>
              <motion.p
                className="mt-4 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{ color: "var(--bd-text-faint)" }}
              >
                Private. No forms. Just a conversation.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="conversation"
              className="mx-auto w-full max-w-2xl px-4 pb-14 pt-8 sm:pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-5">
                {visibleMessages.map((message) => (
                  <OnboardingMessage
                    key={message.id}
                    message={message}
                    act={act}
                  />
                ))}

                {status === "submitted" && <ThinkingPulse act={act} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <AnimatePresence>
        {!isWelcome && (
          <motion.div
            className="relative flex-shrink-0 px-4 pt-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              zIndex: 10,
              paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 -top-8 h-8"
              style={{
                background: "linear-gradient(to top, var(--bd-bg), transparent)",
              }}
            />
            <div className="mx-auto max-w-2xl">
              <div
                className="rounded-[28px] px-4 pb-3 pt-3"
                style={{
                  background: "rgba(10,14,26,0.82)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 10px 34px rgba(0,0,0,0.22)",
                }}
              >
                {showAnyInlineUI && (
                  <QuickReplies
                    key={lastAIMessage?.id}
                    chips={currentChips}
                    multiSelectOptions={currentMultiSelect}
                    showAgeRange={currentShowAgeRange}
                    showDatePicker={currentShowDatePicker}
                    act={act}
                    onSelect={handleChipSelect}
                    onMultiSelect={(selected) => handleSend(selected.join(", "))}
                    onAgeRange={(min, max) => handleSend(`${min} to ${max}`)}
                    onDatePick={(birthday, age, zodiac) =>
                      handleSend(
                        birthday
                          ? `My birthday is ${birthday}. I'm ${age} years old.${zodiac ? ` My zodiac sign is ${zodiac}.` : ""}`
                          : "I'd rather not share my birthday",
                      )
                    }
                    onSayMore={handleSayMore}
                  />
                )}

                <div
                  className="flex items-end gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder={PLACEHOLDERS[act]}
                    rows={1}
                    className="flex-1 resize-none border-0 bg-transparent py-0.5 text-[15px] focus:outline-none"
                    style={{
                      color: "var(--bd-text)",
                      maxHeight: "160px",
                      caretColor: accentColor,
                    }}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isStreaming}
                    className="mb-0.5 flex size-9 flex-shrink-0 items-center justify-center rounded-full transition-all"
                    style={{
                      background:
                        input.trim() && !isStreaming
                          ? accentColor
                          : "rgba(255,255,255,0.06)",
                      opacity: input.trim() && !isStreaming ? 1 : 0.55,
                      cursor: input.trim() && !isStreaming ? "pointer" : "default",
                    }}
                    aria-label="Send"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M7 11.5V2.5M3 6.5l4-4 4 4"
                        stroke={input.trim() && !isStreaming ? "white" : "rgba(255,255,255,0.45)"}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <p
                  className="mt-2 text-center text-[10px]"
                  style={{ color: "var(--bd-text-faint)", opacity: 0.34 }}
                >
                  Private and used only to build your profile
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soul Signal */}
      <AnimatePresence>
        {!isWelcome && completedQuestions > 0 && (
          <motion.div
            className="fixed bottom-6 left-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ zIndex: 20 }}
          >
            <SoulSignal completed={completedQuestions} act={act} />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .onboarding-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
