import { useFavoriteIds } from '@/entities/favorite';
import { useProductsById } from '@/entities/product';

export const useFavoriteProducts = () => {
  const favorites = useFavoriteIds();
  const products = useProductsById();
  const hasFavorites = favorites.productIds.length > 0;

  const favoriteProducts = favorites.productIds
    .map((id) => products.data?.get(id))
    .filter((product) => product !== undefined);

  const retry = () => {
    if (favorites.isError) favorites.refetch();
    if (products.isError) void products.refetch();
  };

  return {
    products: favoriteProducts,
    isPending: favorites.isPending || (hasFavorites && products.isPending),
    isError: favorites.isError || (hasFavorites && products.isError),
    retry,
  };
};

export type FavoriteProducts = ReturnType<typeof useFavoriteProducts>;
