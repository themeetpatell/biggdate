import type { Profile, ProfileResponse } from '@biggdate/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth-context';
import { queryClient } from './query-client';
import { PROFILE_STATUS_QUERY_KEY } from './use-profile-status';

export const PROFILE_QUERY_KEY = ['profile'] as const;

/** Loads the signed-in user's full profile from `GET /api/profile`. */
export function useProfile() {
  const { session } = useAuth();
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    enabled: Boolean(session),
    queryFn: () => api.get<ProfileResponse>('/api/profile'),
  });
}

/** Patches the profile via `PATCH /api/profile` and refreshes cached reads. */
export function useUpdateProfile() {
  return useMutation({
    mutationFn: (patch: Partial<Profile>) =>
      api.patch<ProfileResponse>('/api/profile', patch),
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
      void queryClient.invalidateQueries({ queryKey: PROFILE_STATUS_QUERY_KEY });
    },
  });
}
