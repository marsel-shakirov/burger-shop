import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { SAME_EMAIL_MESSAGE } from '../config/change-email.constants';
import { ChangeEmailModal } from './change-email-modal';

const fetchMock = vi.fn<typeof fetch>();

const onClose = vi.fn();

const onRequested = vi.fn();

const renderModal = () =>
  render(
    <ChangeEmailModal email="user@example.com" open onClose={onClose} onRequested={onRequested} />,
    { wrapper: createWrapper() },
  );

const getField = (label: string) => screen.getByLabelText<HTMLInputElement>(label);

const fillAndSubmit = (newEmail: string, currentPassword = 'old-password') => {
  fireEvent.change(getField('Новый email'), { target: { value: newEmail } });
  fireEvent.change(getField('Текущий пароль'), { target: { value: currentPassword } });
  fireEvent.submit(screen.getByRole('button', { name: 'Отправить письмо' }));
};

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('ChangeEmailModal', () => {
  it('открывает диалог «Смена email»', () => {
    renderModal();

    expect(screen.getByRole('dialog', { name: 'Смена email' })).toHaveProperty('open', true);
  });

  it('передаёт email для менеджера паролей в скрытом поле', () => {
    const { container } = renderModal();

    expect(container.querySelector('input[autocomplete="username"]')).toHaveProperty(
      'value',
      'user@example.com',
    );
  });

  it('показывает ошибку валидации у нового email', () => {
    renderModal();

    fillAndSubmit('user@example.com');

    expect(screen.getByRole('alert').textContent).toBe(SAME_EMAIL_MESSAGE);
    expect(getField('Новый email').getAttribute('aria-invalid')).toBe('true');
    expect(getField('Текущий пароль').hasAttribute('aria-invalid')).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('показывает ошибку сервера у текущего пароля', async () => {
    fetchMock.mockResolvedValue(
      Response.json({ code: 'invalid_current_password' }, { status: 400 }),
    );
    renderModal();

    fillAndSubmit('new@example.com', 'wrong-password');

    expect((await screen.findByRole('alert')).textContent).toBe('Текущий пароль указан неверно');
    expect(getField('Текущий пароль').getAttribute('aria-invalid')).toBe('true');
    expect(onRequested).not.toHaveBeenCalled();
  });

  it('после отправки письма вызывает onRequested с новым email', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    renderModal();

    fillAndSubmit('new@example.com');

    await waitFor(() => expect(onRequested).toHaveBeenCalledWith('new@example.com'));
  });

  it('пока идёт запрос, показывает «Отправляем…»', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    renderModal();

    fillAndSubmit('new@example.com');

    expect(await screen.findByRole('button', { name: 'Отправляем…' })).toHaveProperty(
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
