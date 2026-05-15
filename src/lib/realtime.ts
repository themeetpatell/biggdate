import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "./supabase-browser";

const supabase = typeof window !== "undefined" ? createSupabaseBrowserClient() : null;

type MessageRow = {
  id: string;
  thread_id: string;
  sender_id: string;
  kind?: "text" | "voice";
  body?: string | null;
  audio_url?: string | null;
  audio_duration_sec?: number | null;
  audio_mime_type?: string | null;
  created_at: string;
  read_at?: string | null;
};

type MessageInsertPayload = RealtimePostgresInsertPayload<MessageRow>;

/**
 * Subscribe to real-time inserts on the `messages` table for the current user.
 * RLS ensures only messages in the user's threads are delivered.
 * Calls `onMessage` with the Supabase RealtimePostgresChangesPayload for each new row.
 * Returns a cleanup function.
 */
export function subscribeToUserMessages(
  _userId: string,
  onMessage: (payload: MessageInsertPayload) => void
) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel("user-messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      onMessage
    )
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
}

/**
 * Subscribe to real-time inserts on the `messages` table for a specific thread.
 * More targeted than subscribeToUserMessages — use this inside a thread chat view.
 * Returns a cleanup function.
 */
export function subscribeToThreadMessages(
  threadId: string,
  onMessage: (payload: MessageInsertPayload) => void
) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`thread-messages:${threadId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `thread_id=eq.${threadId}`,
      },
      onMessage
    )
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
}
