import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Profile } from '@/entities/profile';
import { setSessionUser } from '@/entities/session';
import { routes } from '@/shared/config';
import { type ApiHandlers, createWrapper, json, pending, stubApi } from '@/shared/testing';

import { ProfilePage } from './profile-page';

const user = { id: 'user-1', email: 'user@example.com' };

const profile: Profile = { name: 'Анна', phone: null, birthDate: null, gender: null };

const bonus = {
  balance: 150,
  transactions: [
    { id: 't1', amount: 100, title: 'Приветственный бонус', createdAt: '2026-01-01' },
    { id: 't2', amount: 50, title: 'За отзыв', createdAt: '2026-02-01' },
  ],
};

const api: ApiHandlers = {
  'GET /api/profile': json(profile),
  'GET /api/bonus': json(bonus),
  'GET /api/favorites': json({ productIds: [1, 2] }),
};

const renderPage = () => render(<ProfilePage />, { wrapper: createWrapper() });

beforeEach(() => {
  setSessionUser(user);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ProfilePage', () => {
  it('пока профиль загружается, показывает скелетон', () => {
    stubApi({ ...api, 'GET /api/profile': pending });

    renderPage();

    expect(screen.getByLabelText('Загрузка профиля')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Выйти из профиля' })).toBeDefined();
  });

  it('показывает имя со ссылкой на редактирование', async () => {
    stubApi(api);

    renderPage();

    const nameLink = await screen.findByRole('link', { name: 'Анна' });
    expect(nameLink.getAttribute('href')).toBe(routes.edit);
  });

  it('без имени предлагает его указать', async () => {
    stubApi({ ...api, 'GET /api/profile': json({ ...profile, name: null }) });

    renderPage();

    expect(await screen.findByRole('link', { name: 'Как вас зовут?' })).toBeDefined();
  });

  it('показывает количество избранного', async () => {
    stubApi(api);

    renderPage();

    expect(await screen.findByRole('link', { name: /Избранное.*2 товара/ })).toBeDefined();
  });

  it('показывает бонусы: начисления и баланс', async () => {
    stubApi(api);

    renderPage();

    await screen.findByText('Приветственный бонус');
    const bonusSection = screen.getByRole('region', { name: 'Бонусы' });
    expect(bonusSection.textContent).toMatch(/Приветственный бонус.*\+100/);
    expect(bonusSection.textContent).toMatch(/За отзыв.*\+50/);
    expect(bonusSection.querySelector('data')?.getAttribute('value')).toBe('150');
  });

  it('без начислений сообщает об этом и показывает нулевой баланс', async () => {
    stubApi({ ...api, 'GET /api/bonus': json({ balance: 0, transactions: [] }) });

    renderPage();

    expect(await screen.findByText('Пока нет начислений')).toBeDefined();
    expect(
      screen.getByRole('region', { name: 'Бонусы' }).querySelector('data')?.getAttribute('value'),
    ).toBe('0');
  });

  it('если бонусы не загрузились, остальной профиль показывается', async () => {
    stubApi({ ...api, 'GET /api/bonus': json(null, 500) });

    renderPage();

    expect(await screen.findByText('Не удалось загрузить')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Анна' })).toBeDefined();
  });

  it('если профиль не загрузился, показывает ошибку и загружает снова', async () => {
    stubApi({ ...api, 'GET /api/profile': json(null, 500) });
    renderPage();

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/Профиль не загрузился/);

    stubApi(api);
    fireEvent.click(screen.getByRole('button', { name: 'Загрузить снова' }));

    expect(await screen.findByRole('link', { name: 'Анна' })).toBeDefined();
  });
});
