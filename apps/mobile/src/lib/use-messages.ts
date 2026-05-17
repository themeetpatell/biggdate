import type { Message, ThreadDetailResponse, ThreadsResponse } from '@biggdate/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth-context';
import { queryClient } from './query-client';

export const THREADS_QUERY_KEY = ['threads'] as const;

export function threadQueryKey(threadId: string) {
  return ['thread', threadId] as const;
}

/** Loads the user's conversation threads from `GET /api/messages`. */
export function useThreads() {
  const { session } = useAuth();
  return useQuery({
    queryKey: THREADS_QUERY_KEY,
    enabled: Boolean(session),
    queryFn: () => api.get<ThreadsResponse>('/api/messages'),
  });
}

/** Loads one thread and its messages from `GET /api/messages/:threadId`. */
export function useThread(threadId: string) {
  const { session } = useAuth();
  return useQuery({
    queryKey: threadQueryKey(threadId),
    enabled: Boolean(session) && Boolean(threadId),
    queryFn: () => api.get<ThreadDetailResponse>(`/api/messages/${threadId}`),
  });
}

/** Sends a text message via `POST /api/messages/:threadId`. */
export function useSendMessage(threadId: string) {
  return useMutation({
    mutationFn: (body: string) =>
      api.post<Message>(`/api/messages/${threadId}`, { body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: threadQueryKey(threadId) });
      void queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY });
    },
  });
}
