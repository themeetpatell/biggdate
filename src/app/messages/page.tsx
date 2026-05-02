"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import type { Thread } from "@/lib/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MessagesPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.push("/onboarding"); return; }

    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => setThreads(d.threads ?? []))
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, [profile, authLoading, router]);

  if (authLoading || !profile) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", paddingBottom: "calc(90px + env(safe-area-inset-bottom, 0px))" }}>
      {/* Header */}
      <div style={{ padding: "56px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>Messages</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: "4px 0 0" }}>
          Opened after mutual Soul Knocks
        </p>
      </div>

      <div style={{ maxWidth: "var(--bd-app-max-w)", margin: "0 auto" }}>
        {pageLoading ? (
          <div style={{ padding: "20px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: 72, borderRadius: 14, background: "rgba(255,255,255,0.03)", marginBottom: 8 }} />
            ))}
          </div>
        ) : threads.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 32px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💌</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>No chats yet</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>
              Send a Soul Knock to someone you&apos;re drawn to. Once you both answer, the chat opens here.
            </p>
            <button
              onClick={() => router.push("/matches")}
              style={{ marginTop: 24, background: "#a855f7", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              See My Matches
            </button>
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => router.push(`/messages/${thread.id}`)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: thread.otherUserPhoto
                    ? `url(${thread.otherUserPhoto}) center/cover`
                    : "linear-gradient(135deg, rgba(212,104,138,0.3), rgba(168,85,247,0.3))",
                  border: "1.5px solid rgba(255,255,255,0.08)",
                  flexShrink: 0,
                  position: "relative",
                }}>
                  {(thread.unreadCount ?? 0) > 0 && (
                    <div style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#a855f7",
                      border: "2px solid #0A0A0F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#fff",
                    }}>
                      {thread.unreadCount}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <p style={{
                      fontSize: 15,
                      fontWeight: (thread.unreadCount ?? 0) > 0 ? 700 : 600,
                      color: "#fff",
                      margin: 0,
                    }}>
                      {thread.otherUserName}
                    </p>
                    {thread.lastMessageAt && (
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                        {timeAgo(thread.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: 13,
                    color: (thread.unreadCount ?? 0) > 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {thread.lastMessage ?? "Chat opened — say hello"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
