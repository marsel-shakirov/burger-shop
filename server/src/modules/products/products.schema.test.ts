import { describe, expect, it } from 'vitest';

import { getProductsQuerySchema } from './products.schema.ts';

describe('getProductsQuerySchema', () => {
  it('по умолчанию сортирует по рейтингу по убыванию', () => {
    expect(getProductsQuerySchema.parse({})).toEqual({ sort: 'rating', order: 'desc' });
  });

  it('берёт меню, категорию и сортировку из запроса и отбрасывает остальное', () => {
    expect(
      getProductsQuerySchema.parse({
        menu: 'burgers',
        category: 'hot-dogs',
        sort: 'price',
        order: 'asc',
        page: '2',
      }),
    ).toEqual({ menu: 'burgers', category: 'hot-dogs', sort: 'price', order: 'asc' });
  });

  it.each(['burgers', 'hot-dogs', 'combo-2', '42'])('принимает slug %s', (slug) => {
    expect(getProductsQuerySchema.safeParse({ menu: slug, category: slug }).success).toBe(true);
  });

  it.each(['', 'Burgers', 'hot_dogs', 'hot--dogs', '-burgers', 'burgers-', 'хиты'])(
    'не принимает slug «%s»',
    (slug) => {
      expect(getProductsQuerySchema.safeParse({ menu: slug }).success).toBe(false);
      expect(getProductsQuerySchema.safeParse({ category: slug }).success).toBe(false);
    },
  );

  it.each([
    ['неизвестная сортировка', { sort: 'name' }],
    ['неизвестный порядок', { order: 'up' }],
    ['несколько меню', { menu: ['burgers', 'drinks'] }],
  ])('не принимает: %s', (_case, query) => {
    expect(getProductsQuerySchema.safeParse(query).success).toBe(false);
  });
});
