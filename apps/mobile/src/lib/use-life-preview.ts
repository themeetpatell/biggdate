import type { LifePreview } from '@biggdate/shared';
import { useQuery } from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth-context';

/**
 * Generates (or loads the cached) AI "life together" preview for a match.
 * The endpoint is plan-gated — a 403 surfaces as a query error the screen
 * renders as an upgrade prompt. No retry: generation is expensive and a
 * paywall will not change on retry.
 */
export function useLifePreview(matchId: string) {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['life-preview', matchId],
    enabled: Boolean(session) && Boolean(matchId),
    retry: false,
    queryFn: () => api.post<LifePreview>('/api/life-preview', { matchId }),
  });
}
