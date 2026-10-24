import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Profile } from '@/entities/profile';
import { setSessionUser } from '@/entities/session';
import { routes } from '@/shared/config';
import { type ApiHandlers, createWrapper, json, pending, status, stubApi } from '@/shared/testing';

import { ProfileEditPage } from './profile-edit-page';

const user = { id: 'user-1', email: 'user@example.com' };

const profile: Profile = {
  name: 'Анна',
  phone: '+79990000000',
  birthDate: '1990-05-07',
  gender: 'female',
};

const api: ApiHandlers = { 'GET /api/profile': json(profile) };

const renderPage = () => render(<ProfileEditPage />, { wrapper: createWrapper() });

const getOpenDialog = () => screen.getByRole('dialog');

beforeEach(() => {
  setSessionUser(user);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ProfileEditPage: просмотр', () => {
  it('пока профиль загружается, показывает ссылку назад', () => {
    stubApi({ 'GET /api/profile': pending });

    renderPage();

    expect(screen.getByRole('link', { name: 'Вернуться' }).getAttribute('href')).toBe(
      routes.profile,
    );
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('показывает личные данные, телефон и email', async () => {
    stubApi(api);

    renderPage();

    expect(await screen.findByRole('heading', { level: 1, name: 'Анна' })).toBeDefined();
    expect(screen.getByText('7 мая 1990')).toBeDefined();
    expect(screen.getByText('Женский', { selector: 'p' })).toBeDefined();
    expect(screen.getByText('+79990000000')).toBeDefined();
    expect(screen.getByText('user@example.com')).toBeDefined();
    expect(screen.getByText(/Пришлём промокод 7 мая/)).toBeDefined();
  });

  it('для пустого профиля предлагает добавить данные', async () => {
    stubApi({
      'GET /api/profile': json({ name: null, phone: null, birthDate: null, gender: null }),
    });

    renderPage();

    expect(await screen.findByRole('button', { name: 'Добавить личные данные' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Добавить телефон' })).toBeDefined();
    expect(screen.getByText('Дата рождения не указана')).toBeDefined();
  });
});

describe('ProfileEditPage: редактирование', () => {
  it('«Изменить личные данные» открывает форму личных данных', async () => {
    stubApi(api);
    renderPage();

    fireEvent.click(await screen.findByRole('button', { name: 'Изменить личные данные' }));

    expect(getOpenDialog()).toBe(screen.getByRole('dialog', { name: 'Личные данные' }));
    expect(within(getOpenDialog()).getByLabelText<HTMLInputElement>('Имя').value).toBe('Анна');
  });

  it('«Изменить телефон» открывает форму телефона', async () => {
    stubApi(api);
    renderPage();

    fireEvent.click(await screen.findByRole('button', { name: 'Изменить телефон' }));

    expect(getOpenDialog()).toBe(screen.getByRole('dialog', { name: 'Телефон' }));
  });

  it('после сохранения показывает новые данные и закрывает форму', async () => {
    stubApi({ ...api, 'PATCH /api/profile': json({ ...profile, name: 'Мария' }) });
    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Изменить личные данные' }));

    fireEvent.change(within(getOpenDialog()).getByLabelText('Имя'), {
      target: { value: 'Мария' },
    });
    fireEvent.submit(within(getOpenDialog()).getByRole('button', { name: 'Сохранить' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Мария' })).toBeDefined();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('повторное открытие формы сбрасывает несохранённый ввод', async () => {
    stubApi(api);
    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Изменить личные данные' }));
    fireEvent.change(within(getOpenDialog()).getByLabelText('Имя'), {
      target: { value: 'Черновик' },
    });
    fireEvent.click(within(getOpenDialog()).getByRole('button', { name: 'Закрыть' }));

    fireEvent.click(screen.getByRole('button', { name: 'Изменить личные данные' }));

    expect(within(getOpenDialog()).getByLabelText<HTMLInputElement>('Имя').value).toBe('Анна');
  });

  it('после смены пароля сообщает «Пароль изменён»', async () => {
    stubApi({ ...api, 'POST /api/auth/password': status(204) });
    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Изменить пароль' }));
    const dialog = screen.getByRole('dialog', { name: 'Смена пароля' });

    fireEvent.change(within(dialog).getByLabelText('Текущий пароль'), {
      target: { value: 'old-password' },
    });
    fireEvent.change(within(dialog).getByLabelText('Новый пароль'), {
      target: { value: 'new-password' },
    });
    fireEvent.change(within(dialog).getByLabelText('Повторите пароль'), {
      target: { value: 'new-password' },
    });
    fireEvent.submit(within(dialog).getByRole('button', { name: 'Сменить пароль' }));

    expect(await screen.findByText('Пароль изменён')).toBeDefined();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
