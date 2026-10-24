import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSessionState, setSessionUser } from '@/entities/session';
import { createWrapper } from '@/shared/testing';

import { SignInForm } from './sign-in-form';

const user = { id: 'user-1', email: 'user@example.com' };

const fetchMock = vi.fn<typeof fetch>();

const renderForm = () => render(<SignInForm />, { wrapper: createWrapper() });

const getEmail = () => screen.getByLabelText<HTMLInputElement>('Email');

const getPassword = () => screen.getByLabelText<HTMLInputElement>('Пароль');

const fillAndSubmit = (email: string, password: string) => {
  fireEvent.change(getEmail(), { target: { value: email } });
  fireEvent.change(getPassword(), { target: { value: password } });
  fireEvent.submit(screen.getByRole('button', { name: 'Войти' }));
};

const getSentBody = () => {
  const body = fetchMock.mock.calls[0]?.[1]?.body;

  return typeof body === 'string' ? (JSON.parse(body) as unknown) : undefined;
};

beforeEach(() => {
  setSessionUser(null);
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('SignInForm: отправка', () => {
  it('отправляет email без пробелов по краям и пароль как есть', async () => {
    fetchMock.mockResolvedValue(Response.json({ user }));
    renderForm();

    fillAndSubmit('  user@example.com ', ' secret ');

    await waitFor(() =>
      expect(getSentBody()).toEqual({ email: 'user@example.com', password: ' secret ' }),
    );
  });

  it('после входа записывает пользователя в сессию', async () => {
    fetchMock.mockResolvedValue(Response.json({ user }));
    renderForm();

    fillAndSubmit('user@example.com', 'secret');

    await waitFor(() => expect(getSessionState()).toEqual({ status: 'authenticated', user }));
  });

  it('пока идёт запрос, показывает состояние загрузки', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    renderForm();

    fillAndSubmit('user@example.com', 'secret');

    expect(await screen.findByRole('button', { name: 'Входим…' })).toHaveProperty('disabled', true);
  });
});

describe('SignInForm: ошибка', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(Response.json({ code: 'invalid_credentials' }, { status: 400 }));
  });

  it('показывает понятное сообщение и помечает оба поля', async () => {
    renderForm();

    fillAndSubmit('user@example.com', 'wrong');

    expect((await screen.findByRole('alert')).textContent).toBe('Неверный email или пароль');
    expect(getEmail().getAttribute('aria-invalid')).toBe('true');
    expect(getPassword().getAttribute('aria-invalid')).toBe('true');
    expect(
      screen.getByRole('textbox', { name: 'Email', description: 'Неверный email или пароль' }),
    ).toBe(getEmail());
  });

  it('скрывает ошибку, когда пользователь начинает исправлять', async () => {
    renderForm();
    fillAndSubmit('user@example.com', 'wrong');
    await screen.findByRole('alert');

    fireEvent.input(getPassword(), { target: { value: 'wrong2' } });

    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
    expect(getEmail().hasAttribute('aria-invalid')).toBe(false);
  });

  it('не меняет сессию', async () => {
    renderForm();

    fillAndSubmit('user@example.com', 'wrong');

    await screen.findByRole('alert');
    expect(getSessionState().status).toBe('guest');
  });
});

describe('SignInForm: тестовые пользователи', () => {
  it('кнопка тестового пользователя заполняет email и пароль', () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'User Dinar' }));

    expect(getEmail().value).toBe('webapi.user.test@gmail.com');
    expect(getPassword().value).not.toBe('');
  });

  it('кнопка тестового пользователя не отправляет форму', () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'User Mars' }));

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
