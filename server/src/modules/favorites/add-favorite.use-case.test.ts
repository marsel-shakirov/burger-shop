import { describe, expect, it, vi } from 'vitest';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { foreignKeyError } from '../../testing/database-error.ts';
import { addFavoriteUseCase } from './add-favorite.use-case.ts';
import { FAVORITES_PRODUCT_FK } from './favorites.constants.ts';
import { insertFavorite } from './favorites.repository.ts';

vi.mock('./favorites.repository.ts', () => ({ insertFavorite: vi.fn() }));

describe('addFavoriteUseCase', () => {
  it('добавляет товар в избранное пользователя', async () => {
    await addFavoriteUseCase('user-1', 5);

    expect(insertFavorite).toHaveBeenCalledWith('user-1', 5);
  });

  it('бросает BadRequest product_not_found, если товара нет', async () => {
    vi.mocked(insertFavorite).mockRejectedValue(foreignKeyError(FAVORITES_PRODUCT_FK));

    const error = await addFavoriteUseCase('user-1', 999).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequest);
    expect(error).toMatchObject({ code: 'product_not_found' });
  });

  it('бросает Unauthorized, если пользователя нет', async () => {
    vi.mocked(insertFavorite).mockRejectedValue(foreignKeyError('favorites_user_id_fkey'));

    await expect(addFavoriteUseCase('user-1', 5)).rejects.toBeInstanceOf(Unauthorized);
  });

  it('пробрасывает остальные ошибки без изменений', async () => {
    const dbError = new Error('connection lost');
    vi.mocked(insertFavorite).mockRejectedValue(dbError);

    await expect(addFavoriteUseCase('user-1', 5)).rejects.toBe(dbError);
  });
});
