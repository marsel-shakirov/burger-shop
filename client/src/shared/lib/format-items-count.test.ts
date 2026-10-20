import { describe, expect, it } from 'vitest';

import { formatItemsCount } from './format-items-count';

describe('formatItemsCount', () => {
  it.each([
    [1, '1 товар'],
    [21, '21 товар'],
    [101, '101 товар'],
  ])('%i → «%s»', (count, expected) => {
    expect(formatItemsCount(count)).toBe(expected);
  });

  it.each([
    [2, '2 товара'],
    [3, '3 товара'],
    [4, '4 товара'],
    [22, '22 товара'],
    [104, '104 товара'],
  ])('%i → «%s»', (count, expected) => {
    expect(formatItemsCount(count)).toBe(expected);
  });

  it.each([
    [0, '0 товаров'],
    [5, '5 товаров'],
    [20, '20 товаров'],
    [100, '100 товаров'],
  ])('%i → «%s»', (count, expected) => {
    expect(formatItemsCount(count)).toBe(expected);
  });

  it.each([
    [11, '11 товаров'],
    [12, '12 товаров'],
    [14, '14 товаров'],
    [111, '111 товаров'],
  ])('числа от 11 до 14 в конце склоняются как «много»: %i → «%s»', (count, expected) => {
    expect(formatItemsCount(count)).toBe(expected);
  });
});
