import { describe, expect, it } from 'vitest';

import type { Product } from '@/entities/product';

import { getSortHighlights } from './get-sort-highlights';

const createProduct = (overrides: Partial<Product>): Product => ({
  id: 1,
  name: 'Бургер',
  description: '',
  price: 300,
  amount: 250,
  rating: 4.5,
  popularity: 100,
  category_id: 1,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
  ...overrides,
});

describe('getSortHighlights', () => {
  it('возвращает undefined для пустого списка', () => {
    expect(getSortHighlights([])).toBeUndefined();
  });

  it('находит последний добавленный и самый популярный товар, лучший рейтинг и диапазон цен', () => {
    const products = [
      createProduct({ id: 1, name: 'Чизбургер', price: 250, rating: 4.2, popularity: 300 }),
      createProduct({ id: 2, name: 'Биг Бургер', price: 490, rating: 4.9, popularity: 800 }),
      createProduct({ id: 3, name: 'Кола', price: 120, rating: 4.6, popularity: 500 }),
    ];

    expect(getSortHighlights(products)).toEqual({
      lastAddedName: 'Чизбургер',
      mostPopularName: 'Биг Бургер',
      topRating: 4.9,
      minPrice: 120,
      maxPrice: 490,
    });
  });

  it('для одного товара берёт все значения из него', () => {
    const product = createProduct({ name: 'Кола', price: 120, rating: 4.6 });

    expect(getSortHighlights([product])).toEqual({
      lastAddedName: 'Кола',
      mostPopularName: 'Кола',
      topRating: 4.6,
      minPrice: 120,
      maxPrice: 120,
    });
  });

  it('при одинаковой популярности выбирает первый товар', () => {
    const products = [
      createProduct({ id: 1, name: 'Чизбургер', popularity: 500 }),
      createProduct({ id: 2, name: 'Кола', popularity: 500 }),
    ];

    expect(getSortHighlights(products)?.mostPopularName).toBe('Чизбургер');
  });
});
