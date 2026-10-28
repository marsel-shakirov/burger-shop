import { formatItemsCount } from '@/shared/lib';
import { LoadError } from '@/shared/ui/load-error';
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

import { getSortHighlights } from '../lib/get-sort-highlights';
import { sortProducts } from '../lib/sort-products';
import type { FavoriteProducts } from '../model/use-favorite-products';
import { useFavoriteSorting } from '../model/use-favorite-sorting';
import { ProductSortMenu } from './product-sort-menu';

interface FavoriteListProps {
  favorites: FavoriteProducts;
}

export const FavoriteList = ({
  favorites: { products: favoriteProducts, isPending, isError, retry },
}: FavoriteListProps) => {
  const { sorting, changeSorting } = useFavoriteSorting();

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
