import { describe, expect, it } from 'vitest';

import { DEFAULT_SORTING, SORT_OPTIONS } from '../config/catalog.constants';
import { parseSorting } from './parse-sorting';

const parse = (query: string) => parseSorting(new URLSearchParams(query));

describe('parseSorting', () => {
  it.each(SORT_OPTIONS)('принимает вариант «$label»', ({ sort, order }) => {
    expect(parse(`sort=${sort}&order=${order}`)).toEqual({ sort, order });
  });

  it('возвращает сортировку по умолчанию, если параметров нет', () => {
    expect(parse('')).toEqual({ sort: 'rating', order: 'desc' });
  });

  it('подставляет order по умолчанию, если указан только sort', () => {
    expect(parse('sort=price')).toEqual({ sort: 'price', order: 'desc' });
  });

  it('возвращает сортировку по умолчанию, если указан только order и пара недопустима', () => {
    expect(parse('order=asc')).toEqual(DEFAULT_SORTING);
  });

  it('заменяет только неизвестный order, сохраняя допустимый sort', () => {
    expect(parse('sort=price&order=up')).toEqual({ sort: 'price', order: 'desc' });
  });

  it.each([
    ['неизвестный sort', 'sort=name&order=asc'],
    ['sort в другом регистре', 'sort=PRICE&order=asc'],
    ['допустимые значения в недопустимой паре', 'sort=popularity&order=asc'],
  ])('возвращает сортировку по умолчанию: %s', (_case, query) => {
    expect(parse(query)).toEqual(DEFAULT_SORTING);
  });

  it('игнорирует посторонние параметры', () => {
    expect(parse('menu=drinks&sort=price&order=asc&page=2')).toEqual({
      sort: 'price',
      order: 'asc',
    });
  });
});
