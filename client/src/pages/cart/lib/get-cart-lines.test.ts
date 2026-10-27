import { describe, expect, it } from 'vitest';

import type { CartEntry } from '@/entities/cart';
import type { Product } from '@/entities/product';

import type { CartLine } from '../model/cart.types';
import { getCartLines, getCartTotalPrice } from './get-cart-lines';

const createProduct = (id: number, price: number): Product => ({
  id,
  name: `Товар ${id}`,
  description: '',
  price,
  amount: 100,
  rating: 5,
  popularity: 0,
  categoryId: 1,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

const burger = createProduct(1, 350);
const fries = createProduct(2, 150);
const cola = createProduct(3, 99);

const productsById = new Map([burger, fries, cola].map((product) => [product.id, product]));

const entries: CartEntry[] = [
  { productId: 2, quantity: 3 },
  { productId: 1, quantity: 1 },
];

describe('getCartLines', () => {
  it('соединяет позиции корзины с товарами, сохраняя порядок корзины', () => {
    expect(getCartLines(entries, productsById)).toEqual([
      { product: fries, entry: entries[0] },
      { product: burger, entry: entries[1] },
    ]);
  });

  it('передаёт товар и позицию по ссылке', () => {
    const [line] = getCartLines(entries, productsById);

    expect(line?.product).toBe(fries);
    expect(line?.entry).toBe(entries[0]);
  });

  it('пропускает позиции, для которых товар не найден', () => {
    const withUnknown: CartEntry[] = [...entries, { productId: 99, quantity: 2 }];

    expect(getCartLines(withUnknown, productsById)).toHaveLength(2);
  });

  it('возвращает пустой список, пока товары не загружены', () => {
    expect(getCartLines(entries, undefined)).toEqual([]);
  });

  it('возвращает пустой список для пустой корзины', () => {
    expect(getCartLines([], productsById)).toEqual([]);
  });
});

describe('getCartTotalPrice', () => {
  it('суммирует цену с учётом количества', () => {
    const lines = getCartLines(entries, productsById);

    expect(getCartTotalPrice(lines)).toBe(150 * 3 + 350);
  });

  it('возвращает 0 для пустого списка', () => {
    expect(getCartTotalPrice([])).toBe(0);
  });

  it('не учитывает позиции без товара', () => {
    const withUnknown: CartEntry[] = [{ productId: 99, quantity: 5 }, ...entries];

    expect(getCartTotalPrice(getCartLines(withUnknown, productsById))).toBe(150 * 3 + 350);
  });

  it('умножает цену на количество для одной позиции', () => {
    const lines: CartLine[] = [{ product: cola, entry: { productId: 3, quantity: 7 } }];

    expect(getCartTotalPrice(lines)).toBe(693);
  });
});
