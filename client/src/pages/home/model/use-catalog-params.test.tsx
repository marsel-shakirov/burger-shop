import { act, renderHook } from '@testing-library/react';
import { useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { DEFAULT_MENU_SLUG, DEFAULT_SORTING } from '../config/catalog.constants';
import { useCatalogParams } from './use-catalog-params';

const render = (initialEntry = '/') =>
  renderHook(() => ({ params: useCatalogParams(), location: useLocation() }), {
    wrapper: createWrapper({ initialEntries: [initialEntry] }),
  });

const getSearchParams = (result: { current: { location: { search: string } } }) =>
  Object.fromEntries(new URLSearchParams(result.current.location.search));

describe('useCatalogParams: чтение', () => {
  it('без параметров возвращает меню и сортировку по умолчанию', () => {
    const { result } = render();

    expect(result.current.params).toMatchObject({
      menuSlug: DEFAULT_MENU_SLUG,
      categorySlug: undefined,
      sorting: DEFAULT_SORTING,
    });
  });

  it('читает меню, категорию и сортировку из адреса', () => {
    const { result } = render('/?menu=drinks&category=cola&sort=price&order=asc');

    expect(result.current.params).toMatchObject({
      menuSlug: 'drinks',
      categorySlug: 'cola',
      sorting: { sort: 'price', order: 'asc' },
    });
  });

  it('подставляет сортировку по умолчанию для неизвестного значения', () => {
    const { result } = render('/?sort=name&order=asc');

    expect(result.current.params.sorting).toEqual(DEFAULT_SORTING);
  });
});

describe('useCatalogParams: изменение', () => {
  it('selectMenu меняет меню и сбрасывает категорию, сохраняя сортировку', () => {
    const { result } = render('/?menu=drinks&category=cola&sort=price&order=asc');

    act(() => result.current.params.selectMenu('burgers'));

    expect(getSearchParams(result)).toEqual({ menu: 'burgers', sort: 'price', order: 'asc' });
    expect(result.current.params.categorySlug).toBeUndefined();
  });

  it('selectCategory выбирает категорию, сохраняя меню', () => {
    const { result } = render('/?menu=drinks');

    act(() => result.current.params.selectCategory('cola'));

    expect(getSearchParams(result)).toEqual({ menu: 'drinks', category: 'cola' });
  });

  it('selectCategory без аргумента сбрасывает категорию', () => {
    const { result } = render('/?menu=drinks&category=cola');

    act(() => result.current.params.selectCategory());

    expect(getSearchParams(result)).toEqual({ menu: 'drinks' });
  });

  it('changeSorting записывает поле и порядок сортировки', () => {
    const { result } = render('/?menu=drinks&category=cola');

    act(() => result.current.params.changeSorting({ sort: 'popularity', order: 'desc' }));

    expect(getSearchParams(result)).toEqual({
      menu: 'drinks',
      category: 'cola',
      sort: 'popularity',
      order: 'desc',
    });
    expect(result.current.params.sorting).toEqual({ sort: 'popularity', order: 'desc' });
  });
});
