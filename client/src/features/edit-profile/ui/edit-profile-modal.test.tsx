import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Profile } from '@/entities/profile';
import { createWrapper } from '@/shared/testing';

import type { ProfileSection } from '../model/edit-profile.types';
import { EditProfileModal } from './edit-profile-modal';

const profile: Profile = {
  name: 'Анна',
  phone: '+79990000000',
  birthDate: '1990-05-07',
  gender: 'female',
};

const fetchMock = vi.fn<typeof fetch>();

const onClose = vi.fn();

const renderModal = (section: ProfileSection, value: Profile = profile) =>
  render(
    <EditProfileModal userId="user-1" profile={value} section={section} open onClose={onClose} />,
    { wrapper: createWrapper() },
  );

const getField = (label: string) => screen.getByLabelText<HTMLInputElement>(label);

const submit = () => fireEvent.submit(screen.getByRole('button', { name: 'Сохранить' }));

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('EditProfileModal: личные данные', () => {
  it('заполняет поля текущими данными', () => {
    renderModal('personal');

    expect(screen.getByRole('dialog', { name: 'Личные данные' })).toBeDefined();
    expect(getField('Имя').value).toBe('Анна');
    expect(getField('День').value).toBe('7');
    expect(screen.getByLabelText<HTMLSelectElement>('Месяц').value).toBe('5');
    expect(getField('Год').value).toBe('1990');
    expect(screen.getByRole('radio', { name: 'Женский' })).toHaveProperty('checked', true);
  });

  it('для пустого профиля выбирает «Не указывать» и оставляет поля пустыми', () => {
    renderModal('personal', { name: null, phone: null, birthDate: null, gender: null });

    expect(getField('Имя').value).toBe('');
    expect(getField('День').value).toBe('');
    expect(screen.getByRole('radio', { name: 'Не указывать' })).toHaveProperty('checked', true);
  });

  it('при неполной дате помечает все части даты и показывает ошибку', () => {
    renderModal('personal');

    fireEvent.change(getField('День'), { target: { value: '' } });
    submit();

    expect(screen.getByRole('alert').textContent).toBe('Укажите день, месяц и год рождения');
    for (const label of ['День', 'Месяц', 'Год']) {
      expect(screen.getByLabelText(label).getAttribute('aria-invalid')).toBe('true');
    }
    expect(getField('Имя').hasAttribute('aria-invalid')).toBe(false);
  });

  it('без изменений закрывает модалку без запроса', () => {
    renderModal('personal');

    submit();

    expect(onClose).toHaveBeenCalledOnce();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('сохраняет изменённый пол', async () => {
    fetchMock.mockResolvedValue(Response.json({ ...profile, gender: 'male' }));
    renderModal('personal');

    fireEvent.click(screen.getByRole('radio', { name: 'Мужской' }));
    submit();

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(JSON.stringify({ gender: 'male' }));
  });

  it('при ошибке сервера помечает группу «Пол»', async () => {
    fetchMock.mockResolvedValue(Response.json({ code: 'invalid_gender' }, { status: 400 }));
    renderModal('personal');

    fireEvent.click(screen.getByRole('radio', { name: 'Мужской' }));
    submit();

    expect((await screen.findByRole('alert')).textContent).toBe('Выберите пол из списка');
    expect(screen.getByRole('radiogroup', { name: 'Пол' }).getAttribute('aria-invalid')).toBe(
      'true',
    );
  });
});

describe('EditProfileModal: телефон', () => {
  it('показывает только поле телефона', () => {
    renderModal('phone');

    const dialog = screen.getByRole('dialog', { name: 'Телефон' });

    expect(getField('Номер для связи по заказам').value).toBe('+79990000000');
    expect(within(dialog).queryByLabelText('Имя')).toBeNull();
  });

  it('при ошибке сервера помечает поле телефона', async () => {
    fetchMock.mockResolvedValue(Response.json({ code: 'invalid_phone' }, { status: 400 }));
    renderModal('phone');

    fireEvent.change(getField('Номер для связи по заказам'), { target: { value: '123' } });
    submit();

    expect((await screen.findByRole('alert')).textContent).toMatch(/Проверьте номер/);
    expect(getField('Номер для связи по заказам').getAttribute('aria-invalid')).toBe('true');
    expect(onClose).not.toHaveBeenCalled();
  });
});
