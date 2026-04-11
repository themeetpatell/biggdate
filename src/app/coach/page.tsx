"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Conversation } from "@/components/ai-elements/conversation";
import { ChatMessage } from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CoachPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/coach/chat",
      body: { profile },
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

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

  if (authLoading || !profile) {
    if (!authLoading && !profile) router.push("/onboarding");
    return null;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="pointer-events-none fixed top-[-15%] right-[-10%] w-[350px] h-[350px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--bd-green)", animation: "orb1 15s ease-in-out infinite" }}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--bd-border)" }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="text-[var(--bd-text-muted)]"
        >
          ← Back
        </Button>
        <div className="text-center">
          <span className="text-sm font-semibold">Relationship Coach</span>
          <div className="text-[10px]" style={{ color: "var(--bd-green)" }}>● Online</div>
        </div>
        <div className="w-16" />
      </header>

      {/* Chat */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="text-4xl mb-4" style={{ animation: "float 3s ease-in-out infinite" }}>
              💬
            </div>
            <h2 className="text-xl font-bold mb-2">Your AI Coach</h2>
            <p className="text-sm max-w-md mb-6" style={{ color: "var(--bd-text-muted)" }}>
              I know your soul profile deeply. Ask me anything about your
              relationship patterns, dating challenges, or growth journey.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Why do I keep attracting the same type?",
                "How can I be more vulnerable on dates?",
                "What should I work on this week?",
              ].map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage({ text: q })}
                  className="rounded-full text-xs border-[var(--bd-border)] text-[var(--bd-text-muted)]"
                >
                  {q}
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
      <div className="sticky bottom-0 border-t px-4 py-4" style={{ borderColor: "var(--bd-border)", background: "var(--bd-bg)" }}>
        <div className="max-w-2xl mx-auto flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything..."
            className="flex-1 min-h-[44px] max-h-32 resize-none bg-[var(--bd-surface)] border-[var(--bd-border)] text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] rounded-xl"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="bg-[var(--bd-green)] text-black font-semibold rounded-xl px-5 disabled:opacity-40"
          >
            {isStreaming ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
