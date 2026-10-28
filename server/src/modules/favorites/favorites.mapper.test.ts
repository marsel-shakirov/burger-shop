import { describe, expect, it } from 'vitest';

import { toFavoritesResponse } from './favorites.mapper.ts';

describe('toFavoritesResponse', () => {
  it('собирает id товаров с сохранением порядка', () => {
    expect(toFavoritesResponse([{ product_id: 7 }, { product_id: 2 }])).toEqual({
      productIds: [7, 2],
    });
  });

  it('возвращает пустой список без строк', () => {
    expect(toFavoritesResponse([])).toEqual({ productIds: [] });
  });
});
