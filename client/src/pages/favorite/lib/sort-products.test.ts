import { describe, expect, it } from 'vitest';

import type { Product } from '@/entities/product';

import { sortProducts } from './sort-products';

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

const products = [
  createProduct({ id: 1, name: 'Чизбургер', price: 250, rating: 4.2, popularity: 300 }),
  createProduct({ id: 2, name: 'Биг Бургер', price: 490, rating: 4.9, popularity: 800 }),
  createProduct({ id: 3, name: 'Кола', price: 120, rating: 4.6, popularity: 500 }),
];

const getNames = (list: Product[]) => list.map((product) => product.name);

describe('sortProducts', () => {
  it('по дате добавления оставляет исходный порядок', () => {
    expect(getNames(sortProducts(products, { sort: 'added', order: 'desc' }))).toEqual([
      'Чизбургер',
      'Биг Бургер',
      'Кола',
    ]);
  });

  it.each([
    ['popularity', 'desc', ['Биг Бургер', 'Кола', 'Чизбургер']],
    ['rating', 'desc', ['Биг Бургер', 'Кола', 'Чизбургер']],
    ['price', 'asc', ['Кола', 'Чизбургер', 'Биг Бургер']],
    ['price', 'desc', ['Биг Бургер', 'Чизбургер', 'Кола']],
  ] as const)('сортирует по %s %s', (sort, order, expected) => {
    expect(getNames(sortProducts(products, { sort, order }))).toEqual(expected);
  });

  it('при равных значениях сохраняет порядок добавления', () => {
    const samePrice = [
      createProduct({ id: 1, name: 'Чизбургер', price: 250 }),
      createProduct({ id: 2, name: 'Кола', price: 250 }),
    ];

    expect(getNames(sortProducts(samePrice, { sort: 'price', order: 'asc' }))).toEqual([
      'Чизбургер',
      'Кола',
    ]);
  });

  it('не изменяет исходный массив', () => {
    const original = [...products];

    sortProducts(products, { sort: 'price', order: 'asc' });

    expect(products).toEqual(original);
  });
});
