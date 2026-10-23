import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FAVORITE_STORAGE_KEY } from '../config/favorite.constants';
import { useFavoriteStore } from './favorite.store';
import type { FavoriteProductId } from './favorite.types';

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

const getIds = () => useFavoriteStore.getState().productIds;

const setIds = (productIds: FavoriteProductId[]) => useFavoriteStore.setState({ productIds });

const readPersisted = () => {
  const raw = storage.getItem(FAVORITE_STORAGE_KEY);
  return raw === null ? null : (JSON.parse(raw) as unknown);
};

beforeEach(() => {
  setIds([]);
  storage.clear();
});

describe('toggleFavorite', () => {
  it('добавляет товар в пустое избранное', () => {
    useFavoriteStore.getState().toggleFavorite(1);

    expect(getIds()).toEqual([1]);
  });

  it('добавляет новый товар в начало списка', () => {
    setIds([1, 2]);

    useFavoriteStore.getState().toggleFavorite(3);

    expect(getIds()).toEqual([3, 1, 2]);
  });

  it('убирает товар, который уже в избранном, сохраняя порядок остальных', () => {
    setIds([1, 2, 3]);

    useFavoriteStore.getState().toggleFavorite(2);

    expect(getIds()).toEqual([1, 3]);
  });

  it('повторный вызов возвращает товар в начало списка', () => {
    setIds([1, 2, 3]);

    useFavoriteStore.getState().toggleFavorite(3);
    useFavoriteStore.getState().toggleFavorite(3);

    expect(getIds()).toEqual([3, 1, 2]);
  });

  it('убирает все вхождения, если productId повторяется', () => {
    setIds([1, 2, 1]);

    useFavoriteStore.getState().toggleFavorite(1);

    expect(getIds()).toEqual([2]);
  });
});

describe('removeFavorite', () => {
  it('убирает товар из избранного', () => {
    setIds([1, 2, 3]);

    useFavoriteStore.getState().removeFavorite(2);

    expect(getIds()).toEqual([1, 3]);
  });

  it('не добавляет товар, которого нет в избранном', () => {
    setIds([1, 2]);

    useFavoriteStore.getState().removeFavorite(3);

    expect(getIds()).toEqual([1, 2]);
  });
});

describe('clearFavorites', () => {
  it('очищает избранное', () => {
    setIds([1, 2, 3]);

    useFavoriteStore.getState().clearFavorites();

    expect(getIds()).toEqual([]);
  });
});

describe('неизменность состояния', () => {
  it('не мутирует предыдущий массив', () => {
    const productIds = [1, 2];

    setIds(productIds);
    useFavoriteStore.getState().toggleFavorite(3);
    useFavoriteStore.getState().toggleFavorite(1);
    useFavoriteStore.getState().removeFavorite(2);

    expect(productIds).toEqual([1, 2]);
  });
});

describe('сохранение в localStorage', () => {
  it('сохраняет только productIds под ключом избранного с версией 1', () => {
    useFavoriteStore.getState().toggleFavorite(1);
    useFavoriteStore.getState().toggleFavorite(2);

    expect(readPersisted()).toEqual({ state: { productIds: [2, 1] }, version: 1 });
  });

  it('сохраняет пустой список после очистки', () => {
    useFavoriteStore.getState().toggleFavorite(1);

    useFavoriteStore.getState().clearFavorites();

    expect(readPersisted()).toEqual({ state: { productIds: [] }, version: 1 });
  });

  it('восстанавливает избранное из localStorage', async () => {
    storage.setItem(
      FAVORITE_STORAGE_KEY,
      JSON.stringify({ state: { productIds: [5, 3] }, version: 1 }),
    );

    await useFavoriteStore.persist.rehydrate();

    expect(getIds()).toEqual([5, 3]);
  });

  it('после восстановления действия продолжают работать', async () => {
    storage.setItem(
      FAVORITE_STORAGE_KEY,
      JSON.stringify({ state: { productIds: [5] }, version: 1 }),
    );

    await useFavoriteStore.persist.rehydrate();
    useFavoriteStore.getState().toggleFavorite(5);

    expect(getIds()).toEqual([]);
  });

  it('оставляет текущее избранное, если в localStorage ничего нет', async () => {
    setIds([1, 2]);
    storage.clear();

    await useFavoriteStore.persist.rehydrate();

    expect(getIds()).toEqual([1, 2]);
  });
});
