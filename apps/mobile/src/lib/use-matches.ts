import type { Match } from '@biggdate/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth-context';
import { queryClient } from './query-client';

export const MATCHES_QUERY_KEY = ['matches'] as const;

/** Loads today's curated matches from `GET /api/matches`. */
export function useMatches() {
  const { session } = useAuth();
  return useQuery({
    queryKey: MATCHES_QUERY_KEY,
    enabled: Boolean(session),
    queryFn: () => api.get<Match[]>('/api/matches'),
  });
}

/** Generates a fresh set of matches via `POST /api/matches/generate`. */
export function useGenerateMatches() {
  return useMutation({
    mutationFn: () => api.post<{ matches: Match[] }>('/api/matches/generate'),
    onSuccess: (data) => {
      queryClient.setQueryData(MATCHES_QUERY_KEY, data.matches);
    },
  });
}
