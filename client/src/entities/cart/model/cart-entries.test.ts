import { describe, expect, it } from 'vitest';

import type { CartEntry } from './cart.types';
import {
  findCartEntryByProductId,
  getProductQuantity,
  getTotalQuantity,
  setEntryQuantity,
} from './cart-entries';

const items: CartEntry[] = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
  { productId: 3, quantity: 5 },
];

const duplicated: CartEntry[] = [
  { productId: 1, quantity: 1 },
  { productId: 1, quantity: 7 },
];

describe('findCartEntryByProductId', () => {
  it('возвращает позицию с нужным productId', () => {
    expect(findCartEntryByProductId(items, 2)).toEqual({ productId: 2, quantity: 1 });
  });

  it('возвращает ту же ссылку на объект, а не копию', () => {
    expect(findCartEntryByProductId(items, 3)).toBe(items[2]);
  });

  it('возвращает undefined, если товара нет в корзине', () => {
    expect(findCartEntryByProductId(items, 99)).toBeUndefined();
  });

  it('возвращает undefined для пустой корзины', () => {
    expect(findCartEntryByProductId([], 1)).toBeUndefined();
  });

  it('возвращает первую позицию, если productId повторяется', () => {
    expect(findCartEntryByProductId(duplicated, 1)).toBe(duplicated[0]);
  });
});

describe('getProductQuantity', () => {
  it('возвращает количество товара в корзине', () => {
    expect(getProductQuantity(items, 3)).toBe(5);
  });

  it('возвращает 0, если товара нет в корзине', () => {
    expect(getProductQuantity(items, 99)).toBe(0);
  });

  it('возвращает 0 для пустой корзины', () => {
    expect(getProductQuantity([], 1)).toBe(0);
  });

  it('возвращает количество первой позиции, если productId повторяется', () => {
    expect(getProductQuantity(duplicated, 1)).toBe(1);
  });
});

describe('getTotalQuantity', () => {
  it('суммирует количество всех позиций', () => {
    expect(getTotalQuantity(items)).toBe(8);
  });

  it('возвращает 0 для пустой корзины', () => {
    expect(getTotalQuantity([])).toBe(0);
  });

  it('возвращает количество единственной позиции', () => {
    expect(getTotalQuantity([{ productId: 1, quantity: 4 }])).toBe(4);
  });

  it('учитывает все позиции, даже если productId повторяется', () => {
    expect(getTotalQuantity(duplicated)).toBe(8);
  });
});

describe('setEntryQuantity', () => {
  it('добавляет новый товар в начало корзины', () => {
    expect(setEntryQuantity(items, { productId: 4, quantity: 1 })).toEqual([
      { productId: 4, quantity: 1 },
      ...items,
    ]);
  });

  it('добавляет товар в пустую корзину', () => {
    expect(setEntryQuantity([], { productId: 1, quantity: 3 })).toEqual([
      { productId: 1, quantity: 3 },
    ]);
  });

  it('меняет количество существующего товара, сохраняя порядок', () => {
    expect(setEntryQuantity(items, { productId: 2, quantity: 10 })).toEqual([
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 10 },
      { productId: 3, quantity: 5 },
    ]);
  });

  it('удаляет товар при количестве 0', () => {
    expect(setEntryQuantity(items, { productId: 2, quantity: 0 })).toEqual([
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 5 },
    ]);
  });

  it('не меняет корзину при количестве 0 для отсутствующего товара', () => {
    expect(setEntryQuantity(items, { productId: 99, quantity: 0 })).toEqual(items);
  });

  it('не изменяет исходный массив и его позиции', () => {
    const before = structuredClone(items);

    setEntryQuantity(items, { productId: 2, quantity: 10 });
    setEntryQuantity(items, { productId: 2, quantity: 0 });
    setEntryQuantity(items, { productId: 4, quantity: 1 });

    expect(items).toEqual(before);
  });

  it('возвращает новый массив, сохраняя ссылки на нетронутые позиции', () => {
    const result = setEntryQuantity(items, { productId: 2, quantity: 10 });

    expect(result).not.toBe(items);
    expect(result[0]).toBe(items[0]);
    expect(result[1]).not.toBe(items[1]);
    expect(result[2]).toBe(items[2]);
  });

  it('обновляет все позиции, если productId повторяется', () => {
    expect(setEntryQuantity(duplicated, { productId: 1, quantity: 3 })).toEqual([
      { productId: 1, quantity: 3 },
      { productId: 1, quantity: 3 },
    ]);
  });

  it('удаляет все позиции при количестве 0, если productId повторяется', () => {
    expect(setEntryQuantity(duplicated, { productId: 1, quantity: 0 })).toEqual([]);
  });
});
