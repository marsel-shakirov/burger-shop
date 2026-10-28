import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { createSupabase } from '../../supabase.ts';
import { api } from '../../testing/http.ts';
import { claimsResult, createSupabaseMock } from '../../testing/supabase-mock.ts';
import { addFavoriteUseCase } from './add-favorite.use-case.ts';
import { getFavoritesUseCase } from './get-favorites.use-case.ts';
import { mergeFavoritesUseCase } from './merge-favorites.use-case.ts';
import { removeFavoriteUseCase } from './remove-favorite.use-case.ts';

vi.mock('../../supabase.ts', () => ({ createSupabase: vi.fn(), createStatelessSupabase: vi.fn() }));

vi.mock('./add-favorite.use-case.ts', () => ({ addFavoriteUseCase: vi.fn() }));
vi.mock('./get-favorites.use-case.ts', () => ({ getFavoritesUseCase: vi.fn() }));
vi.mock('./merge-favorites.use-case.ts', () => ({ mergeFavoritesUseCase: vi.fn() }));
vi.mock('./remove-favorite.use-case.ts', () => ({ removeFavoriteUseCase: vi.fn() }));

beforeEach(() => {
  const supabase = createSupabaseMock();
  supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1' }));
  vi.mocked(createSupabase).mockReturnValue(supabase.client);
});

describe('GET /api/favorites', () => {
  it('отдаёт избранное пользователя', async () => {
    vi.mocked(getFavoritesUseCase).mockResolvedValue({ productIds: [7, 2] });

    const response = await api().get('/api/favorites');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ productIds: [7, 2] });
    expect(getFavoritesUseCase).toHaveBeenCalledWith('user-1');
  });
});

describe('PUT /api/favorites/:productId', () => {
  it('добавляет товар и отвечает 204', async () => {
    const response = await api().put('/api/favorites/5');

    expect(response.status).toBe(204);
    expect(addFavoriteUseCase).toHaveBeenCalledWith('user-1', 5);
  });

  it.each(['abc', '0', '-1'])('отвечает 400 на id «%s»', async (productId) => {
    const response = await api().put(`/api/favorites/${productId}`);

    expect(response.status).toBe(400);
    expect(addFavoriteUseCase).not.toHaveBeenCalled();
  });

  it('отдаёт product_not_found, если товара нет', async () => {
    vi.mocked(addFavoriteUseCase).mockRejectedValue(
      new BadRequest('Product not found', 'product_not_found'),
    );

    const response = await api().put('/api/favorites/999');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Product not found', code: 'product_not_found' });
  });
});

describe('DELETE /api/favorites/:productId', () => {
  it('удаляет товар и отвечает 204', async () => {
    const response = await api().delete('/api/favorites/5');

    expect(response.status).toBe(204);
    expect(removeFavoriteUseCase).toHaveBeenCalledWith('user-1', 5);
  });

  it('отвечает 400 на некорректный id', async () => {
    const response = await api().delete('/api/favorites/abc');

    expect(response.status).toBe(400);
    expect(removeFavoriteUseCase).not.toHaveBeenCalled();
  });
});

describe('POST /api/favorites/merge', () => {
  it('объединяет избранное и отдаёт итоговый список', async () => {
    vi.mocked(mergeFavoritesUseCase).mockResolvedValue({ productIds: [5, 7] });

    const response = await api()
      .post('/api/favorites/merge')
      .send({ productIds: [5] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ productIds: [5, 7] });
    expect(mergeFavoritesUseCase).toHaveBeenCalledWith('user-1', [5]);
  });

  it.each([
    ['нет productIds', {}],
    ['некорректный id', { productIds: [0] }],
  ])('отвечает 400: %s', async (_case, body) => {
    const response = await api().post('/api/favorites/merge').send(body);

    expect(response.status).toBe(400);
    expect(mergeFavoritesUseCase).not.toHaveBeenCalled();
  });
});
