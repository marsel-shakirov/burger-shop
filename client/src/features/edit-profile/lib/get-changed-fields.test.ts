import { describe, expect, it } from 'vitest';

import type { Profile } from '@/entities/profile';

import { getChangedFields } from './get-changed-fields';

const profile: Profile = {
  name: 'Марсель',
  phone: '+7 999 123-45-67',
  birthDate: '1990-03-07',
  gender: 'male',
};

describe('getChangedFields', () => {
  it('возвращает только изменённые поля', () => {
    expect(
      getChangedFields(profile, { name: 'Марсель', birthDate: '1991-03-07', gender: null }),
    ).toEqual({ birthDate: '1991-03-07', gender: null });
  });

  it('возвращает пустой объект, если ничего не изменилось', () => {
    expect(
      getChangedFields(profile, { name: 'Марсель', birthDate: '1990-03-07', gender: 'male' }),
    ).toEqual({});
  });

  it('не добавляет поля, которых нет в обновлении', () => {
    expect(getChangedFields(profile, { name: 'Иван' })).toEqual({ name: 'Иван' });
  });

  it('считает заполнение пустого поля изменением', () => {
    expect(getChangedFields({ ...profile, phone: null }, { phone: '+7 999' })).toEqual({
      phone: '+7 999',
    });
  });

  it('возвращает пустой объект для пустого обновления', () => {
    expect(getChangedFields(profile, {})).toEqual({});
  });
});
