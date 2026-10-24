import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSessionState, setSessionUser } from '@/entities/session';
import { PASSWORD_MIN_LENGTH, PASSWORDS_MISMATCH_MESSAGE } from '@/shared/config';
import { createWrapper } from '@/shared/testing';

import { SignUpForm } from './sign-up-form';

const user = { id: 'user-1', email: 'user@example.com' };

const fetchMock = vi.fn<typeof fetch>();

const onEmailSent = vi.fn();

const renderForm = (defaultEmail?: string) =>
  render(<SignUpForm defaultEmail={defaultEmail} onEmailSent={onEmailSent} />, {
    wrapper: createWrapper(),
  });

const getField = (label: string) => screen.getByLabelText<HTMLInputElement>(label);

const fill = (fields: { email?: string; password?: string; confirmPassword?: string }) => {
  if (fields.email !== undefined) {
    fireEvent.change(getField('Email'), { target: { value: fields.email } });
  }
  if (fields.password !== undefined) {
    fireEvent.change(getField('Пароль'), { target: { value: fields.password } });
  }
  if (fields.confirmPassword !== undefined) {
    fireEvent.change(getField('Повторите пароль'), { target: { value: fields.confirmPassword } });
  }
};

const submit = () => fireEvent.submit(screen.getByRole('button', { name: 'Создать профиль' }));

const fillValidAndSubmit = () => {
  fill({ email: 'user@example.com', password: 'secret-123', confirmPassword: 'secret-123' });
  submit();
};

beforeEach(() => {
  setSessionUser(null);
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('SignUpForm: поля', () => {
  it('подставляет email по умолчанию', () => {
    renderForm('saved@example.com');

    expect(getField('Email').value).toBe('saved@example.com');
  });

  it('показывает, хватает ли длины пароля', () => {
    renderForm();

    expect(screen.getByText(`0 из ${PASSWORD_MIN_LENGTH}`)).toBeDefined();

    fill({ password: 'abc' });
    expect(screen.getByText(`3 из ${PASSWORD_MIN_LENGTH}`)).toBeDefined();

    fill({ password: 'a'.repeat(PASSWORD_MIN_LENGTH) });
    expect(screen.getByText('подходит')).toBeDefined();
  });

  it('связывает поле пароля с подсказкой о длине', () => {
    renderForm();

    expect(getField('Пароль').getAttribute('aria-describedby')).toBe(
      screen.getByText(`Не короче ${PASSWORD_MIN_LENGTH} символов`).id,
    );
  });
});

describe('SignUpForm: валидация', () => {
  it('при несовпадении паролей показывает ошибку у поля подтверждения и ничего не отправляет', () => {
    renderForm();

    fill({ email: 'user@example.com', password: 'secret-123', confirmPassword: 'secret-124' });
    submit();

    expect(screen.getByRole('alert').textContent).toBe(PASSWORDS_MISMATCH_MESSAGE);
    expect(getField('Повторите пароль').getAttribute('aria-invalid')).toBe('true');
    expect(getField('Email').hasAttribute('aria-invalid')).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('скрывает ошибку валидации при вводе', () => {
    renderForm();
    fill({ password: 'secret-123', confirmPassword: 'other' });
    submit();

    fireEvent.input(getField('Повторите пароль'), { target: { value: 'secret-123' } });

    expect(screen.queryByRole('alert')).toBeNull();
  });
});

describe('SignUpForm: отправка', () => {
  it('если сессия создана сразу, записывает пользователя', async () => {
    fetchMock.mockResolvedValue(Response.json({ user }));
    renderForm();

    fillValidAndSubmit();

    await waitFor(() => expect(getSessionState()).toEqual({ status: 'authenticated', user }));
    expect(onEmailSent).not.toHaveBeenCalled();
  });

  it('если нужно подтвердить почту, передаёт email наверх', async () => {
    fetchMock.mockResolvedValue(Response.json({ user: null }));
    renderForm();

    fillValidAndSubmit();

    await waitFor(() => expect(onEmailSent).toHaveBeenCalledExactlyOnceWith('user@example.com'));
    expect(getSessionState().status).toBe('guest');
  });

  it('пока идёт запрос, показывает состояние загрузки', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    renderForm();

    fillValidAndSubmit();

    expect(await screen.findByRole('button', { name: 'Создаём профиль…' })).toHaveProperty(
      'disabled',
      true,
    );
  });
});

describe('SignUpForm: ошибка сервера', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(Response.json({ code: 'user_already_exists' }, { status: 400 }));
  });

  it('показывает сообщение и помечает email и пароль, но не подтверждение', async () => {
    renderForm();

    fillValidAndSubmit();

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Профиль с этим email уже есть. Войдите в него',
    );
    expect(getField('Email').getAttribute('aria-invalid')).toBe('true');
    expect(getField('Пароль').getAttribute('aria-invalid')).toBe('true');
    expect(getField('Повторите пароль').hasAttribute('aria-invalid')).toBe(false);
  });

  it('скрывает ошибку сервера при вводе', async () => {
    renderForm();
    fillValidAndSubmit();
    await screen.findByRole('alert');

    fireEvent.input(getField('Email'), { target: { value: 'new@example.com' } });

    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });
});
