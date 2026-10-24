import { act, renderHook } from '@testing-library/react';
import { type InitialEntry, useLocation, useNavigationType } from 'react-router';
import { describe, expect, it } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { OPENED_FROM_LIST_STATE } from '../config/product.constants';
import { useProductDetailsParam } from './use-product-details-param';

const render = (initialEntries: InitialEntry[]) =>
  renderHook(
    () => ({
      details: useProductDetailsParam(),
      location: useLocation(),
      navigationType: useNavigationType(),
    }),
    { wrapper: createWrapper({ initialEntries }) },
  );

describe('useProductDetailsParam: productId', () => {
  it('читает id товара из адреса', () => {
    const { result } = render(['/?menu=burgers&product=5']);

    expect(result.current.details.productId).toBe(5);
  });

  it('возвращает undefined без параметра', () => {
    const { result } = render(['/?menu=burgers']);

    expect(result.current.details.productId).toBeUndefined();
  });

  it('возвращает undefined для нечислового значения', () => {
    const { result } = render(['/?product=abc']);

    expect(result.current.details.productId).toBeUndefined();
  });
});

describe('useProductDetailsParam: закрытие', () => {
  it('возвращается назад по истории, если товар открыли из списка', () => {
    const { result } = render([
      '/?menu=drinks',
      { pathname: '/', search: '?menu=drinks&product=5', state: OPENED_FROM_LIST_STATE },
    ]);

    act(() => result.current.details.closeProductDetails());

    expect(result.current.location.search).toBe('?menu=drinks');
    expect(result.current.navigationType).toBe('POP');
    expect(result.current.details.productId).toBeUndefined();
  });

  it('при переходе по прямой ссылке убирает параметр, не уходя со страницы', () => {
    const { result } = render(['/other', '/?menu=drinks&product=5']);

    act(() => result.current.details.closeProductDetails());

    expect(result.current.location.pathname).toBe('/');
    expect(result.current.location.search).toBe('?menu=drinks');
    expect(result.current.navigationType).toBe('REPLACE');
  });

  it('не считает открытием из списка постороннее состояние истории', () => {
    const { result } = render([
      '/other',
      { pathname: '/', search: '?product=5', state: { openedFromList: 'yes' } },
    ]);

    act(() => result.current.details.closeProductDetails());

    expect(result.current.location.pathname).toBe('/');
    expect(result.current.location.search).toBe('');
  });
});
