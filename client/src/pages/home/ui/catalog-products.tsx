import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

import { useCatalogProducts } from '../api/use-catalog-products';
import type { CatalogSelection } from '../model/use-catalog-selection';
import { CatalogHeader } from './catalog-header';
import { CatalogProductsError } from './catalog-products-error';
import { getCatalogTitle } from './get-catalog-title';

interface CatalogProductsProps {
  selection: CatalogSelection;
}

export const CatalogProducts = ({ selection }: CatalogProductsProps) => {
  const {
    data: products,
    error,
    isPending,
    isError,
    isPlaceholderData,
    refetch,
  } = useCatalogProducts(selection);

  if (isPending) return <ProductGridSkeleton />;

  if (isError) return <CatalogProductsError error={error} onRetry={() => void refetch()} />;

  return (
    <section className="py-5 sm:py-8">
      <CatalogHeader
        title={getCatalogTitle(selection)}
        sorting={selection.sorting}
        products={products}
        onSortingChange={selection.changeSorting}
      />
      <ProductGrid products={products} isUpdating={isPlaceholderData} />
    </section>
  );
};
