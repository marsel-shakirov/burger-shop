import { describe, expect, it } from 'vitest';

import { toCartResponse } from './cart.mapper.ts';

describe('toCartResponse', () => {
  it('переводит строки корзины в позиции с сохранением порядка', () => {
    expect(
      toCartResponse([
        { product_id: 3, quantity: 2 },
        { product_id: 1, quantity: 5 },
      ]),
    ).toEqual({
      items: [
        { productId: 3, quantity: 2 },
        { productId: 1, quantity: 5 },
      ],
    });
  });

  it('возвращает пустую корзину без строк', () => {
    expect(toCartResponse([])).toEqual({ items: [] });
  });
});
