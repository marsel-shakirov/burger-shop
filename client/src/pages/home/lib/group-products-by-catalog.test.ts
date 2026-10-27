import { describe, expect, it } from 'vitest';

import type { Menu } from '@/entities/menu';
import type { Product } from '@/entities/product';

import { groupProductsByCatalog } from './group-products-by-catalog';

const createProduct = (id: number, categoryId: number): Product => ({
  id,
  name: `Товар ${id}`,
  description: '',
  price: 100,
  amount: 200,
  rating: 4.5,
  popularity: 10,
  categoryId,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

const beef = { id: 11, slug: 'beef', name: 'Говядина' };
const chicken = { id: 12, slug: 'chicken', name: 'Курица' };
const cola = { id: 21, slug: 'cola', name: 'Кола' };

const menus: Menu[] = [
  { id: 1, slug: 'burgers', name: 'Бургеры', categories: [beef, chicken] },
  { id: 2, slug: 'drinks', name: 'Напитки', categories: [cola] },
];

const getIds = (products: Product[]) => products.map(({ id }) => id);

describe('groupProductsByCatalog', () => {
  it('раскладывает товары по меню и категориям в порядке меню', () => {
    const products = [createProduct(1, 21), createProduct(2, 12), createProduct(3, 11)];

    const groups = groupProductsByCatalog(menus, products);

    expect(groups.map(({ menu }) => menu.slug)).toEqual(['burgers', 'drinks']);
    expect(
      groups[0]?.categories.map(({ category, products }) => [category.slug, getIds(products)]),
    ).toEqual([
      ['beef', [3]],
      ['chicken', [2]],
    ]);
    expect(groups[1]?.categories[0]?.category).toBe(cola);
  });

  it('сохраняет порядок товаров внутри категории', () => {
    const products = [createProduct(5, 11), createProduct(2, 11), createProduct(9, 11)];

    expect(
      getIds(groupProductsByCatalog(menus, products)[0]?.categories[0]?.products ?? []),
    ).toEqual([5, 2, 9]);
  });

  it('пропускает пустые категории и меню без товаров', () => {
    const groups = groupProductsByCatalog(menus, [createProduct(1, 12)]);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.categories.map(({ category }) => category.slug)).toEqual(['chicken']);
  });

  it('пропускает товары неизвестных категорий', () => {
    expect(groupProductsByCatalog(menus, [createProduct(1, 99)])).toEqual([]);
  });
});
