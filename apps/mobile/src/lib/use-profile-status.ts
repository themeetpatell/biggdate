import type { MeResponse } from '@biggdate/shared';
import { useQuery } from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth-context';

export const PROFILE_STATUS_QUERY_KEY = ['auth', 'me'] as const;

/**
 * Loads the signed-in user's account + profile status from `/api/auth/me`.
 * Drives onboarding gating in the root layout: a session with no profile
 * is routed into the onboarding flow.
 */
export function useProfileStatus() {
  const { session } = useAuth();
  return useQuery({
    queryKey: PROFILE_STATUS_QUERY_KEY,
    enabled: Boolean(session),
    staleTime: 60_000,
    queryFn: () => api.get<MeResponse>('/api/auth/me'),
  });
}
