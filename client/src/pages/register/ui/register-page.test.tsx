import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSessionState, setSessionUser } from '@/entities/session';
import { routes } from '@/shared/config';
import { createWrapper, json, stubApi } from '@/shared/testing';

import { RegisterPage } from './register-page';

const renderPage = () => render(<RegisterPage />, { wrapper: createWrapper() });

const getField = (label: string) => screen.getByLabelText<HTMLInputElement>(label);

const signUp = (email: string) => {
  fireEvent.change(getField('Email'), { target: { value: email } });
  fireEvent.change(getField('Пароль'), { target: { value: 'secret-123' } });
  fireEvent.change(getField('Повторите пароль'), { target: { value: 'secret-123' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Создать профиль' }));
};

beforeEach(() => {
  setSessionUser(null);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('RegisterPage', () => {
  it('показывает форму регистрации и ссылку на вход', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Новый профиль' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Войти' }).getAttribute('href')).toBe(routes.login);
  });

  it('после регистрации с подтверждением почты показывает «Проверьте почту»', async () => {
    stubApi({ 'POST /api/auth/sign-up': json({ user: null }) });
    renderPage();

    signUp('new@example.com');

    const heading = await screen.findByRole('heading', { level: 1, name: 'Проверьте почту' });
    expect(document.activeElement).toBe(heading);
    expect(screen.getByText('new@example.com').tagName).toBe('STRONG');
    expect(screen.queryByRole('button', { name: 'Создать профиль' })).toBeNull();
    expect(getSessionState().status).toBe('guest');
  });

  it('«Изменить email» возвращает форму с введённым адресом', async () => {
    stubApi({ 'POST /api/auth/sign-up': json({ user: null }) });
    renderPage();
    signUp('typo@example.con');
    await screen.findByRole('heading', { name: 'Проверьте почту' });

    fireEvent.click(screen.getByRole('button', { name: 'Изменить email' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Новый профиль' })).toBeDefined();
    expect(getField('Email').value).toBe('typo@example.con');
    expect(getField('Пароль').value).toBe('');
  });

  it('если сессия создана сразу, входит без экрана подтверждения', async () => {
    const user = { id: 'user-1', email: 'new@example.com' };
    stubApi({ 'POST /api/auth/sign-up': json({ user }) });
    renderPage();

    signUp('new@example.com');

    await vi.waitFor(() => expect(getSessionState()).toEqual({ status: 'authenticated', user }));
    expect(screen.queryByRole('heading', { name: 'Проверьте почту' })).toBeNull();
  });
});
