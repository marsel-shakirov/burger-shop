import { useFavoriteIds } from '@/entities/favorite';
import { formatItemsCount, useProductsById } from '@/entities/product';
import { LoadError } from '@/shared/ui/load-error';
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

import { getSortHighlights } from '../lib/get-sort-highlights';
import { sortProducts } from '../lib/sort-products';
import { useFavoriteSorting } from '../model/use-favorite-sorting';
import { ProductSortMenu } from './product-sort-menu';

export const FavoriteList = () => {
  const favorites = useFavoriteIds();
  const products = useProductsById();
  const { sorting, changeSorting } = useFavoriteSorting();

  const isPending = favorites.isPending || products.isPending;
  const isError = favorites.isError || products.isError;

  const favoriteProducts = favorites.productIds
    .map((id) => products.data?.get(id))
    .filter((product) => product !== undefined);

  const retry = () => {
    if (favorites.isError) favorites.refetch();
    if (products.isError) void products.refetch();
  };

  return (
    <section className="flex flex-1 flex-col">
      <h1 className="pt-4 text-2xl font-bold sm:pt-7 sm:text-4xl">Избранное</h1>

      {isPending ? (
        <ProductGridSkeleton />
      ) : isError ? (
        <LoadError message="Товары не загрузились" onRetry={retry} className="py-4 sm:py-7" />
      ) : (
        <div className="py-4 sm:py-7">
          <div className="text-base font-bold [anchor-name:--sort] lg:text-lg">
            {formatItemsCount(favoriteProducts.length)},{' '}
            <ProductSortMenu
              sorting={sorting}
              highlights={getSortHighlights(favoriteProducts)}
              onChange={changeSorting}
            />
          </div>
          <ProductGrid products={sortProducts(favoriteProducts, sorting)} />
        </div>
      )}
    </section>
  );
};
