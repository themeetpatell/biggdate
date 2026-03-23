"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Conversation } from "@/components/ai-elements/conversation";
import { ChatMessage } from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const QUICK_PROMPTS = [
  { emoji: "💭", text: "I'm overthinking about someone" },
  { emoji: "😰", text: "I'm anxious about a date tonight" },
  { emoji: "🎉", text: "Something great happened!" },
  { emoji: "💔", text: "I got ghosted again" },
  { emoji: "🤔", text: "Am I repeating old patterns?" },
  { emoji: "🌱", text: "What should I work on today?" },
];

export default function CompanionPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/companion/chat",
      body: { context: {} },
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (!authLoading && !profile) router.push("/onboarding");
  }, [profile, authLoading, router]);

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

  if (authLoading || !profile) return null;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="pointer-events-none fixed top-[-15%] left-[-5%] w-[350px] h-[350px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-15%] right-[-5%] w-[250px] h-[250px] rounded-full opacity-10 blur-[80px]"
        style={{ background: "var(--bd-rose)", animation: "orb2 18s ease-in-out infinite" }}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bd-glass" style={{ borderColor: "var(--bd-border)" }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="text-[var(--bd-text-muted)]"
        >
          ← Back
        </Button>
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-base">✨</span>
            <span className="text-sm font-semibold">Aura</span>
          </div>
          <div className="text-[10px]" style={{ color: "var(--bd-accent)" }}>
            Your AI Companion
          </div>
        </div>
        <div className="w-16" />
      </header>

      {/* Chat area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 page-enter">
            {/* Companion avatar */}
            <div className="relative mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: "linear-gradient(135deg, var(--bd-accent), var(--bd-rose))",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                ✨
              </div>
              <div
                className="absolute inset-0 rounded-full -m-2"
                style={{ border: "2px solid var(--bd-accent)", animation: "pulseRing 2s ease-out infinite" }}
              />
            </div>

            <h2 className="text-xl font-bold mb-2 page-enter page-enter-delay-1">
              Hey {profile.name} 💜
            </h2>
            <p className="text-sm max-w-sm mb-8 page-enter page-enter-delay-2" style={{ color: "var(--bd-text-muted)" }}>
              I&apos;m Aura, your personal relationship companion. I know your soul
              profile deeply. Talk to me about anything — dates, feelings, patterns,
              or just to process your day.
            </p>

            {/* Quick prompts */}
            <div className="grid grid-cols-2 gap-2 max-w-sm w-full stagger-children">
              {QUICK_PROMPTS.map((q) => (
                <Button
                  key={q.text}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage({ text: q.text })}
                  className="rounded-xl text-xs text-left h-auto py-3 px-3 border-[var(--bd-border)] text-[var(--bd-text-muted)] hover:border-[var(--bd-accent)]/30 hover:text-[var(--bd-text)] bd-card-hover"
                >
                  <span className="mr-1.5">{q.emoji}</span> {q.text}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Conversation className="py-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </Conversation>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t px-4 py-4 bd-glass" style={{ borderColor: "var(--bd-border)" }}>
        <div className="max-w-2xl mx-auto flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Talk to Aura..."
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
    </div>
  );
}
