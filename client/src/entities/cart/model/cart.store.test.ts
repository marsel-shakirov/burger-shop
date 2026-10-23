import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CART_STORAGE_KEY, MAX_ITEM_QUANTITY } from '../config/cart.constants';
import { useCartStore } from './cart.store';
import type { CartEntry } from './cart.types';

const storage = vi.hoisted(() => {
  const data = new Map<string, string>();
  const memoryStorage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
    clear: () => data.clear(),
  };

  vi.stubGlobal('window', { localStorage: memoryStorage });

  return memoryStorage;
});

const getItems = () => useCartStore.getState().items;

const setItems = (items: CartEntry[]) => useCartStore.setState({ items });

const readPersisted = () => {
  const raw = storage.getItem(CART_STORAGE_KEY);
  return raw === null ? null : (JSON.parse(raw) as unknown);
};

beforeEach(() => {
  setItems([]);
  storage.clear();
});

describe('addItem', () => {
  it('добавляет новый товар с количеством 1', () => {
    useCartStore.getState().addItem(1);

    expect(getItems()).toEqual([{ productId: 1, quantity: 1 }]);
  });

  it('добавляет новый товар в начало корзины', () => {
    setItems([{ productId: 1, quantity: 2 }]);

    useCartStore.getState().addItem(2);

    expect(getItems()).toEqual([
      { productId: 2, quantity: 1 },
      { productId: 1, quantity: 2 },
    ]);
  });

  it('увеличивает количество уже добавленного товара, сохраняя порядок', () => {
    setItems([
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ]);

    useCartStore.getState().addItem(2);

    expect(getItems()).toEqual([
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 2 },
    ]);
  });

  it('доводит количество до максимума', () => {
    setItems([{ productId: 1, quantity: MAX_ITEM_QUANTITY - 1 }]);

    useCartStore.getState().addItem(1);

    expect(getItems()).toEqual([{ productId: 1, quantity: MAX_ITEM_QUANTITY }]);
  });

  it('не превышает максимальное количество и не меняет состояние', () => {
    setItems([{ productId: 1, quantity: MAX_ITEM_QUANTITY }]);
    const before = getItems();

    useCartStore.getState().addItem(1);

    expect(getItems()).toBe(before);
    expect(getItems()).toEqual([{ productId: 1, quantity: MAX_ITEM_QUANTITY }]);
  });

  it('не уведомляет подписчиков, если достигнут максимум', () => {
    setItems([{ productId: 1, quantity: MAX_ITEM_QUANTITY }]);
    const listener = vi.fn();
    const unsubscribe = useCartStore.subscribe(listener);

    useCartStore.getState().addItem(1);
    unsubscribe();

    expect(listener).not.toHaveBeenCalled();
  });
});

describe('incrementItem', () => {
  it('увеличивает количество товара в корзине', () => {
    setItems([{ productId: 1, quantity: 3 }]);

    useCartStore.getState().incrementItem(1);

    expect(getItems()).toEqual([{ productId: 1, quantity: 4 }]);
  });

  it('не добавляет товар, которого нет в корзине', () => {
    setItems([{ productId: 1, quantity: 3 }]);

    useCartStore.getState().incrementItem(2);

    expect(getItems()).toEqual([{ productId: 1, quantity: 3 }]);
  });

  it('не превышает максимальное количество', () => {
    setItems([{ productId: 1, quantity: MAX_ITEM_QUANTITY }]);

    useCartStore.getState().incrementItem(1);

    expect(getItems()).toEqual([{ productId: 1, quantity: MAX_ITEM_QUANTITY }]);
  });
});

describe('decrementItem', () => {
  it('уменьшает количество товара', () => {
    setItems([{ productId: 1, quantity: 3 }]);

    useCartStore.getState().decrementItem(1);

    expect(getItems()).toEqual([{ productId: 1, quantity: 2 }]);
  });

  it('удаляет товар, если количество было минимальным', () => {
    setItems([
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 4 },
    ]);

    useCartStore.getState().decrementItem(1);

    expect(getItems()).toEqual([{ productId: 2, quantity: 4 }]);
  });

  it('не трогает остальные товары', () => {
    setItems([
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 4 },
      { productId: 3, quantity: 1 },
    ]);

    useCartStore.getState().decrementItem(2);

    expect(getItems()).toEqual([
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
      { productId: 3, quantity: 1 },
    ]);
  });

  it('не меняет корзину, если товара в ней нет', () => {
    setItems([{ productId: 1, quantity: 2 }]);

    useCartStore.getState().decrementItem(2);

    expect(getItems()).toEqual([{ productId: 1, quantity: 2 }]);
  });
});

describe('removeItem', () => {
  it('удаляет товар целиком, независимо от количества', () => {
    setItems([
      { productId: 1, quantity: 7 },
      { productId: 2, quantity: 1 },
    ]);

    useCartStore.getState().removeItem(1);

    expect(getItems()).toEqual([{ productId: 2, quantity: 1 }]);
  });

  it('не меняет корзину, если товара в ней нет', () => {
    setItems([{ productId: 1, quantity: 2 }]);

    useCartStore.getState().removeItem(2);

    expect(getItems()).toEqual([{ productId: 1, quantity: 2 }]);
  });

  it('удаляет последний товар, оставляя пустую корзину', () => {
    setItems([{ productId: 1, quantity: 2 }]);

    useCartStore.getState().removeItem(1);

    expect(getItems()).toEqual([]);
  });
});

describe('clearCart', () => {
  it('очищает корзину', () => {
    setItems([
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 5 },
    ]);

    useCartStore.getState().clearCart();

    expect(getItems()).toEqual([]);
  });
});

describe('сохранение в localStorage', () => {
  it('сохраняет только товары под ключом корзины с версией 1', () => {
    useCartStore.getState().addItem(1);
    useCartStore.getState().addItem(1);
    useCartStore.getState().addItem(2);

    expect(readPersisted()).toEqual({
      state: {
        items: [
          { productId: 2, quantity: 1 },
          { productId: 1, quantity: 2 },
        ],
      },
      version: 1,
    });
  });

  it('сохраняет пустую корзину после очистки', () => {
    useCartStore.getState().addItem(1);

    useCartStore.getState().clearCart();

    expect(readPersisted()).toEqual({ state: { items: [] }, version: 1 });
  });

  it('восстанавливает товары из localStorage', async () => {
    const items: CartEntry[] = [
      { productId: 3, quantity: 2 },
      { productId: 5, quantity: 1 },
    ];
    storage.setItem(CART_STORAGE_KEY, JSON.stringify({ state: { items }, version: 1 }));

    await useCartStore.persist.rehydrate();

    expect(getItems()).toEqual(items);
  });

  it('после восстановления действия продолжают работать', async () => {
    storage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ state: { items: [{ productId: 3, quantity: 2 }] }, version: 1 }),
    );

    await useCartStore.persist.rehydrate();
    useCartStore.getState().incrementItem(3);

    expect(getItems()).toEqual([{ productId: 3, quantity: 3 }]);
  });

  it('оставляет текущую корзину, если в localStorage ничего нет', async () => {
    setItems([{ productId: 1, quantity: 2 }]);
    storage.clear();

    await useCartStore.persist.rehydrate();

    expect(getItems()).toEqual([{ productId: 1, quantity: 2 }]);
  });
});
