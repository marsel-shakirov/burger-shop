import { act, renderHook } from '@testing-library/react';
import { useLocation, useNavigationType } from 'react-router';
import { describe, expect, it } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { useUpdateSearchParams } from './use-update-search-params';

const render = (initialEntry = '/?menu=burgers') =>
  renderHook(
    () => {
      const [searchParams, update] = useUpdateSearchParams();

      return { searchParams, update, location: useLocation(), navigationType: useNavigationType() };
    },
    { wrapper: createWrapper({ initialEntries: [initialEntry] }) },
  );

describe('useUpdateSearchParams', () => {
  it('возвращает текущие параметры адреса', () => {
    const { result } = render('/?menu=burgers&sort=price');

    expect(result.current.searchParams.get('menu')).toBe('burgers');
    expect(result.current.searchParams.get('sort')).toBe('price');
  });

  it('применяет изменения к параметрам, сохраняя остальные', () => {
    const { result } = render('/?menu=burgers&sort=price');

    act(() => result.current.update((params) => params.set('order', 'asc')));

    expect(result.current.location.search).toBe('?menu=burgers&sort=price&order=asc');
  });

  it('удаляет параметры', () => {
    const { result } = render('/?menu=burgers&category=beef');

    act(() => result.current.update((params) => params.delete('category')));

    expect(result.current.location.search).toBe('?menu=burgers');
  });

  it('заменяет запись в истории, а не добавляет новую', () => {
    const { result } = render();

    act(() => result.current.update((params) => params.set('menu', 'drinks')));

    expect(result.current.navigationType).toBe('REPLACE');
  });

  it('сохраняет путь', () => {
    const { result } = render('/favorite?sort=price');

    act(() => result.current.update((params) => params.set('sort', 'rating')));

    expect(result.current.location.pathname).toBe('/favorite');
  });

  it('передаёт в мутатор копию, а не текущие параметры', () => {
    const { result } = render();
    const current = result.current.searchParams;
    let received: URLSearchParams | undefined;

    act(() =>
      result.current.update((params) => {
        received = params;
        params.set('menu', 'drinks');
      }),
    );

    expect(received).not.toBe(current);
    expect(current.get('menu')).toBe('burgers');
  });
});
