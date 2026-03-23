"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Conversation } from "@/components/ai-elements/conversation";
import { ChatMessage } from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth-provider";

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const sessionId = useRef(`onboarding-${Math.random().toString(36).slice(2, 10)}`);
  const [deriving, setDeriving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { sessionId: sessionId.current },
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Check for PROFILE_COMPLETE in the latest assistant message
  useEffect(() => {
    const lastMsg = messages.filter((m) => m.role === "assistant").at(-1);
    if (!lastMsg) return;
    const text = lastMsg.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
    if (text?.includes("PROFILE_COMPLETE") && !deriving) {
      deriveProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const deriveProfile = useCallback(async () => {
    setDeriving(true);
    const transcript = messages
      .map((m) => {
        const text = m.parts
          ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("") || "";
        return `${m.role}: ${text}`;
      })
      .join("\n");

    try {
      const res = await fetch("/api/profile/derive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const profile = await res.json();
      if (profile && profile.name) {
        await refresh(); // reload auth context with new profile
        router.push("/report");
      }
    } catch {
      setDeriving(false);
    }
  }, [messages, router]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const questionCount = messages.filter((m) => m.role === "assistant").length;
  const progress = Math.min((questionCount / 10) * 100, 100);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background orbs */}
      <div
        className="pointer-events-none fixed top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--bd-border)" }}>
        <span className="text-lg font-bold" style={{ color: "var(--bd-accent)" }}>
          BiggDate
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "var(--bd-text-muted)" }}>
            Soul Discovery
          </span>
          <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bd-surface)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: "var(--bd-accent)" }}
            />
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4">
        {messages.length === 0 && !isStreaming ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20 page-enter">
            <div className="relative mb-6">
              <div className="text-5xl" style={{ animation: "float 3s ease-in-out infinite" }}>
                🧠
              </div>
              <div
                className="absolute inset-0 rounded-full -m-4"
                style={{
                  border: "2px solid var(--bd-accent)",
                  animation: "pulseRing 2s ease-out infinite",
                }}
              />
            </div>
            <h2 className="text-2xl font-bold mb-3 page-enter page-enter-delay-1">Let&apos;s discover your soul</h2>
            <p className="text-sm max-w-md page-enter page-enter-delay-2" style={{ color: "var(--bd-text-muted)" }}>
              I&apos;m going to ask you a few questions about how you love, what you need,
              and who you really are. Be honest — the more real you are, the better
              your matches will be.
            </p>
            <Button
              className="mt-8 bg-[var(--bd-accent)] text-black font-semibold rounded-full px-8"
              onClick={() => sendMessage({ text: "Hey, I'm ready. Let's go." })}
            >
              Begin
            </Button>
          </div>
        ) : (
          <Conversation className="py-6">
            {messages
              .filter((m) => {
                // Hide messages containing PROFILE_COMPLETE
                const text = m.parts
                  ?.filter(
                    (p): p is { type: "text"; text: string } => p.type === "text",
                  )
                  .map((p) => p.text)
                  .join("");
                return !text?.includes("PROFILE_COMPLETE");
              })
              .map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            {deriving && (
              <div className="flex items-center gap-3 py-4 px-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ background: "var(--bd-accent)" }}
                />
                <span className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
                  Analyzing your soul profile...
                </span>
              </div>
            )}
          </Conversation>
        )}
      </div>

      {/* Input area */}
      {messages.length > 0 && !deriving && (
        <div className="sticky bottom-0 border-t px-4 py-4" style={{ borderColor: "var(--bd-border)", background: "var(--bd-bg)" }}>
          <div className="max-w-2xl mx-auto flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Be honest..."
              className="flex-1 min-h-[44px] max-h-32 resize-none bg-[var(--bd-surface)] border-[var(--bd-border)] text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] rounded-xl"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="bg-[var(--bd-accent)] text-black font-semibold rounded-xl px-5 disabled:opacity-40"
            >
              {isStreaming ? "..." : "Send"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
