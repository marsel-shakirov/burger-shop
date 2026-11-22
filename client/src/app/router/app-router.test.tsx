import { act, render, screen } from '@testing-library/react';
import { useSyncExternalStore } from 'react';
import { Outlet } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { useSessionStatus } from '@/entities/session';
import { routes } from '@/shared/config';

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

  return render(<AppRouter />);
};

const getPageTitle = () => screen.queryByRole('heading', { level: 1 })?.textContent ?? null;

const hasLayout = () => screen.queryByText('layout') !== null;

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

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
  ])('%s доступна пользователю', (path, title) => {
    renderAt(path, 'authenticated');

    expect(getPageTitle()).toBe(title);
    expect(hasLayout()).toBe(true);
  });

  it.each([routes.profile, routes.edit, routes.orders])(
    '%s перенаправляет гостя на вход',
    (path) => {
      renderAt(path, 'guest');

      expect(getPageTitle()).toBe('login');
      expect(window.location.pathname).toBe(routes.login);
    },
  );

  it.each([routes.profile, routes.edit, routes.orders])(
    '%s пустая, пока сессия загружается',
    (path) => {
      renderAt(path, 'loading');

      expect(getPageTitle()).toBeNull();
      expect(hasLayout()).toBe(true);
      expect(window.location.pathname).toBe(path);
    },
  );
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

  it.each([routes.login, routes.register])('%s перенаправляет пользователя в профиль', (path) => {
    renderAt(path, 'authenticated');

    expect(getPageTitle()).toBe('profile');
    expect(window.location.pathname).toBe(routes.profile);
  });

  it.each([routes.login, routes.register])('%s пустая, пока сессия загружается', (path) => {
    renderAt(path, 'loading');

    expect(getPageTitle()).toBeNull();
    expect(window.location.pathname).toBe(path);
  });
});

describe('AppRouter: оформление заказа', () => {
  it('возвращает гостя к оформлению сразу после входа', () => {
    renderAt(routes.checkout, 'guest');

    expect(getPageTitle()).toBe('login');
    expect(window.location.pathname).toBe(routes.login);
    expect(window.location.search).toBe('?next=checkout');

    act(() => session.setStatus('authenticated'));

    expect(getPageTitle()).toBe('checkout');
    expect(window.location.pathname).toBe(routes.checkout);
    expect(window.location.search).toBe('');
  });

  it('авторизованный пользователь может открыть оформление напрямую', () => {
    renderAt(routes.checkout, 'authenticated');

    expect(getPageTitle()).toBe('checkout');
  });

  it('не использует произвольный адрес из параметра возврата', () => {
    renderAt(`${routes.login}?next=https://example.test`, 'authenticated');

    expect(getPageTitle()).toBe('profile');
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
