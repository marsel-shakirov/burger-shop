import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type Profile, profileQueryOptions } from '@/entities/profile';
import { createSubmitEvent, createTestQueryClient, createWrapper } from '@/shared/testing';

import type { ProfileSection } from './edit-profile.types';
import { useEditProfileForm } from './use-edit-profile-form';

const USER_ID = 'user-1';

const profile: Profile = {
  name: 'Анна',
  phone: '+79990000000',
  birthDate: '1990-05-17',
  gender: 'female',
};

const personalFields = {
  name: 'Анна',
  birthDay: '17',
  birthMonth: '5',
  birthYear: '1990',
  gender: 'female',
};

const fetchMock = vi.fn<typeof fetch>();

const onClose = vi.fn();

let queryClient = createTestQueryClient();

const render = (section: ProfileSection = 'personal') =>
  renderHook(() => useEditProfileForm({ userId: USER_ID, profile, section, onClose }), {
    wrapper: createWrapper({ queryClient }),
  });

const submit = (
  result: { current: ReturnType<typeof useEditProfileForm> },
  fields: Record<string, string>,
) => {
  const { event, preventDefault } = createSubmitEvent(fields);

  act(() => result.current.handleSubmit(event));

  return preventDefault;
};

const getSentBody = () => {
  const init = fetchMock.mock.calls[0]?.[1];

  return typeof init?.body === 'string' ? (JSON.parse(init.body) as unknown) : undefined;
};

beforeEach(() => {
  queryClient = createTestQueryClient();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  queryClient.clear();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('useEditProfileForm: валидация', () => {
  it('отменяет нативную отправку формы', () => {
    const { result } = render();

    expect(submit(result, personalFields)).toHaveBeenCalledOnce();
  });

  it('показывает ошибку даты рождения и ничего не отправляет', () => {
    const { result } = render();

    submit(result, { ...personalFields, birthDay: '' });

    expect(result.current.formError).toEqual({
      message: 'Укажите день, месяц и год рождения',
      field: 'birthDate',
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('сбрасывает ошибку валидации при вводе', () => {
    const { result } = render();
    submit(result, { ...personalFields, birthDay: '' });

    act(() => result.current.handleInput());

    expect(result.current.formError).toBeNull();
  });
});

describe('useEditProfileForm: без изменений', () => {
  it('закрывает форму без запроса', () => {
    const { result } = render();

    submit(result, personalFields);

    expect(onClose).toHaveBeenCalledOnce();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('закрывает форму телефона без запроса', () => {
    const { result } = render('phone');

    submit(result, { phone: ` ${profile.phone} ` });

    expect(onClose).toHaveBeenCalledOnce();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('useEditProfileForm: сохранение', () => {
  const updated: Profile = { ...profile, name: 'Мария' };

  beforeEach(() => {
    fetchMock.mockResolvedValue(Response.json(updated));
  });

  it('отправляет только изменённые поля', async () => {
    const { result } = render();

    submit(result, { ...personalFields, name: 'Мария' });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/profile',
      expect.objectContaining({ method: 'PATCH' }),
    );
    expect(getSentBody()).toEqual({ name: 'Мария' });
  });

  it('отправляет null для очищенного поля', async () => {
    const { result } = render('phone');

    submit(result, { phone: '   ' });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(getSentBody()).toEqual({ phone: null });
  });

  it('кладёт ответ сервера в кэш профиля и закрывает форму', async () => {
    const { result } = render();

    submit(result, { ...personalFields, name: 'Мария' });

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
    expect(queryClient.getQueryData(profileQueryOptions(USER_ID).queryKey)).toEqual(updated);
  });
});

describe('useEditProfileForm: ошибка сервера', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(Response.json({ code: 'invalid_phone' }, { status: 400 }));
  });

  it('показывает ошибку у нужного поля и не закрывает форму', async () => {
    const { result } = render('phone');

    submit(result, { phone: '123' });

    await waitFor(() => expect(result.current.formError?.field).toBe('phone'));
    expect(onClose).not.toHaveBeenCalled();
    expect(queryClient.getQueryData(profileQueryOptions(USER_ID).queryKey)).toBeUndefined();
  });

  it('сбрасывает ошибку сервера при вводе', async () => {
    const { result } = render('phone');
    submit(result, { phone: '123' });
    await waitFor(() => expect(result.current.formError).not.toBeNull());

    act(() => result.current.handleInput());

    await waitFor(() => expect(result.current.formError).toBeNull());
  });
});
