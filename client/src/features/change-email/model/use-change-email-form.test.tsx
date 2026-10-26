import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSubmitEvent, createTestQueryClient, createWrapper } from '@/shared/testing';

import { SAME_EMAIL_MESSAGE } from '../config/change-email.constants';
import { useChangeEmailForm } from './use-change-email-form';

const CURRENT_EMAIL = 'user@example.com';

const validFields = { newEmail: 'new@example.com', currentPassword: 'old-password-1' };

const fetchMock = vi.fn<typeof fetch>();

const onRequested = vi.fn();

const render = () =>
  renderHook(() => useChangeEmailForm({ currentEmail: CURRENT_EMAIL, onRequested }), {
    wrapper: createWrapper({ queryClient: createTestQueryClient() }),
  });

const submit = (
  result: { current: ReturnType<typeof useChangeEmailForm> },
  fields: Record<string, string>,
) => {
  const { event, preventDefault } = createSubmitEvent(fields);

  act(() => result.current.handleSubmit(event));

  return preventDefault;
};

const respondWithError = (code: string) =>
  fetchMock.mockResolvedValue(Response.json({ code }, { status: 400 }));

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('useChangeEmailForm: валидация', () => {
  it('без ошибок в начале', () => {
    const { result } = render();

    expect(result.current.formError).toBeNull();
    expect(result.current.isPending).toBe(false);
  });

  it('отменяет нативную отправку формы', () => {
    const { result } = render();

    expect(submit(result, validFields)).toHaveBeenCalledOnce();
  });

  it('показывает ошибку валидации и ничего не отправляет', () => {
    const { result } = render();

    submit(result, { ...validFields, newEmail: CURRENT_EMAIL });

    expect(result.current.formError).toEqual({ message: SAME_EMAIL_MESSAGE, field: 'newEmail' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('сбрасывает ошибку валидации при вводе', () => {
    const { result } = render();
    submit(result, { ...validFields, currentPassword: '' });

    act(() => result.current.handleInput());

    expect(result.current.formError).toBeNull();
  });
});

describe('useChangeEmailForm: отправка', () => {
  it('отправляет новый email и текущий пароль', async () => {
    const { result } = render();

    submit(result, validFields);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/email',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(validFields) }),
    );
  });

  it('показывает isPending во время запроса', async () => {
    let respond: (response: Response) => void = () => {};
    fetchMock.mockReturnValue(
      new Promise((resolve) => {
        respond = resolve;
      }),
    );
    const { result } = render();

    submit(result, validFields);

    await waitFor(() => expect(result.current.isPending).toBe(true));
    respond(new Response(null, { status: 204 }));
    await waitFor(() => expect(result.current.isPending).toBe(false));
  });

  it('передаёт новый email в onRequested после успешного запроса', async () => {
    const { result } = render();

    submit(result, validFields);

    await waitFor(() => expect(onRequested).toHaveBeenCalledWith('new@example.com'));
    expect(result.current.formError).toBeNull();
  });
});

describe('useChangeEmailForm: ошибка сервера', () => {
  it('показывает ошибку сервера у нужного поля и не вызывает onRequested', async () => {
    respondWithError('email_exists');
    const { result } = render();

    submit(result, validFields);

    await waitFor(() =>
      expect(result.current.formError).toEqual({
        message: 'Этот email уже занят другим профилем',
        field: 'newEmail',
      }),
    );
    expect(onRequested).not.toHaveBeenCalled();
  });

  it('сбрасывает ошибку сервера при вводе', async () => {
    respondWithError('invalid_current_password');
    const { result } = render();
    submit(result, validFields);
    await waitFor(() => expect(result.current.formError).not.toBeNull());

    act(() => result.current.handleInput());

    await waitFor(() => expect(result.current.formError).toBeNull());
  });

  it('ошибка валидации важнее ошибки сервера', async () => {
    respondWithError('invalid_current_password');
    const { result } = render();
    submit(result, validFields);
    await waitFor(() => expect(result.current.formError?.field).toBe('currentPassword'));

    submit(result, { ...validFields, newEmail: '' });

    expect(result.current.formError?.field).toBe('newEmail');
  });
});
