import { describe, expect, it, vi } from 'vitest';

import { toProductImage } from '../../lib/product-image.ts';
import { getProductsUseCase } from './get-products.use-case.ts';
import { findProducts } from './products.repository.ts';

vi.mock('./products.repository.ts', () => ({ findProducts: vi.fn() }));

describe('getProductsUseCase', () => {
  it('передаёт фильтры и колонку сортировки в репозиторий', async () => {
    vi.mocked(findProducts).mockResolvedValue([]);

    await getProductsUseCase({ menu: 'burgers', category: 'classic', sort: 'price', order: 'asc' });

    expect(findProducts).toHaveBeenCalledWith({
      menu: 'burgers',
      category: 'classic',
      orderColumn: 'price',
      order: 'asc',
    });
  });

  it.each(['popularity', 'price', 'rating'] as const)('сортирует по колонке %s', async (sort) => {
    vi.mocked(findProducts).mockResolvedValue([]);

    await getProductsUseCase({ sort, order: 'desc' });

    expect(findProducts).toHaveBeenCalledWith(expect.objectContaining({ orderColumn: sort }));
  });

  it('возвращает товары в формате ответа', async () => {
    vi.mocked(findProducts).mockResolvedValue([
      {
        id: 1,
        name: 'Классический',
        description: 'Говядина, сыр, соус',
        price: 390,
        amount: 250,
        unit: 'g',
        rating: 4.8,
        popularity: 120,
        category_id: 3,
        image_path: 'burgers/classic',
      },
    ]);

    await expect(getProductsUseCase({ sort: 'rating', order: 'desc' })).resolves.toEqual([
      {
        id: 1,
        name: 'Классический',
        description: 'Говядина, сыр, соус',
        price: 390,
        amount: 250,
        unit: 'g',
        rating: 4.8,
        popularity: 120,
        categoryId: 3,
        ...toProductImage('burgers/classic'),
      },
    ]);
  });
});
