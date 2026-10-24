import { act, render, renderHook, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useCartActions } from '@/entities/cart';
import { setSessionUser } from '@/entities/session';
import { routes } from '@/shared/config';
import { useLastSearchStore } from '@/shared/lib';
import { createWrapper } from '@/shared/testing';

import { MainNav } from './main-nav';

const renderNav = (path = '/') =>
  render(<MainNav variant="header" />, { wrapper: createWrapper({ initialEntries: [path] }) });

const getLink = (name: RegExp) => screen.getByRole('link', { name });

const getCurrentLinks = () =>
  screen
    .getAllByRole('link')
    .filter((link) => link.getAttribute('aria-current') === 'page')
    .map((link) => link.getAttribute('href'));

beforeEach(() => {
  setSessionUser(null);
  useLastSearchStore.setState(useLastSearchStore.getInitialState(), true);
  const { result } = renderHook(useCartActions, { wrapper: createWrapper() });
  act(() => result.current.clearCart());
});

describe('MainNav: ссылки', () => {
  it('ведёт в меню, избранное, корзину и профиль', () => {
    renderNav();

    expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBeDefined();
    expect(getLink(/^Меню/).getAttribute('href')).toBe(routes.home);
    expect(getLink(/^Избранное/).getAttribute('href')).toBe(routes.favorites);
    expect(getLink(/^Корзина/).getAttribute('href')).toBe(routes.cart);
    expect(getLink(/^Профиль/).getAttribute('href')).toBe(routes.profile);
  });

  it('отмечает текущий раздел', () => {
    renderNav(routes.cart);

    expect(getCurrentLinks()).toEqual([routes.cart]);
  });

  it('меню отмечено только на главной, а не на всех страницах', () => {
    renderNav(routes.home);

    expect(getCurrentLinks()).toEqual([routes.home]);
  });

  it('профиль отмечен и на вложенных страницах профиля', () => {
    renderNav(routes.edit);

    expect(getCurrentLinks()).toEqual([routes.profile]);
  });
});

describe('MainNav: запомненные параметры', () => {
  it('возвращает в меню с последними фильтрами', () => {
    useLastSearchStore.getState().saveSearch(routes.home, '?menu=drinks&sort=price');

    renderNav(routes.cart);

    expect(getLink(/^Меню/).getAttribute('href')).toBe('/?menu=drinks&sort=price');
  });

  it('без запомненных параметров ведёт на чистый адрес', () => {
    renderNav(routes.cart);

    expect(getLink(/^Избранное/).getAttribute('href')).toBe(routes.favorites);
  });
});

describe('MainNav: счётчик корзины', () => {
  it('скрыт для пустой корзины', () => {
    renderNav();

    expect(screen.queryByText(/товар/)).toBeNull();
  });

  it('показывает количество товаров в корзине', () => {
    const { result } = renderHook(useCartActions, { wrapper: createWrapper() });
    act(() => {
      result.current.addItem(1);
      result.current.addItem(1);
      result.current.addItem(2);
    });

    renderNav();

    expect(getLink(/^Корзина/).textContent).toMatch(/3/);
    expect(screen.getByText(', 3 товара')).toBeDefined();
  });
});
