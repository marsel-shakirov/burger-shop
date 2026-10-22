import { describe, expect, it } from 'vitest';

import { formatBonusCount } from './format-bonus-count';

describe('formatBonusCount', () => {
  it.each([
    [1, '1 бонус'],
    [21, '21 бонус'],
    [101, '101 бонус'],
  ])('%i → «%s»', (count, expected) => {
    expect(formatBonusCount(count)).toBe(expected);
  });

  it.each([
    [2, '2 бонуса'],
    [3, '3 бонуса'],
    [4, '4 бонуса'],
    [22, '22 бонуса'],
    [104, '104 бонуса'],
  ])('%i → «%s»', (count, expected) => {
    expect(formatBonusCount(count)).toBe(expected);
  });

  it.each([
    [0, '0 бонусов'],
    [5, '5 бонусов'],
    [20, '20 бонусов'],
    [150, '150 бонусов'],
  ])('%i → «%s»', (count, expected) => {
    expect(formatBonusCount(count)).toBe(expected);
  });

  it.each([
    [11, '11 бонусов'],
    [12, '12 бонусов'],
    [14, '14 бонусов'],
    [111, '111 бонусов'],
  ])('числа от 11 до 14 в конце склоняются как «много»: %i → «%s»', (count, expected) => {
    expect(formatBonusCount(count)).toBe(expected);
  });
});
