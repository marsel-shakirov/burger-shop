import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../../app.ts';
import { createSupabase } from '../../supabase.ts';
import { getProductsUseCase } from './get-products.use-case.ts';

vi.mock('../../supabase.ts', () => ({ createSupabase: vi.fn(), createStatelessSupabase: vi.fn() }));

vi.mock('./get-products.use-case.ts', () => ({ getProductsUseCase: vi.fn() }));

describe('GET /api/products', () => {
  it('отдаёт товары без сессии с сортировкой по умолчанию', async () => {
    vi.mocked(getProductsUseCase).mockResolvedValue([]);

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(getProductsUseCase).toHaveBeenCalledWith({ sort: 'rating', order: 'desc' });
    expect(createSupabase).not.toHaveBeenCalled();
  });

  it('передаёт фильтры и сортировку из query', async () => {
    vi.mocked(getProductsUseCase).mockResolvedValue([]);

    await request(app).get('/api/products?menu=burgers&category=classic&sort=price&order=asc');

    expect(getProductsUseCase).toHaveBeenCalledWith({
      menu: 'burgers',
      category: 'classic',
      sort: 'price',
      order: 'asc',
    });
  });

  it.each([
    ['неизвестная сортировка', '?sort=name'],
    ['некорректный slug', '?menu=Burgers'],
    ['несколько меню', '?menu=burgers&menu=drinks'],
  ])('отвечает 400: %s', async (_case, query) => {
    const response = await request(app).get(`/api/products${query}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bad request' });
    expect(getProductsUseCase).not.toHaveBeenCalled();
  });
});
