import { describe, expect, it } from 'vitest';

import { formatPrice } from './format-price';

describe('formatPrice', () => {
  it('добавляет знак рубля через неразрывный пробел', () => {
    expect(formatPrice(350)).toBe('350 ₽');
  });

  it('разделяет разряды неразрывными пробелами', () => {
    expect(formatPrice(1250)).toBe('1 250 ₽');
    expect(formatPrice(1_000_000)).toBe('1 000 000 ₽');
  });

  it('форматирует ноль', () => {
    expect(formatPrice(0)).toBe('0 ₽');
  });

  it('округляет до целых рублей', () => {
    expect(formatPrice(99.6)).toBe('100 ₽');
    expect(formatPrice(99.4)).toBe('99 ₽');
  });
});
