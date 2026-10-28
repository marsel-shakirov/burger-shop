import { describe, expect, it, vi } from 'vitest';

import { getProfileUseCase } from './get-profile.use-case.ts';
import { EMPTY_PROFILE } from './profile.constants.ts';
import { findProfile } from './profile.repository.ts';

vi.mock('./profile.repository.ts', () => ({ findProfile: vi.fn() }));

describe('getProfileUseCase', () => {
  it('возвращает профиль пользователя', async () => {
    vi.mocked(findProfile).mockResolvedValue({
      id: 'user-1',
      name: 'Иван',
      phone: null,
      birth_date: '1990-05-17',
      gender: 'male',
    });

    await expect(getProfileUseCase('user-1')).resolves.toEqual({
      name: 'Иван',
      phone: null,
      birthDate: '1990-05-17',
      gender: 'male',
    });
    expect(findProfile).toHaveBeenCalledWith('user-1');
  });

  it('возвращает пустой профиль, если пользователь его ещё не заполнял', async () => {
    vi.mocked(findProfile).mockResolvedValue(undefined);

    await expect(getProfileUseCase('user-1')).resolves.toEqual(EMPTY_PROFILE);
  });
});
