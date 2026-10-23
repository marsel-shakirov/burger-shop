import { describe, expect, it } from 'vitest';

import { formatItemsCount } from './format-items-count';

describe('formatItemsCount', () => {
  it.each([
    [1, '1 товар'],
    [2, '2 товара'],
    [5, '5 товаров'],
  ])('%i → «%s»', (count, expected) => {
    expect(formatItemsCount(count)).toBe(expected);
  });
});
