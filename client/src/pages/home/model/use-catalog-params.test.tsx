import { act, renderHook } from '@testing-library/react';
import { useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { DEFAULT_MENU_SLUG } from '../config/catalog.constants';
import { useCatalogParams } from './use-catalog-params';

const render = (initialEntry = '/') =>
  renderHook(() => ({ params: useCatalogParams(), location: useLocation() }), {
    wrapper: createWrapper({ initialEntries: [initialEntry] }),
  });

const getSearchParams = (result: { current: { location: { search: string } } }) =>
  Object.fromEntries(new URLSearchParams(result.current.location.search));

describe('useCatalogParams: чтение', () => {
  it('без параметров возвращает меню по умолчанию', () => {
    const { result } = render();

    expect(result.current.params).toMatchObject({
      menuSlug: DEFAULT_MENU_SLUG,
      categorySlug: undefined,
    });
  });

  it('читает меню и категорию из адреса', () => {
    const { result } = render('/?menu=drinks&category=cola');

    expect(result.current.params).toMatchObject({
      menuSlug: 'drinks',
      categorySlug: 'cola',
    });
  });
});

describe('useCatalogParams: изменение', () => {
  it('selectMenu меняет меню и сбрасывает категорию', () => {
    const { result } = render('/?menu=drinks&category=cola');

    act(() => result.current.params.selectMenu('burgers'));

    expect(getSearchParams(result)).toEqual({ menu: 'burgers' });
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
});
