import { describe, expect, it } from 'vitest';

import { pluralize } from './pluralize';

const forms = ['товар', 'товара', 'товаров'] as const;

describe('pluralize', () => {
  it.each([1, 21, 101])('%i → форма «one»', (count) => {
    expect(pluralize(count, forms)).toBe('товар');
  });

  it.each([2, 3, 4, 22, 104])('%i → форма «few»', (count) => {
    expect(pluralize(count, forms)).toBe('товара');
  });

  it.each([0, 5, 20, 100])('%i → форма «many»', (count) => {
    expect(pluralize(count, forms)).toBe('товаров');
  });

  it.each([11, 12, 14, 111])('числа от 11 до 14 в конце склоняются как «много»: %i', (count) => {
    expect(pluralize(count, forms)).toBe('товаров');
  });

  it.each([1.5, 0.5, 2.25])('дробное %d → форма «few»', (count) => {
    expect(pluralize(count, forms)).toBe('товара');
  });
});
