import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

import { useCatalogProducts } from '../api/use-catalog-products';
import { getCatalogTitle } from '../lib/get-catalog-title';
import type { CatalogSelection } from '../model/use-catalog-selection';
import { CatalogProductsError } from './catalog-products-error';

interface CatalogProductsProps {
  selection: CatalogSelection;
}

export const CatalogProducts = ({ selection }: CatalogProductsProps) => {
  const { data: products, error, isPending, isError, refetch } = useCatalogProducts(selection);

  if (isPending) return <ProductGridSkeleton />;

  if (isError) return <CatalogProductsError error={error} onRetry={() => void refetch()} />;

  return (
    <section className="py-5 sm:py-8">
      <h2 className="text-base font-bold lg:text-lg">{getCatalogTitle(selection)}</h2>
      <ProductGrid products={products} />
    </section>
  );
};
