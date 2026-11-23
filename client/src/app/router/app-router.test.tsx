import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useSyncExternalStore } from 'react';
import { Outlet } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { useSessionStatus } from '@/entities/session';
import { routes } from '@/shared/config';
import { createTestQueryClient, json, stubApi } from '@/shared/testing';

import { AppRouter } from './app-router';

type SessionStatus = ReturnType<typeof useSessionStatus>;

const session = vi.hoisted(() => {
  const state: { status: SessionStatus } = { status: 'guest' };
  const listeners = new Set<() => void>();

  return {
    getStatus: () => state.status,
    setStatus: (status: SessionStatus) => {
      state.status = status;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
});

vi.mock('@/entities/session', () => ({
  useSessionStatus: () => useSyncExternalStore(session.subscribe, session.getStatus),
  useSessionUser: () =>
    useSyncExternalStore(session.subscribe, session.getStatus) === 'authenticated'
      ? { id: 'user-1', email: 'user@example.com' }
      : null,
}));

vi.mock('../layouts/app-layout', () => ({
  AppLayout: () => (
    <>
      <header>layout</header>
      <Outlet />
    </>
  ),
}));

vi.mock('@/pages/home', () => ({ HomePage: () => <h1>home</h1> }));
vi.mock('@/pages/cart', () => ({ CartPage: () => <h1>cart</h1> }));
vi.mock('@/pages/checkout', () => ({ CheckoutPage: () => <h1>checkout</h1> }));
vi.mock('@/pages/favorite', () => ({ FavoritePage: () => <h1>favorites</h1> }));
vi.mock('@/pages/login', () => ({ LoginPage: () => <h1>login</h1> }));
vi.mock('@/pages/register', () => ({ RegisterPage: () => <h1>register</h1> }));
vi.mock('@/pages/not-found', () => ({ NotFoundPage: () => <h1>not found</h1> }));
vi.mock('@/pages/order-history', () => ({ OrderHistoryPage: () => <h1>order history</h1> }));
vi.mock('@/pages/profile', () => ({
  ProfilePage: () => <h1>profile</h1>,
  ProfileEditPage: () => <h1>profile edit</h1>,
}));

const renderAt = (path: string, status: SessionStatus) => {
  session.setStatus(status);
  window.history.replaceState(null, '', path);

  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <AppRouter />
    </QueryClientProvider>,
  );
};

const getPageTitle = () => screen.queryByRole('heading', { level: 1 })?.textContent ?? null;

const hasLayout = () => screen.queryByText('layout') !== null;

const orderPath = '/profile/orders/12340f03-6b80-45db-98ca-6797fbd7d424';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

afterEach(() => vi.unstubAllGlobals());

describe('AppRouter: открытые страницы', () => {
  it.each([
    [routes.home, 'home'],
    [routes.cart, 'cart'],
    [routes.favorites, 'favorites'],
  ])('%s доступна гостю и пользователю', (path, title) => {
    const { unmount } = renderAt(path, 'guest');
    expect(getPageTitle()).toBe(title);
    unmount();

    renderAt(path, 'authenticated');
    expect(getPageTitle()).toBe(title);
  });

  it('показывается, пока сессия загружается', () => {
    renderAt(routes.cart, 'loading');

    expect(getPageTitle()).toBe('cart');
  });

  it('рендерится внутри общего лейаута', () => {
    renderAt(routes.home, 'guest');

    expect(hasLayout()).toBe(true);
  });
});

describe('AppRouter: страницы профиля', () => {
  it.each([
    [routes.profile, 'profile'],
    [routes.edit, 'profile edit'],
    [routes.orders, 'order history'],
  ])('%s доступна пользователю', async (path, title) => {
    renderAt(path, 'authenticated');

    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeDefined();
    expect(hasLayout()).toBe(true);
  });

  it.each([routes.profile, routes.edit, routes.orders, orderPath])(
    '%s перенаправляет гостя на вход',
    (path) => {
      renderAt(path, 'guest');

      expect(getPageTitle()).toBe('login');
      expect(window.location.pathname).toBe(routes.login);
    },
  );

  it.each([routes.profile, routes.edit, routes.orders, orderPath])(
    '%s пустая, пока сессия загружается',
    (path) => {
      renderAt(path, 'loading');

      expect(getPageTitle()).toBeNull();
      expect(hasLayout()).toBe(true);
      expect(window.location.pathname).toBe(path);
    },
  );

  it('загружает заказ по прямому адресу и возвращает в покупки', async () => {
    stubApi({
      'GET /api/orders/12340f03-6b80-45db-98ca-6797fbd7d424': json({
        id: '12340f03-6b80-45db-98ca-6797fbd7d424',
        orderNumber: '42',
        status: 'new',
        createdAt: '2026-11-22T12:00:00.123456Z',
        totalPrice: 600,
        items: [],
      }),
    });
    renderAt(orderPath, 'authenticated');

    expect(await screen.findByRole('heading', { name: 'Заказ №42' })).toBeDefined();
    expect(hasLayout()).toBe(true);
    fireEvent.click(screen.getByRole('link', { name: 'К покупкам' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'order history' })).toBeDefined();
    expect(window.location.pathname).toBe(routes.orders);
  });
});

describe('AppRouter: вход и регистрация', () => {
  it.each([
    [routes.login, 'login'],
    [routes.register, 'register'],
  ])('%s доступна гостю', (path, title) => {
    renderAt(path, 'guest');

    expect(getPageTitle()).toBe(title);
    expect(hasLayout()).toBe(true);
  });

  it.each([routes.login, routes.register])(
    '%s перенаправляет пользователя в профиль',
    async (path) => {
      renderAt(path, 'authenticated');

      expect(await screen.findByRole('heading', { level: 1, name: 'profile' })).toBeDefined();
      expect(window.location.pathname).toBe(routes.profile);
    },
  );

  it.each([routes.login, routes.register])('%s пустая, пока сессия загружается', (path) => {
    renderAt(path, 'loading');

    expect(getPageTitle()).toBeNull();
    expect(window.location.pathname).toBe(path);
  });
});

describe('AppRouter: оформление заказа', () => {
  it('возвращает гостя к оформлению сразу после входа', async () => {
    renderAt(routes.checkout, 'guest');

    expect(getPageTitle()).toBe('login');
    expect(window.location.pathname).toBe(routes.login);
    expect(window.location.search).toBe('?next=checkout');

    act(() => session.setStatus('authenticated'));

    expect(await screen.findByRole('heading', { level: 1, name: 'checkout' })).toBeDefined();
    expect(window.location.pathname).toBe(routes.checkout);
    expect(window.location.search).toBe('');
  });

  it('авторизованный пользователь может открыть оформление напрямую', async () => {
    renderAt(routes.checkout, 'authenticated');

    expect(await screen.findByRole('heading', { level: 1, name: 'checkout' })).toBeDefined();
  });

  it('не использует произвольный адрес из параметра возврата', async () => {
    renderAt(`${routes.login}?next=https://example.test`, 'authenticated');

    expect(await screen.findByRole('heading', { level: 1, name: 'profile' })).toBeDefined();
  });
});

describe('AppRouter: неизвестный адрес', () => {
  it.each(['/unknown', '/cart/123', '/profile/unknown'])(
    '%s показывает страницу 404 без общего лейаута',
    (path) => {
      renderAt(path, 'authenticated');

      expect(getPageTitle()).toBe('not found');
      expect(hasLayout()).toBe(false);
      expect(window.location.pathname).toBe(path);
    },
  );
});
