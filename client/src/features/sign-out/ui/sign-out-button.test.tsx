import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSessionState, setSessionUser } from '@/entities/session';
import { createWrapper } from '@/shared/testing';

import { SignOutButton } from './sign-out-button';

const fetchMock = vi.fn<typeof fetch>();

const renderButton = () => render(<SignOutButton />, { wrapper: createWrapper() });

const getButton = () => screen.getByRole('button');

beforeEach(() => {
  setSessionUser({ id: 'user-1', email: 'user@example.com' });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('SignOutButton', () => {
  it('отправляет запрос выхода', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    renderButton();

    fireEvent.click(getButton());

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/sign-out', { method: 'POST' }),
    );
  });

  it('пока идёт запрос, блокирует кнопку', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    renderButton();

    fireEvent.click(getButton());

    await waitFor(() => expect(getButton().textContent).toBe('Выходим…'));
    expect(getButton()).toHaveProperty('disabled', true);
  });

  it('после выхода переводит сессию в статус guest', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    renderButton();

    fireEvent.click(getButton());

    await waitFor(() => expect(getSessionState()).toEqual({ status: 'guest', user: null }));
  });

  it('при ошибке показывает сообщение и оставляет пользователя', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    renderButton();

    fireEvent.click(getButton());

    expect((await screen.findByRole('alert')).textContent).toMatch(/Не получилось выйти/);
    expect(getSessionState().status).toBe('authenticated');
    expect(getButton()).toHaveProperty('disabled', false);
  });
});
