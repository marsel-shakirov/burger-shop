import { describe, expect, it } from 'vitest';

import { formatBonusCount } from './format-bonus-count';

describe('formatBonusCount', () => {
  it.each([
    [1, '1 бонус'],
    [2, '2 бонуса'],
    [5, '5 бонусов'],
  ])('%i → «%s»', (count, expected) => {
    expect(formatBonusCount(count)).toBe(expected);
  });
});
