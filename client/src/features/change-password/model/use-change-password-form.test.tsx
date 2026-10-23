import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSubmitEvent, createTestQueryClient, createWrapper } from '@/shared/testing';

import { SAME_PASSWORD_MESSAGE } from '../config/change-password.constants';
import { useChangePasswordForm } from './use-change-password-form';

const validFields = {
  currentPassword: 'old-password-1',
  newPassword: 'new-password-1',
  confirmPassword: 'new-password-1',
};

const fetchMock = vi.fn<typeof fetch>();

const onChanged = vi.fn();

const render = () =>
  renderHook(() => useChangePasswordForm({ onChanged }), {
    wrapper: createWrapper({ queryClient: createTestQueryClient() }),
  });

const submit = (
  result: { current: ReturnType<typeof useChangePasswordForm> },
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

describe('useChangePasswordForm: валидация', () => {
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

    submit(result, { ...validFields, newPassword: validFields.currentPassword });

    expect(result.current.formError).toEqual({
      message: SAME_PASSWORD_MESSAGE,
      field: 'newPassword',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('сбрасывает ошибку валидации при вводе', () => {
    const { result } = render();
    submit(result, { ...validFields, currentPassword: '' });

    act(() => result.current.handleInput());

    expect(result.current.formError).toBeNull();
  });
});

describe('useChangePasswordForm: отправка', () => {
  it('отправляет текущий и новый пароль без подтверждения', async () => {
    const { result } = render();

    submit(result, validFields);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/password',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          currentPassword: validFields.currentPassword,
          newPassword: validFields.newPassword,
        }),
      }),
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

  it('вызывает onChanged после успешной смены пароля', async () => {
    const { result } = render();

    submit(result, validFields);

    await waitFor(() => expect(onChanged).toHaveBeenCalledOnce());
    expect(result.current.formError).toBeNull();
  });
});

describe('useChangePasswordForm: ошибка сервера', () => {
  it('показывает ошибку сервера у нужного поля и не вызывает onChanged', async () => {
    respondWithError('invalid_current_password');
    const { result } = render();

    submit(result, validFields);

    await waitFor(() =>
      expect(result.current.formError).toEqual({
        message: 'Текущий пароль указан неверно',
        field: 'currentPassword',
      }),
    );
    expect(onChanged).not.toHaveBeenCalled();
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

    submit(result, { ...validFields, confirmPassword: 'other-password' });

    expect(result.current.formError?.field).toBe('confirmPassword');
  });
});
