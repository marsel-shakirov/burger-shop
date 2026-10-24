import { render, screen } from '@testing-library/react';
import { Outlet } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SessionStatus } from '@/entities/session';
import { routes } from '@/shared/config';

import { AppRouter } from './app-router';

const session = vi.hoisted(() => {
  const state: { status: SessionStatus } = { status: 'guest' };

  return state;
});

vi.mock('@/entities/session', () => ({ useSessionStatus: () => session.status }));

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
vi.mock('@/pages/favorite', () => ({ FavoritePage: () => <h1>favorites</h1> }));
vi.mock('@/pages/login', () => ({ LoginPage: () => <h1>login</h1> }));
vi.mock('@/pages/register', () => ({ RegisterPage: () => <h1>register</h1> }));
vi.mock('@/pages/not-found', () => ({ NotFoundPage: () => <h1>not found</h1> }));
vi.mock('@/pages/profile', () => ({
  ProfilePage: () => <h1>profile</h1>,
  ProfileEditPage: () => <h1>profile edit</h1>,
}));

const renderAt = (path: string, status: SessionStatus) => {
  session.status = status;
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
  ])('%s доступна пользователю', (path, title) => {
    renderAt(path, 'authenticated');

    expect(getPageTitle()).toBe(title);
    expect(hasLayout()).toBe(true);
  });

  it.each([routes.profile, routes.edit])('%s перенаправляет гостя на вход', (path) => {
    renderAt(path, 'guest');

    expect(getPageTitle()).toBe('login');
    expect(window.location.pathname).toBe(routes.login);
  });

  it.each([routes.profile, routes.edit])('%s пустая, пока сессия загружается', (path) => {
    renderAt(path, 'loading');

    expect(getPageTitle()).toBeNull();
    expect(hasLayout()).toBe(true);
    expect(window.location.pathname).toBe(path);
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
