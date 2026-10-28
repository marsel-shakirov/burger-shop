import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { foreignKeyError } from '../../testing/database-error.ts';
import { FAVORITES_PRODUCT_FK } from './favorites.constants.ts';
import { findFavorites, insertFavorites } from './favorites.repository.ts';
import { mergeFavoritesUseCase } from './merge-favorites.use-case.ts';

vi.mock('./favorites.repository.ts', () => ({ findFavorites: vi.fn(), insertFavorites: vi.fn() }));

beforeEach(() => {
  vi.mocked(findFavorites).mockResolvedValue([{ product_id: 5 }, { product_id: 7 }]);
});

describe('mergeFavoritesUseCase', () => {
  it('добавляет гостевое избранное и возвращает итоговый список', async () => {
    await expect(mergeFavoritesUseCase('user-1', [5, 7])).resolves.toEqual({
      productIds: [5, 7],
    });
    expect(insertFavorites).toHaveBeenCalledWith('user-1', [5, 7]);
    expect(vi.mocked(insertFavorites).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(findFavorites).mock.invocationCallOrder[0],
    );
  });

  it('без гостевого избранного только возвращает список', async () => {
    await mergeFavoritesUseCase('user-1', []);

    expect(insertFavorites).not.toHaveBeenCalled();
    expect(findFavorites).toHaveBeenCalledWith('user-1');
  });

  it('бросает BadRequest product_not_found и не читает список, если товара нет', async () => {
    vi.mocked(insertFavorites).mockRejectedValue(foreignKeyError(FAVORITES_PRODUCT_FK));

    const error = await mergeFavoritesUseCase('user-1', [999]).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequest);
    expect(error).toMatchObject({ code: 'product_not_found' });
    expect(findFavorites).not.toHaveBeenCalled();
  });

  it('бросает Unauthorized, если пользователя нет', async () => {
    vi.mocked(insertFavorites).mockRejectedValue(foreignKeyError('favorites_user_id_fkey'));

    await expect(mergeFavoritesUseCase('user-1', [5])).rejects.toBeInstanceOf(Unauthorized);
  });

  it('пробрасывает остальные ошибки без изменений', async () => {
    const dbError = new Error('connection lost');
    vi.mocked(insertFavorites).mockRejectedValue(dbError);

    await expect(mergeFavoritesUseCase('user-1', [5])).rejects.toBe(dbError);
  });
});
