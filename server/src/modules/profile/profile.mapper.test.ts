import { describe, expect, it } from 'vitest';

import { toProfileResponse } from './profile.mapper.ts';

describe('toProfileResponse', () => {
  it('переводит строку профиля в ответ без id', () => {
    expect(
      toProfileResponse({
        id: 'user-1',
        name: 'Иван',
        phone: '+79991234567',
        birth_date: '1990-05-17',
        gender: 'male',
      }),
    ).toEqual({ name: 'Иван', phone: '+79991234567', birthDate: '1990-05-17', gender: 'male' });
  });

  it('сохраняет пустые поля как null', () => {
    expect(
      toProfileResponse({ id: 'user-1', name: null, phone: null, birth_date: null, gender: null }),
    ).toEqual({ name: null, phone: null, birthDate: null, gender: null });
  });
});
