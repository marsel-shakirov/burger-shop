import type { FavoriteChange, FavoriteProductId } from '../model/favorite.types';

export const applyFavoriteChange = (
  productIds: FavoriteProductId[],
  { productId, action }: FavoriteChange,
) => {
  const rest = productIds.filter((id) => id !== productId);

  return action === 'add' ? [productId, ...rest] : rest;
};

export const revertFavoriteChange = (
  productIds: FavoriteProductId[],
  { productId, action }: FavoriteChange,
) => applyFavoriteChange(productIds, { productId, action: action === 'add' ? 'remove' : 'add' });
