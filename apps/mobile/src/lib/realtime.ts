import type { Message } from '@biggdate/shared';

import { supabase } from './supabase';
import { assertUuid } from './uuid';

/**
 * The shape Supabase realtime delivers for `postgres_changes` row inserts.
 * Typed loosely so callers can decide what fields to trust — RLS is what
 * actually filters the rows.
 */
interface InsertPayload {
  new: Record<string, unknown>;
}

/**
 * Subscribe to new messages inserted into a thread. Supabase RLS ensures
 * only messages the signed-in user may see are delivered. `onInsert`
 * receives the inserted row (best-effort coerced to `Message`) so callers
 * can apply optimistic cache updates instead of refetching. Returns a
 * cleanup function that removes the channel.
 */
export function subscribeToThreadMessages(
  threadId: string,
  onInsert: (message: Message | null) => void,
): () => void {
  assertUuid(threadId, 'threadId');

  const channel = supabase
    .channel(`thread-messages:${threadId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `thread_id=eq.${threadId}`,
      },
      (payload: InsertPayload) => {
        // The realtime row shape mirrors the table; if the caller can't
        // use it, they can still fall back to refetch on `null`.
        const row = payload.new;
        const message =
          row && typeof row.id === 'string' ? (row as unknown as Message) : null;
        onInsert(message);
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
