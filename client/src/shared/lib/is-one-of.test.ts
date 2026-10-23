import { describe, expect, it } from 'vitest';

import { isOneOf } from './is-one-of';

const SORT_FIELDS = ['price', 'popularity', 'rating'] as const;

describe('isOneOf', () => {
  it('возвращает true для значения из списка', () => {
    expect(isOneOf(SORT_FIELDS, 'price')).toBe(true);
    expect(isOneOf(SORT_FIELDS, 'rating')).toBe(true);
  });

  it('возвращает false для строки не из списка', () => {
    expect(isOneOf(SORT_FIELDS, 'name')).toBe(false);
  });

  it('учитывает регистр и пробелы', () => {
    expect(isOneOf(SORT_FIELDS, 'Price')).toBe(false);
    expect(isOneOf(SORT_FIELDS, ' price')).toBe(false);
  });

  it('возвращает false для пустой строки', () => {
    expect(isOneOf(SORT_FIELDS, '')).toBe(false);
  });

  it.each([null, undefined, 0, true, {}, ['price']])('возвращает false для %o', (value) => {
    expect(isOneOf(SORT_FIELDS, value)).toBe(false);
  });

  it('возвращает false для пустого списка', () => {
    expect(isOneOf([], 'price')).toBe(false);
  });

  it('сужает тип значения', () => {
    expect.assertions(1);
    const value: unknown = 'popularity';

    if (isOneOf(SORT_FIELDS, value)) {
      const field: (typeof SORT_FIELDS)[number] = value;

      expect(field).toBe('popularity');
    }
  });
});
