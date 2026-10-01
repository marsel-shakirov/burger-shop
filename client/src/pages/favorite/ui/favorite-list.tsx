import { selectFavoriteIds, useFavoriteStore } from '@/entities/favorite';
import { useProductsById } from '@/entities/product';
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

export const FavoriteList = () => {
  const favoriteIds = useFavoriteStore(selectFavoriteIds);

  const { isPending, isError, data: productsById } = useProductsById();

  const favoriteProducts = favoriteIds
    .map((id) => productsById?.get(id))
    .filter((product) => product !== undefined);

  return (
    <section className="flex flex-1 flex-col">
      <h1 className="pt-4 text-2xl font-bold sm:pt-7 sm:text-4xl">Избранное</h1>

      {isPending ? (
        <ProductGridSkeleton />
      ) : isError ? (
        <div>Failed to load products</div>
      ) : (
        <div className="py-4 sm:py-7">
          <ProductGrid products={favoriteProducts} />
        </div>
      )}
    </section>
  );
};
