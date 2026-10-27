import { describe, expect, it } from 'vitest';

import type { Product } from '@/entities/product';

import { getCategoryLeaders } from './get-category-leaders';

const createProduct = (id: number, categoryId: number, popularity: number): Product => ({
  id,
  name: `Товар ${id}`,
  description: '',
  price: 100,
  amount: 100,
  rating: 5,
  popularity,
  categoryId,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

const getIds = (products: Product[]) => products.map((product) => product.id);

describe('getCategoryLeaders', () => {
  it('берёт самый популярный товар из каждой категории', () => {
    const products = [
      createProduct(1, 10, 5),
      createProduct(2, 10, 50),
      createProduct(3, 20, 30),
      createProduct(4, 20, 10),
    ];

    expect(getIds(getCategoryLeaders(products, 4))).toEqual([2, 3]);
  });

  it('упорядочивает лидеров по убыванию популярности', () => {
    const products = [createProduct(1, 10, 5), createProduct(2, 20, 40), createProduct(3, 30, 20)];

    expect(getIds(getCategoryLeaders(products, 4))).toEqual([2, 3, 1]);
  });

  it('ограничивает количество лидеров', () => {
    const products = [
      createProduct(1, 10, 10),
      createProduct(2, 20, 20),
      createProduct(3, 30, 30),
      createProduct(4, 40, 40),
      createProduct(5, 50, 50),
    ];

    expect(getIds(getCategoryLeaders(products, 2))).toEqual([5, 4]);
  });

  it('при равной популярности оставляет товар, который идёт раньше', () => {
    const products = [createProduct(1, 10, 20), createProduct(2, 10, 20)];

    expect(getIds(getCategoryLeaders(products, 4))).toEqual([1]);
  });

  it('возвращает пустой список без товаров', () => {
    expect(getCategoryLeaders([], 4)).toEqual([]);
  });

  it('возвращает пустой список при лимите 0', () => {
    expect(getCategoryLeaders([createProduct(1, 10, 10)], 0)).toEqual([]);
  });

  it('не изменяет порядок исходного массива', () => {
    const products = [createProduct(1, 10, 5), createProduct(2, 20, 50)];
    const before = [...products];

    getCategoryLeaders(products, 4);

    expect(products).toEqual(before);
  });
});
