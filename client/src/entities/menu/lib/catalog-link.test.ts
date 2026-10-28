import { describe, expect, it } from 'vitest';

import {
  clearCatalogParams,
  parseCatalogParams,
  setCatalogCategoryParam,
  setCatalogMenuParam,
} from './catalog-link';

describe('parseCatalogParams', () => {
  it('возвращает меню и категорию', () => {
    expect(parseCatalogParams(new URLSearchParams('menu=burgers&category=beef'))).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'beef',
    });
  });

  it('игнорирует остальные параметры', () => {
    expect(
      parseCatalogParams(new URLSearchParams('sort=price&menu=drinks&product=7&order=asc')),
    ).toEqual({ menuSlug: 'drinks', categorySlug: undefined });
  });

  it('возвращает категорию без меню', () => {
    expect(parseCatalogParams(new URLSearchParams('category=beef'))).toEqual({
      menuSlug: undefined,
      categorySlug: 'beef',
    });
  });

  it.each([
    ['параметров нет', ''],
    ['пустые значения', 'menu=&category='],
    ['параметры без значения', 'menu&category'],
  ])('возвращает undefined, если %s', (_case, query) => {
    expect(parseCatalogParams(new URLSearchParams(query))).toEqual({
      menuSlug: undefined,
      categorySlug: undefined,
    });
  });

  it('берёт первое значение, если параметр повторяется', () => {
    expect(parseCatalogParams(new URLSearchParams('menu=burgers&menu=drinks'))).toEqual({
      menuSlug: 'burgers',
      categorySlug: undefined,
    });
  });

  it('декодирует значения', () => {
    expect(
      parseCatalogParams(new URLSearchParams('menu=%D0%B1%D1%83%D1%80%D0%B3%D0%B5%D1%80')),
    ).toEqual({
      menuSlug: 'бургер',
      categorySlug: undefined,
    });
  });
});

describe('setCatalogMenuParam', () => {
  it('добавляет параметр menu', () => {
    const params = new URLSearchParams();

    setCatalogMenuParam(params, 'burgers');

    expect(params.toString()).toBe('menu=burgers');
  });

  it('заменяет текущее меню', () => {
    const params = new URLSearchParams('menu=burgers');

    setCatalogMenuParam(params, 'drinks');

    expect(params.getAll('menu')).toEqual(['drinks']);
  });

  it('сбрасывает категорию при смене меню', () => {
    const params = new URLSearchParams('menu=burgers&category=beef');

    setCatalogMenuParam(params, 'drinks');

    expect(params.has('category')).toBe(false);
  });

  it('сбрасывает категорию, даже если меню то же', () => {
    const params = new URLSearchParams('menu=burgers&category=beef');

    setCatalogMenuParam(params, 'burgers');

    expect(params.toString()).toBe('menu=burgers');
  });

  it('оставляет остальные параметры и их порядок', () => {
    const params = new URLSearchParams('sort=price&menu=burgers&category=beef&product=7');

    setCatalogMenuParam(params, 'drinks');

    expect(params.toString()).toBe('sort=price&menu=drinks&product=7');
  });
});

describe('setCatalogCategoryParam', () => {
  it('добавляет параметр category', () => {
    const params = new URLSearchParams('menu=burgers');

    setCatalogCategoryParam(params, 'beef');

    expect(params.toString()).toBe('menu=burgers&category=beef');
  });

  it('заменяет текущую категорию', () => {
    const params = new URLSearchParams('menu=burgers&category=beef');

    setCatalogCategoryParam(params, 'chicken');

    expect(params.getAll('category')).toEqual(['chicken']);
  });

  it.each([
    ['не передана', undefined],
    ['пустая строка', ''],
  ])('удаляет категорию, если она %s', (_case, categorySlug) => {
    const params = new URLSearchParams('menu=burgers&category=beef');

    setCatalogCategoryParam(params, categorySlug);

    expect(params.toString()).toBe('menu=burgers');
  });

  it('не трогает меню и остальные параметры', () => {
    const params = new URLSearchParams('menu=burgers&category=beef&sort=price');

    setCatalogCategoryParam(params, 'chicken');

    expect(params.toString()).toBe('menu=burgers&category=chicken&sort=price');
  });
});

describe('clearCatalogParams', () => {
  it('удаляет меню и категорию', () => {
    const params = new URLSearchParams('menu=burgers&category=beef');

    clearCatalogParams(params);

    expect(params.toString()).toBe('');
  });

  it('оставляет остальные параметры и их порядок', () => {
    const params = new URLSearchParams('sort=price&menu=burgers&product=7&category=beef');

    clearCatalogParams(params);

    expect(params.toString()).toBe('sort=price&product=7');
  });
});

describe('ссылка каталога: туда и обратно', () => {
  it('parseCatalogParams читает то, что записали set-функции', () => {
    const params = new URLSearchParams();

    setCatalogMenuParam(params, 'burgers');
    setCatalogCategoryParam(params, 'beef');

    expect(parseCatalogParams(params)).toEqual({ menuSlug: 'burgers', categorySlug: 'beef' });
  });
});
