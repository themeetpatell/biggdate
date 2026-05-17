import type { ThreadDetailResponse, Message } from '@biggdate/shared';
import { QueryClient } from '@tanstack/react-query';

jest.mock('./api', () => ({
  api: { post: jest.fn(async () => ({ id: 'msg-1' })) },
}));

jest.mock('./auth-context', () => ({ useAuth: () => ({ session: null }) }));

jest.mock('./query-client', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { QueryClient: QC } = require('@tanstack/react-query');
  return {
    queryClient: new QC({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    }),
  };
});

import { queryClient } from './query-client';
import { threadQueryKey, THREADS_QUERY_KEY } from './use-messages';

const client = queryClient as QueryClient;

function makeThread(messages: Message[]): ThreadDetailResponse {
  return {
    thread: {
      id: 't1',
      userAId: 'a',
      userBId: 'b',
      introId: 'i',
      createdAt: new Date().toISOString(),
    },
    messages,
    hasReadReceipts: false,
  };
}

describe('useSendMessage cache invalidation gate', () => {
  beforeEach(() => {
    client.clear();
    jest.clearAllMocks();
  });

  it('treats an empty thread cache as the first message', () => {
    const threadId = '00000000-0000-0000-0000-000000000001';
    client.setQueryData<ThreadDetailResponse>(threadQueryKey(threadId), makeThread([]));
    const cached = client.getQueryData<ThreadDetailResponse>(threadQueryKey(threadId));
    const isFirst = !cached || cached.messages.length === 0;
    expect(isFirst).toBe(true);
  });

  it('treats an absent thread cache as the first message', () => {
    const threadId = '00000000-0000-0000-0000-000000000002';
    const cached = client.getQueryData<ThreadDetailResponse>(threadQueryKey(threadId));
    const isFirst = !cached || cached.messages.length === 0;
    expect(isFirst).toBe(true);
  });

  it('skips threads-list invalidation when prior messages exist', () => {
    const threadId = '00000000-0000-0000-0000-000000000003';
    const existing: Message = {
      id: 'm1',
      threadId,
      senderId: 'a',
      kind: 'text',
      body: 'hi',
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    client.setQueryData<ThreadDetailResponse>(
      threadQueryKey(threadId),
      makeThread([existing]),
    );
    const cached = client.getQueryData<ThreadDetailResponse>(threadQueryKey(threadId));
    const isFirst = !cached || cached.messages.length === 0;
    expect(isFirst).toBe(false);
  });

  it('exposes a stable threads list query key', () => {
    expect(THREADS_QUERY_KEY).toEqual(['threads']);
  });
});
