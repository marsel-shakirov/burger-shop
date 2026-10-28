import { describe, expect, it } from 'vitest';

import { FAVORITES_MERGE_LIMIT } from './favorites.constants.ts';
import { mergeFavoritesBodySchema } from './favorites.schema.ts';

const productIds = (count: number) => Array.from({ length: count }, (_, index) => index + 1);

describe('mergeFavoritesBodySchema', () => {
  it.each([0, 1, FAVORITES_MERGE_LIMIT])('принимает %i товаров', (count) => {
    expect(mergeFavoritesBodySchema.safeParse({ productIds: productIds(count) }).success).toBe(
      true,
    );
  });

  it('не принимает больше товаров, чем лимит', () => {
    expect(
      mergeFavoritesBodySchema.safeParse({ productIds: productIds(FAVORITES_MERGE_LIMIT + 1) })
        .success,
    ).toBe(false);
  });

  it.each([
    ['некорректный id товара', { productIds: [1, 0] }],
    ['строка вместо id', { productIds: ['1'] }],
    ['пустое тело', {}],
    ['лишнее поле', { productIds: [], replace: true }],
  ])('не принимает: %s', (_case, body) => {
    expect(mergeFavoritesBodySchema.safeParse(body).success).toBe(false);
  });
});
