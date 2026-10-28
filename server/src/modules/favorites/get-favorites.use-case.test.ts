import { describe, expect, it, vi } from 'vitest';

import { findFavorites } from './favorites.repository.ts';
import { getFavoritesUseCase } from './get-favorites.use-case.ts';

vi.mock('./favorites.repository.ts', () => ({ findFavorites: vi.fn() }));

describe('getFavoritesUseCase', () => {
  it('возвращает избранное пользователя', async () => {
    vi.mocked(findFavorites).mockResolvedValue([{ product_id: 7 }, { product_id: 2 }]);

    await expect(getFavoritesUseCase('user-1')).resolves.toEqual({ productIds: [7, 2] });
    expect(findFavorites).toHaveBeenCalledWith('user-1');
  });
});
