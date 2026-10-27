import { act, renderHook } from '@testing-library/react';
import { useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { useCatalogParams } from './use-catalog-params';

const render = (initialEntry = '/') =>
  renderHook(() => ({ params: useCatalogParams(), location: useLocation() }), {
    wrapper: createWrapper({ initialEntries: [initialEntry] }),
  });

const getSearchParams = (result: { current: { location: { search: string } } }) =>
  Object.fromEntries(new URLSearchParams(result.current.location.search));

describe('useCatalogParams: чтение', () => {
  it('без параметров не выбирает меню и категорию', () => {
    const { result } = render();

    expect(result.current.params).toMatchObject({ menuSlug: undefined, categorySlug: undefined });
  });

  it('читает меню и категорию из адреса', () => {
    const { result } = render('/?menu=drinks&category=cola');

    expect(result.current.params).toMatchObject({ menuSlug: 'drinks', categorySlug: 'cola' });
  });
});

describe('useCatalogParams: изменение', () => {
  it('selectMenu меняет меню и сбрасывает категорию', () => {
    const { result } = render('/?menu=drinks&category=cola');

    act(() => result.current.params.selectMenu('burgers'));

    expect(getSearchParams(result)).toEqual({ menu: 'burgers' });
  });

  it('selectCategory записывает меню и категорию', () => {
    const { result } = render('/?menu=burgers&category=beef');

    act(() => result.current.params.selectCategory({ menuSlug: 'drinks', categorySlug: 'cola' }));

    expect(getSearchParams(result)).toEqual({ menu: 'drinks', category: 'cola' });
  });

  it('сохраняет посторонние параметры', () => {
    const { result } = render('/?product=7');

    act(() => result.current.params.selectMenu('drinks'));

    expect(getSearchParams(result)).toEqual({ product: '7', menu: 'drinks' });
  });
});
