import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { CART_STORAGE_KEY } from '../config/cart.constants';
import { useCartStore } from './cart.store';
import type { CartEntry } from './cart.types';
import { useCartStorageSync } from './use-cart-storage-sync';

const tabItems: CartEntry[] = [{ productId: 1, quantity: 2 }];

const otherTabItems: CartEntry[] = [
  { productId: 1, quantity: 2 },
  { productId: 7, quantity: 1 },
];

const writeFromOtherTab = (items: CartEntry[], key = CART_STORAGE_KEY) => {
  localStorage.setItem(key, JSON.stringify({ state: { items }, version: 1 }));
  window.dispatchEvent(new StorageEvent('storage', { key }));
};

const getItems = () => useCartStore.getState().items;

beforeEach(() => {
  useCartStore.setState({ items: tabItems });
});

describe('useCartStorageSync', () => {
  it('подхватывает корзину, изменённую в другой вкладке', () => {
    renderHook(useCartStorageSync);

    writeFromOtherTab(otherTabItems);

    expect(getItems()).toEqual(otherTabItems);
  });

  it('подхватывает очистку корзины в другой вкладке', () => {
    renderHook(useCartStorageSync);

    writeFromOtherTab([]);

    expect(getItems()).toEqual([]);
  });

  it('не реагирует на изменение других ключей хранилища', () => {
    renderHook(useCartStorageSync);

    writeFromOtherTab(otherTabItems, 'burger-shop:other');

    expect(getItems()).toEqual(tabItems);
  });

  it('после размонтирования больше не слушает хранилище', () => {
    const { unmount } = renderHook(useCartStorageSync);

    unmount();
    writeFromOtherTab(otherTabItems);

    expect(getItems()).toEqual(tabItems);
  });
});
