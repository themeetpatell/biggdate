"use client";

import { use, useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoadingScreen } from "@/components/loading-screen";
import { DateProposalCard } from "@/components/date-proposal-card";
import { trackMessageSent } from "@/lib/gtm";
import { subscribeToThreadMessages } from "@/lib/realtime";
import type { Thread, Message } from "@/lib/types";

// Voice notes are capped at 60 seconds. Hard limit at the recorder level so a
// pocket-dialed mic never produces a 20-minute upload and so abuse vectors
// (long, hostile rants) have a structural ceiling. Matches Hinge's cap.
const MAX_VOICE_DURATION_SEC = 60;

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "9px 12px",
  fontSize: 14,
  color: "#fff",
  outline: "none",
  fontFamily: "inherit",
};

function formatDuration(totalSec: number | null | undefined) {
  if (!totalSec || totalSec < 1) return "0:00";
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ChatPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params);
  const router = useRouter();
  const { profile, userId: myId, loading: authLoading } = useAuth();

  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [recordingSupported, setRecordingSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTimeSec, setRecordingTimeSec] = useState(0);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voicePreviewUrl, setVoicePreviewUrl] = useState<string | null>(null);
  const [voiceMimeType, setVoiceMimeType] = useState<string | null>(null);
  const [voiceDurationSec, setVoiceDurationSec] = useState<number | null>(null);
  const [composerError, setComposerError] = useState<string | null>(null);
  // Moderation soft-block. When set, the next send includes acceptModerationWarning=true
  // so the server lets the message through. Hard verdicts (harassment, self_harm)
  // surface here too but the server refuses them regardless — `soft: false`
  // means the UI shows the coaching with no override button.
  const [moderationBlock, setModerationBlock] = useState<{
    coaching: string;
    verdict: string;
    soft: boolean;
    text: string;
  } | null>(null);
  // Date proposal composer — inline form above the chat textarea.
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalDate, setProposalDate] = useState("");
  const [proposalVenue, setProposalVenue] = useState("");
  const [proposalNotes, setProposalNotes] = useState("");
  const [proposalSending, setProposalSending] = useState(false);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

    const unsubscribe = subscribeToThreadMessages(threadId, (payload) => {
      const row = payload.new;
      // Skip messages sent by the current user — already handled by optimistic UI
      if (row.sender_id === myId) return;
      const incoming: Message = {
        id: row.id,
        threadId: row.thread_id,
        senderId: row.sender_id,
        kind: row.kind ?? "text",
        body: row.body ?? null,
        audioUrl: row.audio_url ?? null,
        audioDurationSec: row.audio_duration_sec ?? null,
        audioMimeType: row.audio_mime_type ?? null,
        createdAt: row.created_at,
        readAt: row.read_at ?? null,
      };
      setMessages((prev) => {
        if (prev.some((m) => m.id === incoming.id)) return prev;
        return [...prev, incoming];
      });
    });

    return () => unsubscribe();
  }, [profile, authLoading, router, loadMessages, threadId, myId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setRecordingSupported(
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      typeof MediaRecorder !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia,
    );
  }, []);

  const stopActiveStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const clearVoiceDraft = useCallback(() => {
    if (voicePreviewUrl) URL.revokeObjectURL(voicePreviewUrl);
    setVoiceBlob(null);
    setVoicePreviewUrl(null);
    setVoiceMimeType(null);
    setVoiceDurationSec(null);
    setComposerError(null);
  }, [voicePreviewUrl]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      stopActiveStream();
      if (voicePreviewUrl) URL.revokeObjectURL(voicePreviewUrl);
    };
  }, [stopActiveStream, voicePreviewUrl]);

  const sendText = async (opts?: { overrideModeration?: boolean }) => {
    if (sending) return;
    // When overriding a soft-block the user already cleared the textarea; pull
    // the pending text from moderationBlock. Otherwise use the current body.
    const text = (opts?.overrideModeration ? moderationBlock?.text : body.trim()) || "";
    if (!text) return;

    setBody("");
    setComposerError(null);

    const optimistic: Message = {
      id: `opt_${Date.now()}`,
      threadId,
      senderId: myId ?? "me",
      kind: "text",
      body: text,
      audioUrl: null,
      audioDurationSec: null,
      audioMimeType: null,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    setSending(true);
    try {
      const res = await fetch(`/api/messages/${threadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          opts?.overrideModeration
            ? { body: text, acceptModerationWarning: true }
            : { body: text },
        ),
      });
      if (res.ok) {
        const msg = await res.json();
        trackMessageSent(threadId);
        setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? msg : m)));
        setModerationBlock(null);
        return;
      }
      // Failure path. Always drop the optimistic message.
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));

      if (res.status === 422) {
        const data = (await res.json().catch(() => null)) as
          | { code?: string; coaching?: string; verdict?: string; soft?: boolean }
          | null;
        if (data?.code === "moderation_blocked") {
          setModerationBlock({
            coaching: data.coaching || "This message was flagged. Try again with different wording.",
            verdict: data.verdict || "blocked",
            soft: data.soft === true,
            text,
          });
          // Restore the text into the composer only when we'll let them retry.
          setBody(text);
          return;
        }
      }
      // Non-moderation failure — restore the text so they can retry.
      setBody(text);
    } finally {
      setSending(false);
    }
  };

  const sendDateProposal = useCallback(async () => {
    if (proposalSending) return;
    setProposalError(null);
    const venue = proposalVenue.trim();
    const notes = proposalNotes.trim();
    if (!proposalDate) {
      setProposalError("Pick a date and time.");
      return;
    }
    if (!venue) {
      setProposalError("Where are you proposing to meet?");
      return;
    }
    const dt = new Date(proposalDate);
    if (Number.isNaN(dt.getTime()) || dt.getTime() < Date.now() - 5 * 60_000) {
      setProposalError("Date must be in the future.");
      return;
    }
    setProposalSending(true);
    try {
      const res = await fetch(`/api/messages/${threadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "date_proposal",
          meta: { proposedAt: dt.toISOString(), venue, notes: notes || null },
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setProposalError(data?.error || "Couldn't send proposal.");
        return;
      }
      const msg = (await res.json()) as Message;
      setMessages((prev) => [...prev, msg]);
      setProposalOpen(false);
      setProposalDate("");
      setProposalVenue("");
      setProposalNotes("");
    } catch {
      setProposalError("Network error. Try again.");
    } finally {
      setProposalSending(false);
    }
  }, [proposalDate, proposalNotes, proposalSending, proposalVenue, threadId]);

  const sendVoiceNote = useCallback(async () => {
    if (!voiceBlob || !voicePreviewUrl || sending) return;
    setSending(true);
    setComposerError(null);

    const optimistic: Message = {
      id: `opt_voice_${Date.now()}`,
      threadId,
      senderId: myId ?? "me",
      kind: "voice",
      body: null,
      audioUrl: voicePreviewUrl,
      audioDurationSec: voiceDurationSec,
      audioMimeType: voiceMimeType,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    const fileExt = voiceMimeType?.includes("mpeg")
      ? "mp3"
      : voiceMimeType?.includes("ogg")
        ? "ogg"
        : voiceMimeType?.includes("wav")
          ? "wav"
          : voiceMimeType?.includes("mp4") || voiceMimeType?.includes("m4a")
            ? "m4a"
            : "webm";
    const audioFile = new File([voiceBlob], `voice-note.${fileExt}`, {
      type: voiceMimeType ?? voiceBlob.type ?? "audio/webm",
    });
    const formData = new FormData();
    formData.append("audio", audioFile);
    if (voiceDurationSec) formData.append("durationSec", String(voiceDurationSec));

    try {
      const res = await fetch(`/api/messages/${threadId}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const msg = await res.json();
        trackMessageSent(threadId);
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== optimistic.id) return m;
            if (m.audioUrl?.startsWith("blob:")) URL.revokeObjectURL(m.audioUrl);
            return msg;
          }),
        );
        clearVoiceDraft();
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        setComposerError("Voice note failed to send. Try again.");
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setComposerError("Voice note failed to send. Try again.");
    } finally {
      setSending(false);
    }
  }, [clearVoiceDraft, myId, sending, threadId, voiceBlob, voiceDurationSec, voiceMimeType, voicePreviewUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!recordingSupported || recording || sending) return;
    clearVoiceDraft();
    setComposerError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      voiceChunksRef.current = [];
      recordingStartedAtRef.current = Date.now();
      setRecordingTimeSec(0);

      const preferredMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      const supportedMimeType = preferredMimeTypes.find(
        (type) =>
          typeof MediaRecorder !== "undefined" &&
          typeof MediaRecorder.isTypeSupported === "function" &&
          MediaRecorder.isTypeSupported(type),
      );
      const recorder = supportedMimeType
        ? new MediaRecorder(stream, { mimeType: supportedMimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) voiceChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        setRecording(false);
        stopActiveStream();

        const mimeType = recorder.mimeType || voiceChunksRef.current[0]?.type || "audio/webm";
        const blob = new Blob(voiceChunksRef.current, { type: mimeType });
        const durationMs = recordingStartedAtRef.current
          ? Date.now() - recordingStartedAtRef.current
          : 0;
        recordingStartedAtRef.current = null;
        if (blob.size === 0 || durationMs < 500) {
          setComposerError("Voice note was too short. Hold to record a little longer.");
          return;
        }
        const nextUrl = URL.createObjectURL(blob);
        setVoiceBlob(blob);
        setVoicePreviewUrl(nextUrl);
        setVoiceMimeType(mimeType);
        setVoiceDurationSec(Math.max(1, Math.round(durationMs / 1000)));
      };

      recorder.start();
      setRecording(true);
      recordingTimerRef.current = setInterval(() => {
        if (!recordingStartedAtRef.current) return;
        const elapsedSec = Math.max(
          1,
          Math.floor((Date.now() - recordingStartedAtRef.current) / 1000),
        );
        setRecordingTimeSec(elapsedSec);
        // Hard cap. recorder.onstop will fire and clean up the timer.
        if (elapsedSec >= MAX_VOICE_DURATION_SEC && recorder.state === "recording") {
          recorder.stop();
        }
      }, 250);
    } catch {
      stopActiveStream();
      setComposerError("Mic access is blocked. Allow microphone access to send a voice note.");
    }
  }, [clearVoiceDraft, recording, recordingSupported, sending, stopActiveStream]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  if (authLoading || !profile) return <LoadingScreen message="Opening conversation…" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100svh", background: "var(--bd-bg)" }}>
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
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid rgba(168,85,247,0.3)", borderTopColor: "var(--bd-violet)", animation: "spin 1s linear infinite" }} />
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

              // Date-proposal cards render full-width-ish and don't use the
              // chat bubble chrome — they're structured action surfaces, not
              // body copy.
              if (msg.kind === "date_proposal") {
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: isMine ? "flex-end" : "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ maxWidth: "90%" }}>
                      <DateProposalCard
                        message={msg}
                        threadId={threadId}
                        isMine={isMine}
                        onStatusChange={(updated) =>
                          setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
                        }
                      />
                    </div>
                  </div>
                );
              }

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
                    {msg.kind === "voice" && msg.audioUrl ? (
                      <div style={{ display: "grid", gap: 8, minWidth: 220 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                            Voice note
                          </span>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.72)" }}>
                            {formatDuration(msg.audioDurationSec)}
                          </span>
                        </div>
                        <audio
                          controls
                          preload="metadata"
                          src={msg.audioUrl}
                          style={{ width: "100%", height: 36, opacity: 0.92 }}
                        />
                      </div>
                    ) : (
                      <p style={{ fontSize: 15, color: "#fff", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
                        {msg.body}
                      </p>
                    )}
                    {isMine && msg.readAt && (
                      <div
                        style={{
                          marginTop: 4,
                          textAlign: "right",
                          fontSize: 10,
                          color: "rgba(255,255,255,0.7)",
                          letterSpacing: "0.04em",
                        }}
                        aria-label="Read"
                      >
                        ✓✓ Read
                      </div>
                    )}
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
        flexDirection: "column",
        alignItems: "stretch",
        gap: 12,
        flexShrink: 0,
      }}>
        {recording ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 18,
            background: "linear-gradient(135deg, rgba(225,29,72,0.18), rgba(168,85,247,0.18))",
            border: "1px solid rgba(244,114,182,0.28)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--bd-danger)", boxShadow: "0 0 0 6px rgba(251,113,133,0.18)" }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>Recording voice note</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.64)" }}>
                  {formatDuration(recordingTimeSec)} / {formatDuration(MAX_VOICE_DURATION_SEC)}
                </p>
              </div>
            </div>
            <button
              onClick={stopRecording}
              style={{
                border: "none",
                borderRadius: 999,
                background: "#fff",
                color: "#111",
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Stop
            </button>
          </div>
        ) : null}

        {voicePreviewUrl ? (
          <div style={{
            display: "grid",
            gap: 10,
            padding: "12px 14px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>Voice note ready</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.64)" }}>{formatDuration(voiceDurationSec)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={clearVoiceDraft}
                  disabled={sending}
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 999,
                    background: "transparent",
                    color: "rgba(255,255,255,0.75)",
                    padding: "8px 12px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Discard
                </button>
                <button
                  onClick={sendVoiceNote}
                  disabled={sending}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    background: "var(--bd-violet)",
                    color: "#fff",
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </div>
            </div>
            <audio controls preload="metadata" src={voicePreviewUrl} style={{ width: "100%" }} />
          </div>
        ) : null}

        {composerError ? (
          <p style={{ margin: 0, fontSize: 12, color: "var(--bd-danger)" }}>{composerError}</p>
        ) : null}

        {moderationBlock ? (
          <div
            role="alert"
            style={{
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(251,113,133,0.32)",
              background: "rgba(251,113,133,0.08)",
              display: "grid",
              gap: 8,
            }}
          >
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--bd-danger)" }}>
              {moderationBlock.soft ? "Heads up before you send" : "We can’t send this"}
            </p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.78)" }}>
              {moderationBlock.coaching}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              <button
                type="button"
                onClick={() => setModerationBlock(null)}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Revise
              </button>
              {moderationBlock.soft && (
                <button
                  type="button"
                  onClick={() => void sendText({ overrideModeration: true })}
                  disabled={sending}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: "var(--bd-danger)",
                    color: "var(--bd-on-accent)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: sending ? "default" : "pointer",
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  Send anyway
                </button>
              )}
            </div>
          </div>
        ) : null}

        {proposalOpen ? (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(168,85,247,0.28)",
              background: "rgba(168,85,247,0.06)",
              display: "grid",
              gap: 8,
            }}
          >
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--bd-violet)" }}>
              Suggest a date
            </p>
            <input
              type="datetime-local"
              value={proposalDate}
              onChange={(e) => setProposalDate(e.target.value)}
              style={inputStyle}
              aria-label="When"
            />
            <input
              type="text"
              value={proposalVenue}
              onChange={(e) => setProposalVenue(e.target.value)}
              placeholder="Where? (cafe, restaurant, neighborhood)"
              maxLength={200}
              style={inputStyle}
              aria-label="Where"
            />
            <textarea
              value={proposalNotes}
              onChange={(e) => setProposalNotes(e.target.value)}
              placeholder="Notes (optional)"
              maxLength={500}
              rows={2}
              style={{ ...inputStyle, resize: "none" }}
              aria-label="Notes"
            />
            {proposalError ? (
              <p style={{ margin: 0, fontSize: 12, color: "var(--bd-danger)" }}>{proposalError}</p>
            ) : null}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  setProposalOpen(false);
                  setProposalError(null);
                }}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void sendDateProposal()}
                disabled={proposalSending}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: "var(--bd-violet)",
                  color: "var(--bd-on-accent)",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: proposalSending ? "default" : "pointer",
                  opacity: proposalSending ? 0.7 : 1,
                }}
              >
                {proposalSending ? "Sending…" : "Send proposal"}
              </button>
            </div>
          </div>
        ) : null}

        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}>
          <button
            type="button"
            onClick={() => setProposalOpen((o) => !o)}
            disabled={sending || recording || !!voicePreviewUrl}
            title="Suggest a date"
            aria-label="Suggest a date"
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: proposalOpen ? "var(--bd-violet)" : "rgba(255,255,255,0.08)",
              color: proposalOpen ? "var(--bd-on-accent)" : "rgba(255,255,255,0.78)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: sending || recording || !!voicePreviewUrl ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 18,
            }}
          >
            📅
          </button>
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={!recordingSupported || sending || !!voicePreviewUrl}
            title={recordingSupported ? "Record voice note" : "Voice notes need microphone support"}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: recording
                ? "var(--bd-danger)"
                : recordingSupported && !voicePreviewUrl
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              cursor: recordingSupported && !voicePreviewUrl ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 18,
            }}
          >
            {recording ? "■" : "🎙"}
          </button>
          <textarea
            ref={inputRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKey}
            placeholder={voicePreviewUrl ? "Send your voice note or discard it…" : "Say something…"}
            rows={1}
            disabled={recording || !!voicePreviewUrl}
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
              opacity: recording || voicePreviewUrl ? 0.55 : 1,
            }}
          />
          <button
            onClick={() => void sendText()}
            disabled={!body.trim() || sending || recording || !!voicePreviewUrl}
            style={{
              width: 42, height: 42,
              borderRadius: "50%",
              background: body.trim() && !recording && !voicePreviewUrl ? "var(--bd-violet)" : "rgba(168,85,247,0.2)",
              border: "none",
              cursor: body.trim() && !recording && !voicePreviewUrl ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
              fontSize: 18,
              color: "#fff",
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
