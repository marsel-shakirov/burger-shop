import { describe, expect, it } from 'vitest';

import type { FavoriteChange, FavoriteProductId } from '../model/favorite.types';
import { applyFavoriteChange, revertFavoriteChange } from './favorite-changes';

const productIds: FavoriteProductId[] = [3, 1, 2];

describe('applyFavoriteChange', () => {
  it('add добавляет товар в начало списка', () => {
    expect(applyFavoriteChange(productIds, { productId: 4, action: 'add' })).toEqual([4, 3, 1, 2]);
  });

  it('add для товара из списка поднимает его в начало без дубля', () => {
    expect(applyFavoriteChange(productIds, { productId: 2, action: 'add' })).toEqual([2, 3, 1]);
  });

  it('add в пустой список', () => {
    expect(applyFavoriteChange([], { productId: 4, action: 'add' })).toEqual([4]);
  });

  it('remove убирает товар, сохраняя порядок остальных', () => {
    expect(applyFavoriteChange(productIds, { productId: 1, action: 'remove' })).toEqual([3, 2]);
  });

  it('remove для товара не из списка ничего не меняет', () => {
    expect(applyFavoriteChange(productIds, { productId: 9, action: 'remove' })).toEqual(productIds);
  });

  it('убирает все вхождения, если productId повторяется', () => {
    expect(applyFavoriteChange([1, 2, 1], { productId: 1, action: 'remove' })).toEqual([2]);
    expect(applyFavoriteChange([1, 2, 1], { productId: 1, action: 'add' })).toEqual([1, 2]);
  });

  it('не изменяет исходный массив', () => {
    const before = [...productIds];

    applyFavoriteChange(productIds, { productId: 4, action: 'add' });
    applyFavoriteChange(productIds, { productId: 1, action: 'remove' });

    expect(productIds).toEqual(before);
  });
});

describe('revertFavoriteChange', () => {
  it('после неудачного add убирает товар', () => {
    const change: FavoriteChange = { productId: 4, action: 'add' };

    expect(revertFavoriteChange(applyFavoriteChange(productIds, change), change)).toEqual(
      productIds,
    );
  });

  it('после неудачного remove возвращает товар в избранное', () => {
    const change: FavoriteChange = { productId: 1, action: 'remove' };
    const result = revertFavoriteChange(applyFavoriteChange(productIds, change), change);

    expect(result).toHaveLength(productIds.length);
    expect(result).toEqual(expect.arrayContaining(productIds));
  });

  it('откатывает только свой товар, сохраняя другие изменения в кэше', () => {
    const failed: FavoriteChange = { productId: 4, action: 'add' };
    const current: FavoriteProductId[] = [5, 4, 3, 1, 2];

    expect(revertFavoriteChange(current, failed)).toEqual([5, 3, 1, 2]);
  });

  it('не изменяет исходный массив', () => {
    const before = [...productIds];

    revertFavoriteChange(productIds, { productId: 1, action: 'add' });
    revertFavoriteChange(productIds, { productId: 4, action: 'remove' });

    expect(productIds).toEqual(before);
  });
});
