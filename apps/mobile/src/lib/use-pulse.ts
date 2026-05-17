import type {
  PulseFeedResponse,
  PulsePostType,
  PulsePromptsResponse,
  PulseSort,
} from '@biggdate/shared';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type UseInfiniteQueryResult,
  type UseMutationResult,
  type UseQueryResult,
  type InfiniteData,
} from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth-context';
import { queryClient } from './query-client';

export const PULSE_FEED_QUERY_KEY = ['pulse', 'feed'] as const;

const ALLOWED_SORTS: readonly PulseSort[] = ['hot', 'new'];

export function safeSort(sort: PulseSort): PulseSort {
  return ALLOWED_SORTS.includes(sort) ? sort : 'hot';
}

/**
 * Loads the Pulse community feed with cursor-based infinite pagination.
 * The backend returns 20 posts per page plus a `nextCursor` that opaquely
 * encodes either the hot-score or `createdAt` of the last row, depending
 * on the sort. Callers should render `data.pages.flatMap((p) => p.posts)`.
 */
export function usePulseFeed(
  sort: PulseSort = 'hot',
): UseInfiniteQueryResult<InfiniteData<PulseFeedResponse, string | null>, Error> {
  const { session } = useAuth();
  const validSort = safeSort(sort);
  return useInfiniteQuery<
    PulseFeedResponse,
    Error,
    InfiniteData<PulseFeedResponse, string | null>,
    readonly [...typeof PULSE_FEED_QUERY_KEY, PulseSort],
    string | null
  >({
    queryKey: [...PULSE_FEED_QUERY_KEY, validSort],
    enabled: Boolean(session),
    initialPageParam: null,
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({ sort: validSort });
      if (pageParam) params.set('cursor', pageParam);
      return api.get<PulseFeedResponse>(`/api/pulse/posts?${params.toString()}`);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

/** Loads today's Pulse prompt from `GET /api/pulse/prompts/today`. */
export function useTodayPrompt(): UseQueryResult<PulsePromptsResponse> {
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
export function useCreatePulsePost(): UseMutationResult<
  { id: string },
  Error,
  CreatePulsePostInput
> {
  return useMutation<{ id: string }, Error, CreatePulsePostInput>({
    mutationFn: (input) => api.post<{ id: string }>('/api/pulse/posts', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PULSE_FEED_QUERY_KEY });
    },
  });
}

/** Toggles a heart on a post via `POST /api/pulse/posts/:id/react`. */
export function useReactToPost(): UseMutationResult<
  { resonated: boolean },
  Error,
  string
> {
  return useMutation<{ resonated: boolean }, Error, string>({
    mutationFn: (postId) =>
      api.post<{ resonated: boolean }>(`/api/pulse/posts/${postId}/react`, {}),
  });
}
