import { useFavoriteIds } from '@/entities/favorite';
import { useProductsById } from '@/entities/product';
import { LoadError } from '@/shared/ui/load-error';
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

export const FavoriteList = () => {
  const favorites = useFavoriteIds();
  const products = useProductsById();

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
          <ProductGrid products={favoriteProducts} />
        </div>
      )}
    </section>
  );
};
