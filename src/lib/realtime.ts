import { createSupabaseBrowserClient } from "./supabase-browser";

let supabase = typeof window !== "undefined" ? createSupabaseBrowserClient() : null;

/**
 * Subscribe to real-time inserts on the `messages` table for the current user.
 * RLS ensures only messages in the user's threads are delivered.
 * Calls `onMessage` with the Supabase RealtimePostgresChangesPayload for each new row.
 * Returns a cleanup function.
 */
export function subscribeToUserMessages(
  _userId: string,
  onMessage: (payload: any) => void
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
  onMessage: (payload: any) => void
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
