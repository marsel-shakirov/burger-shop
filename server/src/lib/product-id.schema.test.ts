import { describe, expect, it } from 'vitest';

import { productIdParamsSchema, productIdSchema } from './product-id.schema.ts';

describe('productIdSchema', () => {
  it.each([1, 42, 2_147_483_647])('принимает %s', (value) => {
    expect(productIdSchema.safeParse(value).success).toBe(true);
  });

  it.each([
    ['ноль', 0],
    ['отрицательное число', -1],
    ['дробное число', 1.5],
    ['больше int32', 2_147_483_648],
    ['NaN', NaN],
    ['строка с числом', '1'],
    ['null', null],
  ])('не принимает: %s', (_case, value) => {
    expect(productIdSchema.safeParse(value).success).toBe(false);
  });
});

describe('productIdParamsSchema', () => {
  it('превращает строку из параметров маршрута в число', () => {
    expect(productIdParamsSchema.parse({ productId: '42' })).toEqual({ productId: 42 });
  });

  it.each([
    ['пустая строка', ''],
    ['ноль', '0'],
    ['отрицательное число', '-1'],
    ['дробное число', '1.5'],
    ['экспонента', '1e3'],
    ['пробел перед числом', ' 1'],
    ['буквы', 'abc'],
    ['больше int32', '2147483648'],
  ])('не принимает: %s', (_case, productId) => {
    expect(productIdParamsSchema.safeParse({ productId }).success).toBe(false);
  });

  it('не принимает параметры без productId', () => {
    expect(productIdParamsSchema.safeParse({}).success).toBe(false);
  });
});
