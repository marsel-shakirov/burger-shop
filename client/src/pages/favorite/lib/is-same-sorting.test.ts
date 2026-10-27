import { describe, expect, it } from 'vitest';

import { isSameSorting } from './is-same-sorting';

describe('isSameSorting', () => {
  it('возвращает true для одинаковых sort и order', () => {
    expect(isSameSorting({ sort: 'price', order: 'asc' }, { sort: 'price', order: 'asc' })).toBe(
      true,
    );
  });

  it('возвращает false, если отличается sort', () => {
    expect(isSameSorting({ sort: 'price', order: 'desc' }, { sort: 'rating', order: 'desc' })).toBe(
      false,
    );
  });

  it('возвращает false, если отличается order', () => {
    expect(isSameSorting({ sort: 'price', order: 'asc' }, { sort: 'price', order: 'desc' })).toBe(
      false,
    );
  });

  it('сравнивает только sort и order, игнорируя остальные поля', () => {
    const option = { sort: 'price', order: 'asc', label: 'Сначала дешёвые' } as const;

    expect(isSameSorting(option, { sort: 'price', order: 'asc' })).toBe(true);
  });
});
