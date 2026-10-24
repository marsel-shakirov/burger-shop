import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { SAME_PASSWORD_MESSAGE } from '../config/change-password.constants';
import { ChangePasswordModal } from './change-password-modal';

const fetchMock = vi.fn<typeof fetch>();

const onClose = vi.fn();

const onChanged = vi.fn();

const renderModal = (open = true) =>
  render(
    <ChangePasswordModal
      email="user@example.com"
      open={open}
      onClose={onClose}
      onChanged={onChanged}
    />,
    { wrapper: createWrapper() },
  );

const getField = (label: string) => screen.getByLabelText<HTMLInputElement>(label);

const fillAndSubmit = (current: string, next: string, confirm = next) => {
  fireEvent.change(getField('Текущий пароль'), { target: { value: current } });
  fireEvent.change(getField('Новый пароль'), { target: { value: next } });
  fireEvent.change(getField('Повторите пароль'), { target: { value: confirm } });
  fireEvent.submit(screen.getByRole('button', { name: 'Сменить пароль' }));
};

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('ChangePasswordModal', () => {
  it('открывает диалог «Смена пароля»', () => {
    renderModal();

    expect(screen.getByRole('dialog', { name: 'Смена пароля' })).toHaveProperty('open', true);
  });

  it('передаёт email для менеджера паролей в скрытом поле', () => {
    const { container } = renderModal();

    expect(container.querySelector('input[autocomplete="username"]')).toHaveProperty(
      'value',
      'user@example.com',
    );
  });

  it('показывает ошибку валидации у нового пароля', () => {
    renderModal();

    fillAndSubmit('old-password', 'old-password');

    expect(screen.getByRole('alert').textContent).toBe(SAME_PASSWORD_MESSAGE);
    expect(getField('Новый пароль').getAttribute('aria-invalid')).toBe('true');
    expect(getField('Текущий пароль').hasAttribute('aria-invalid')).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('показывает ошибку сервера у текущего пароля', async () => {
    fetchMock.mockResolvedValue(
      Response.json({ code: 'invalid_current_password' }, { status: 400 }),
    );
    renderModal();

    fillAndSubmit('wrong-password', 'new-password');

    expect((await screen.findByRole('alert')).textContent).toBe('Текущий пароль указан неверно');
    expect(getField('Текущий пароль').getAttribute('aria-invalid')).toBe('true');
    expect(onChanged).not.toHaveBeenCalled();
  });

  it('после смены пароля вызывает onChanged', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    renderModal();

    fillAndSubmit('old-password', 'new-password');

    await waitFor(() => expect(onChanged).toHaveBeenCalledOnce());
  });

  it('пока идёт запрос, показывает «Сохраняем…»', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    renderModal();

    fillAndSubmit('old-password', 'new-password');

    expect(await screen.findByRole('button', { name: 'Сохраняем…' })).toHaveProperty(
      'disabled',
      true,
    );
  });

  it('кнопка «Закрыть» вызывает onClose', () => {
    renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
