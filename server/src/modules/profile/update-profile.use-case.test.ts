import { describe, expect, it, vi } from 'vitest';

import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { upsertProfile } from './profile.repository.ts';
import { updateProfileUseCase } from './update-profile.use-case.ts';

vi.mock('./profile.repository.ts', () => ({ upsertProfile: vi.fn() }));

describe('updateProfileUseCase', () => {
  it('сохраняет изменения и возвращает обновлённый профиль', async () => {
    vi.mocked(upsertProfile).mockResolvedValue({
      id: 'user-1',
      name: 'Иван',
      phone: '+79991234567',
      birth_date: null,
      gender: null,
    });

    await expect(
      updateProfileUseCase('user-1', { name: 'Иван', phone: '+79991234567' }),
    ).resolves.toEqual({ name: 'Иван', phone: '+79991234567', birthDate: null, gender: null });
    expect(upsertProfile).toHaveBeenCalledWith('user-1', {
      name: 'Иван',
      phone: '+79991234567',
    });
  });

  it('бросает Unauthorized, если профиль не сохранился', async () => {
    vi.mocked(upsertProfile).mockResolvedValue(undefined);

    await expect(updateProfileUseCase('user-1', { name: 'Иван' })).rejects.toBeInstanceOf(
      Unauthorized,
    );
  });
});
