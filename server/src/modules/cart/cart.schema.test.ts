import { describe, expect, it } from 'vitest';

import { CART_MAX_QUANTITY, CART_MERGE_LIMIT } from './cart.constants.ts';
import { mergeCartBodySchema, updateCartItemBodySchema } from './cart.schema.ts';

const items = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ productId: index + 1, quantity: 1 }));

describe('updateCartItemBodySchema', () => {
  it.each([1, CART_MAX_QUANTITY])('принимает количество %i', (quantity) => {
    expect(updateCartItemBodySchema.safeParse({ quantity }).success).toBe(true);
  });

  it.each([
    ['ноль', { quantity: 0 }],
    ['больше максимума', { quantity: CART_MAX_QUANTITY + 1 }],
    ['дробное количество', { quantity: 1.5 }],
    ['строка с числом', { quantity: '1' }],
    ['пустое тело', {}],
    ['лишнее поле', { quantity: 1, productId: 1 }],
  ])('не принимает: %s', (_case, body) => {
    expect(updateCartItemBodySchema.safeParse(body).success).toBe(false);
  });
});

describe('mergeCartBodySchema', () => {
  it.each([0, 1, CART_MERGE_LIMIT])('принимает %i позиций', (count) => {
    expect(mergeCartBodySchema.safeParse({ items: items(count) }).success).toBe(true);
  });

  it('не принимает больше позиций, чем лимит', () => {
    expect(mergeCartBodySchema.safeParse({ items: items(CART_MERGE_LIMIT + 1) }).success).toBe(
      false,
    );
  });

  it.each([
    ['некорректный id товара', { productId: 0, quantity: 1 }],
    ['некорректное количество', { productId: 1, quantity: CART_MAX_QUANTITY + 1 }],
    ['позиция без количества', { productId: 1 }],
    ['лишнее поле в позиции', { productId: 1, quantity: 1, price: 100 }],
  ])('не принимает: %s', (_case, item) => {
    expect(mergeCartBodySchema.safeParse({ items: [item] }).success).toBe(false);
  });

  it.each([
    ['пустое тело', {}],
    ['items не массив', { items: { productId: 1, quantity: 1 } }],
    ['лишнее поле', { items: [], replace: true }],
  ])('не принимает тело: %s', (_case, body) => {
    expect(mergeCartBodySchema.safeParse(body).success).toBe(false);
  });
});
