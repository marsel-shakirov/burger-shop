import { describe, expect, it } from 'vitest';

import { MAX_ITEM_QUANTITY, MIN_ITEM_QUANTITY } from '../config/cart.constants';
import type { CartChange, CartEntry } from '../model/cart.types';
import { applyCartChange, getNextQuantity, revertCartChange } from './cart-changes';

const items: CartEntry[] = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
  { productId: 3, quantity: 5 },
];

const clear: CartChange = { type: 'clear' };

describe('getNextQuantity', () => {
  describe('add', () => {
    it('добавляет единицу к количеству', () => {
      expect(getNextQuantity(2, 'add')).toBe(3);
    });

    it('добавляет товар, которого нет в корзине', () => {
      expect(getNextQuantity(0, 'add')).toBe(1);
    });

    it('не превышает MAX_ITEM_QUANTITY', () => {
      expect(getNextQuantity(MAX_ITEM_QUANTITY - 1, 'add')).toBe(MAX_ITEM_QUANTITY);
      expect(getNextQuantity(MAX_ITEM_QUANTITY, 'add')).toBe(MAX_ITEM_QUANTITY);
    });

    it('опускает до MAX_ITEM_QUANTITY количество, которое уже больше лимита', () => {
      expect(getNextQuantity(MAX_ITEM_QUANTITY + 5, 'add')).toBe(MAX_ITEM_QUANTITY);
    });
  });

  describe('increment', () => {
    it('добавляет единицу к количеству', () => {
      expect(getNextQuantity(2, 'increment')).toBe(3);
    });

    it('не добавляет товар, которого нет в корзине', () => {
      expect(getNextQuantity(0, 'increment')).toBe(0);
    });

    it('не превышает MAX_ITEM_QUANTITY', () => {
      expect(getNextQuantity(MAX_ITEM_QUANTITY, 'increment')).toBe(MAX_ITEM_QUANTITY);
    });
  });

  describe('decrement', () => {
    it('убирает единицу из количества', () => {
      expect(getNextQuantity(3, 'decrement')).toBe(2);
    });

    it('опускает до MIN_ITEM_QUANTITY', () => {
      expect(getNextQuantity(MIN_ITEM_QUANTITY + 1, 'decrement')).toBe(MIN_ITEM_QUANTITY);
    });

    it('удаляет товар на MIN_ITEM_QUANTITY', () => {
      expect(getNextQuantity(MIN_ITEM_QUANTITY, 'decrement')).toBe(0);
    });

    it('оставляет 0 для товара, которого нет в корзине', () => {
      expect(getNextQuantity(0, 'decrement')).toBe(0);
    });
  });

  describe('remove', () => {
    it('возвращает 0 при любом количестве', () => {
      expect(getNextQuantity(0, 'remove')).toBe(0);
      expect(getNextQuantity(1, 'remove')).toBe(0);
      expect(getNextQuantity(MAX_ITEM_QUANTITY, 'remove')).toBe(0);
    });
  });
});

describe('applyCartChange', () => {
  it('очищает корзину', () => {
    expect(applyCartChange(items, clear)).toEqual([]);
  });

  it('меняет количество товара', () => {
    expect(applyCartChange(items, { type: 'item', productId: 2, quantity: 4 })).toEqual([
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 4 },
      { productId: 3, quantity: 5 },
    ]);
  });

  it('добавляет новый товар в начало корзины', () => {
    expect(applyCartChange(items, { type: 'item', productId: 4, quantity: 1 })).toEqual([
      { productId: 4, quantity: 1 },
      ...items,
    ]);
  });

  it('удаляет товар при количестве 0', () => {
    expect(applyCartChange(items, { type: 'item', productId: 1, quantity: 0 })).toEqual([
      { productId: 2, quantity: 1 },
      { productId: 3, quantity: 5 },
    ]);
  });

  it('не изменяет исходный массив', () => {
    const before = structuredClone(items);

    applyCartChange(items, { type: 'item', productId: 2, quantity: 4 });
    applyCartChange(items, clear);

    expect(items).toEqual(before);
  });
});

describe('revertCartChange', () => {
  it('возвращает предыдущую корзину после ошибки очистки', () => {
    expect(revertCartChange([], items, clear)).toBe(items);
  });

  it('возвращает предыдущую корзину, если в кэше нет данных', () => {
    expect(revertCartChange(undefined, items, { type: 'item', productId: 2, quantity: 4 })).toBe(
      items,
    );
  });

  it('возвращает прежнее количество изменённого товара', () => {
    const change: CartChange = { type: 'item', productId: 2, quantity: 4 };

    expect(revertCartChange(applyCartChange(items, change), items, change)).toEqual(items);
  });

  it('удаляет товар, которого не было до изменения', () => {
    const change: CartChange = { type: 'item', productId: 4, quantity: 1 };

    expect(revertCartChange(applyCartChange(items, change), items, change)).toEqual(items);
  });

  it('возвращает удалённый товар с прежним количеством', () => {
    const change: CartChange = { type: 'item', productId: 3, quantity: 0 };
    const result = revertCartChange(applyCartChange(items, change), items, change);

    expect(result).toHaveLength(items.length);
    expect(result).toContainEqual({ productId: 3, quantity: 5 });
  });

  it('откатывает только свой товар, сохраняя другие изменения в кэше', () => {
    const failed: CartChange = { type: 'item', productId: 2, quantity: 4 };
    const current: CartEntry[] = [
      { productId: 1, quantity: 7 },
      { productId: 2, quantity: 4 },
      { productId: 3, quantity: 5 },
    ];

    expect(revertCartChange(current, items, failed)).toEqual([
      { productId: 1, quantity: 7 },
      { productId: 2, quantity: 1 },
      { productId: 3, quantity: 5 },
    ]);
  });

  it('не изменяет текущую и предыдущую корзины', () => {
    const current = structuredClone(items);
    const previous = structuredClone(items);

    revertCartChange(current, previous, { type: 'item', productId: 2, quantity: 0 });

    expect(current).toEqual(items);
    expect(previous).toEqual(items);
  });
});
