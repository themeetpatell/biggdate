import { supabase } from './supabase';

/**
 * Subscribe to new messages inserted into a thread. Supabase RLS ensures
 * only messages the signed-in user may see are delivered. `onInsert` runs
 * for each new row — callers typically refetch the thread. Returns a
 * cleanup function that removes the channel.
 */
export function subscribeToThreadMessages(
  threadId: string,
  onInsert: () => void,
): () => void {
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
      () => onInsert(),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
