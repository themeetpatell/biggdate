import type {
  PulseFeedResponse,
  PulsePostType,
  PulsePromptsResponse,
  PulseSort,
} from '@biggdate/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth-context';
import { queryClient } from './query-client';

export const PULSE_FEED_QUERY_KEY = ['pulse', 'feed'] as const;

/** Loads the Pulse community feed from `GET /api/pulse/posts`. */
export function usePulseFeed(sort: PulseSort = 'hot') {
  const { session } = useAuth();
  return useQuery({
    queryKey: [...PULSE_FEED_QUERY_KEY, sort],
    enabled: Boolean(session),
    queryFn: () => api.get<PulseFeedResponse>(`/api/pulse/posts?sort=${sort}`),
  });
}

/** Loads today's Pulse prompt from `GET /api/pulse/prompts/today`. */
export function useTodayPrompt() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['pulse', 'prompt-today'],
    enabled: Boolean(session),
    queryFn: () => api.get<PulsePromptsResponse>('/api/pulse/prompts/today'),
  });
}

export interface CreatePulsePostInput {
  type: PulsePostType;
  promptId?: string;
  content: string;
}

/** Creates a Pulse post via `POST /api/pulse/posts`. */
export function useCreatePulsePost() {
  return useMutation({
    mutationFn: (input: CreatePulsePostInput) =>
      api.post<{ id: string }>('/api/pulse/posts', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PULSE_FEED_QUERY_KEY });
    },
  });
}

/** Toggles a heart on a post via `POST /api/pulse/posts/:id/react`. */
export function useReactToPost() {
  return useMutation({
    mutationFn: (postId: string) =>
      api.post<{ resonated: boolean }>(`/api/pulse/posts/${postId}/react`, {}),
  });
}
