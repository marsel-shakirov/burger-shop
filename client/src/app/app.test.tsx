import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routes } from '@/shared/config';
import { type ApiHandlers, json, stubApi } from '@/shared/testing';

import { App } from './app';

const user = { id: 'user-1', email: 'user@example.com' };

const guestApi: ApiHandlers = {
  'GET /api/auth/session': json({ user: null }),
  'GET /api/products': json([]),
};

const renderAt = (path: string) => {
  window.history.replaceState(null, '', path);

  return render(<App />);
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('показывает шапку, навигацию и страницу по адресу', async () => {
    stubApi(guestApi);

    renderAt(routes.cart);

    expect(screen.getByRole('link', { name: /burger shop/ }).getAttribute('href')).toBe(
      routes.home,
    );
    expect(screen.getAllByRole('navigation', { name: 'Основная навигация' })).toHaveLength(2);
    expect(await screen.findByText('Пока пусто')).toBeDefined();
  });

  it('неизвестный адрес показывает 404 со ссылкой на главную и без шапки', () => {
    stubApi(guestApi);

    renderAt('/unknown');

    expect(screen.getByRole('heading', { name: 'Ошибка 404' })).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'Перейти на главную страницу' }).getAttribute('href'),
    ).toBe(routes.home);
    expect(screen.queryByRole('link', { name: /burger shop/ })).toBeNull();
  });

  it('гостя из профиля перенаправляет на вход', async () => {
    stubApi(guestApi);

    renderAt(routes.profile);

    expect(await screen.findByRole('heading', { name: 'Вход в профиль' })).toBeDefined();
    expect(window.location.pathname).toBe(routes.login);
    expect(screen.getByRole('link', { name: 'Создать профиль' }).getAttribute('href')).toBe(
      routes.register,
    );
  });

  it('после входа открывает профиль и загружает данные пользователя', async () => {
    stubApi({
      ...guestApi,
      'POST /api/auth/sign-in': json({ user }),
      'GET /api/profile': json({ name: 'Анна', phone: null, birthDate: null, gender: null }),
      'GET /api/favorites': json({ productIds: [] }),
      'GET /api/cart': json({ items: [] }),
      'GET /api/bonus': json({ balance: 0, transactions: [] }),
    });
    renderAt(routes.login);

    fireEvent.change(await screen.findByLabelText('Email'), { target: { value: user.email } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: 'secret' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByRole('link', { name: 'Анна' })).toBeDefined();
    expect(window.location.pathname).toBe(routes.profile);
  });
});
