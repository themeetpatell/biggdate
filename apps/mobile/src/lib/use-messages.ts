import type { Message, ThreadDetailResponse, ThreadsResponse } from '@biggdate/shared';
import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth-context';
import { queryClient } from './query-client';

export const THREADS_QUERY_KEY = ['threads'] as const;

export function threadQueryKey(threadId: string): readonly ['thread', string] {
  return ['thread', threadId] as const;
}

/** Loads the user's conversation threads from `GET /api/messages`. */
export function useThreads(): UseQueryResult<ThreadsResponse> {
  const { session } = useAuth();
  return useQuery({
    queryKey: THREADS_QUERY_KEY,
    enabled: Boolean(session),
    queryFn: () => api.get<ThreadsResponse>('/api/messages'),
  });
}

/** Loads one thread and its messages from `GET /api/messages/:threadId`. */
export function useThread(threadId: string): UseQueryResult<ThreadDetailResponse> {
  const { session } = useAuth();
  return useQuery({
    queryKey: threadQueryKey(threadId),
    enabled: Boolean(session) && Boolean(threadId),
    queryFn: () => api.get<ThreadDetailResponse>(`/api/messages/${threadId}`),
  });
}

/**
 * Sends a text message via `POST /api/messages/:threadId`.
 *
 * The thread detail is the source of truth for the open conversation; the
 * threads-list snippet (last message + unread count) is only stale if this
 * is the first message in the thread. The cached thread data exposes that:
 * an empty `messages` array means this send is the first one, so we
 * invalidate the threads list. Otherwise we skip it.
 */
export function useSendMessage(
  threadId: string,
): UseMutationResult<Message, Error, string> {
  return useMutation<Message, Error, string>({
    mutationFn: (body: string) =>
      api.post<Message>(`/api/messages/${threadId}`, { body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: threadQueryKey(threadId) });
      const cached = queryClient.getQueryData<ThreadDetailResponse>(
        threadQueryKey(threadId),
      );
      const isFirstMessage = !cached || cached.messages.length === 0;
      if (isFirstMessage) {
        void queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY });
      }
    },
  });
}
