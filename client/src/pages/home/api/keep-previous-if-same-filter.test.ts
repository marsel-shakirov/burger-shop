import { describe, expect, it } from 'vitest';

import type { Product, ProductsQueryParams } from '@/entities/product';

import { keepPreviousIfSameFilter } from './keep-previous-if-same-filter';

const previousData: Product[] = [];

const createQuery = (params: Partial<ProductsQueryParams>) => ({
  queryKey: [
    'products',
    { sorting: { sort: 'rating', order: 'desc' }, ...params } satisfies ProductsQueryParams,
  ],
});

describe('keepPreviousIfSameFilter', () => {
  it('оставляет прошлые данные при смене только сортировки', () => {
    const placeholder = keepPreviousIfSameFilter({ menu: 'burgers', category: 'beef' });
    const previousQuery = createQuery({
      menu: 'burgers',
      category: 'beef',
      sorting: { sort: 'price', order: 'asc' },
    });

    expect(placeholder(previousData, previousQuery)).toBe(previousData);
  });

  it('оставляет прошлые данные, если категория не выбрана ни там, ни там', () => {
    const placeholder = keepPreviousIfSameFilter({ menu: 'burgers' });

    expect(placeholder(previousData, createQuery({ menu: 'burgers' }))).toBe(previousData);
  });

  it('сбрасывает данные при смене меню', () => {
    const placeholder = keepPreviousIfSameFilter({ menu: 'drinks' });

    expect(placeholder(previousData, createQuery({ menu: 'burgers' }))).toBeUndefined();
  });

  it('сбрасывает данные при смене категории', () => {
    const placeholder = keepPreviousIfSameFilter({ menu: 'burgers', category: 'chicken' });

    expect(
      placeholder(previousData, createQuery({ menu: 'burgers', category: 'beef' })),
    ).toBeUndefined();
  });

  it('сбрасывает данные при выборе категории после «всех»', () => {
    const placeholder = keepPreviousIfSameFilter({ menu: 'burgers', category: 'beef' });

    expect(placeholder(previousData, createQuery({ menu: 'burgers' }))).toBeUndefined();
  });

  it('возвращает undefined, если прошлого запроса нет', () => {
    const placeholder = keepPreviousIfSameFilter({ menu: 'burgers' });

    expect(placeholder(undefined, undefined)).toBeUndefined();
  });

  it('возвращает undefined, если в ключе прошлого запроса нет параметров', () => {
    const placeholder = keepPreviousIfSameFilter({ menu: 'burgers' });

    expect(placeholder(previousData, { queryKey: ['products'] })).toBeUndefined();
  });
});
