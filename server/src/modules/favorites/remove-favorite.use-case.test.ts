import { describe, expect, it, vi } from 'vitest';

import { deleteFavorite } from './favorites.repository.ts';
import { removeFavoriteUseCase } from './remove-favorite.use-case.ts';

vi.mock('./favorites.repository.ts', () => ({ deleteFavorite: vi.fn() }));

describe('removeFavoriteUseCase', () => {
  it('удаляет товар из избранного пользователя', async () => {
    await removeFavoriteUseCase('user-1', 5);

    expect(deleteFavorite).toHaveBeenCalledWith('user-1', 5);
  });
});
