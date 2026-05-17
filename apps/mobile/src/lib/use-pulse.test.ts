import { safeSort } from './use-pulse';

describe('safeSort', () => {
  it('keeps allowed sort values', () => {
    expect(safeSort('hot')).toBe('hot');
    expect(safeSort('new')).toBe('new');
  });

  it('falls back to "hot" for an unknown value sneaking past the type system', () => {
    expect(safeSort('trending' as unknown as 'hot')).toBe('hot');
    expect(safeSort('' as unknown as 'hot')).toBe('hot');
  });
});
