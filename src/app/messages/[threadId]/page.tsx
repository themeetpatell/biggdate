"use client";

import { use, useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { trackMessageSent } from "@/lib/gtm";
import type { Thread, Message } from "@/lib/types";

export default function ChatPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params);
  const router = useRouter();
  const { profile, userId: myId, loading: authLoading } = useAuth();

  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMessages = useCallback(async (initial = false) => {
    try {
      const res = await fetch(`/api/messages/${threadId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (initial) setThread(data.thread);
      setMessages(data.messages ?? []);
    } finally {
      if (initial) setPageLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.push("/onboarding"); return; }

    loadMessages(true);

    // Poll every 30s
    pollingRef.current = setInterval(() => loadMessages(false), 30000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [profile, authLoading, router, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!body.trim() || sending) return;
    const text = body.trim();
    setBody("");

    // Optimistic append
    const optimistic: Message = {
      id: `opt_${Date.now()}`,
      threadId,
      senderId: myId ?? "me",
      body: text,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    setSending(true);
    try {
      const res = await fetch(`/api/messages/${threadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      if (res.ok) {
        const msg = await res.json();
        trackMessageSent(threadId);
        setMessages((prev) =>
          prev.map((m) => (m.id === optimistic.id ? msg : m)),
        );
      } else {
        // Remove optimistic on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        setBody(text);
      }
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (authLoading || !profile) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100svh", background: "#0A0A0F" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "env(safe-area-inset-top, 16px) 16px 14px",
        paddingTop: `calc(env(safe-area-inset-top, 0px) + 16px)`,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
      }}>
        <button onClick={() => router.push("/messages")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 20, padding: "0 4px 0 0", lineHeight: 1 }}>
          ←
        </button>

        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: thread?.otherUserPhoto
            ? `url(${thread.otherUserPhoto}) center/cover`
            : "linear-gradient(135deg, rgba(212,104,138,0.3), rgba(168,85,247,0.3))",
          border: "1.5px solid rgba(255,255,255,0.1)",
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {thread?.otherUserName ?? "…"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {pageLoading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid rgba(168,85,247,0.3)", borderTopColor: "#a855f7", animation: "spin 1s linear infinite" }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <p style={{ fontSize: 28, margin: "0 0 12px" }}>👋</p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
              You&apos;re connected. Say something real.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMine = myId ? msg.senderId === myId : msg.senderId === "me";
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 8 }}>
                  <div style={{
                    maxWidth: "72%",
                    background: isMine
                      ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                      : "rgba(255,255,255,0.07)",
                    borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "10px 14px",
                  }}>
                    <p style={{ fontSize: 15, color: "#fff", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
                      {msg.body}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: `12px 12px calc(12px + env(safe-area-inset-bottom, 0px))`,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,15,0.98)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        flexShrink: 0,
      }}>
        <textarea
          ref={inputRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Say something…"
          rows={1}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "10px 16px",
            fontSize: 15,
            color: "#fff",
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: 1.5,
            maxHeight: 120,
            overflowY: "auto",
          }}
        />
        <button
          onClick={send}
          disabled={!body.trim() || sending}
          style={{
            width: 42, height: 42,
            borderRadius: "50%",
            background: body.trim() ? "#a855f7" : "rgba(168,85,247,0.2)",
            border: "none",
            cursor: body.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.2s",
            fontSize: 18,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
