import type { Intro } from '@biggdate/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

import { api } from './api';
import { useAuth } from './auth-context';
import { MATCHES_QUERY_KEY } from './use-matches';
import { queryClient } from './query-client';

export const SENT_INTROS_QUERY_KEY = ['intros', 'sent'] as const;

/** Loads the Soul Knocks the user has sent, from `GET /api/intros`. */
export function useSentIntros() {
  const { session } = useAuth();
  return useQuery({
    queryKey: SENT_INTROS_QUERY_KEY,
    enabled: Boolean(session),
    queryFn: () => api.get<Intro[]>('/api/intros'),
  });
}

export interface SoulKnockInput {
  matchId: string;
  matchName: string;
  matchedUserId?: string;
  soulKnockQuestion?: string;
}

/** Sends a Soul Knock via `POST /api/intros/request`. */
export function useSendSoulKnock() {
  return useMutation({
    mutationFn: (input: SoulKnockInput) =>
      api.post<Intro & { alreadySent?: boolean }>('/api/intros/request', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SENT_INTROS_QUERY_KEY });
    },
  });
}

export interface PassInput {
  matchId: string;
  matchName: string;
  reason?: string;
}

/** Passes on a match via `POST /api/intros/pass`. */
export function usePassMatch() {
  return useMutation({
    mutationFn: (input: PassInput) =>
      api.post<{ ok: boolean }>('/api/intros/pass', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEY });
    },
  });
}
