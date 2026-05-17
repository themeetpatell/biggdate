import { assertUuid, isUuid } from './uuid';

describe('isUuid', () => {
  it.each([
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
  ])('accepts canonical UUID %s', (value) => {
    expect(isUuid(value)).toBe(true);
  });

  it.each([
    '',
    'not-a-uuid',
    '12345',
    'a1b2c3d4-e5f6-7890-abcd-ef123456789', // 11 chars in last group
    'a1b2c3d4-e5f6-7890-abcd-ef12345678901', // 13 chars
    "abc'; drop table users; --",
    '00000000-0000-0000-0000-000000000000=eq.foo',
  ])('rejects malformed value %s', (value) => {
    expect(isUuid(value)).toBe(false);
  });
});

describe('assertUuid', () => {
  it('throws with the supplied label for a malformed id', () => {
    expect(() => assertUuid('nope', 'threadId')).toThrow(/threadId/);
  });

  it('does not throw for a valid uuid', () => {
    expect(() => assertUuid('00000000-0000-0000-0000-000000000000', 'x')).not.toThrow();
  });
});
