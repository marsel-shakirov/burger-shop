import { Container } from '@/shared/ui/container';
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

import { useCatalogProducts } from '../api/use-catalog-products';
import { ALL_CATEGORY } from '../config/catalog.constants';
import { useCatalogSelection } from '../model/use-catalog-selection';
import { CatalogFilters } from './catalog-filters';
import { CatalogHeader } from './catalog-header';
import { getCatalogTitle } from './get-catalog-title';

export const Catalog = () => {
  const selection = useCatalogSelection();
  const { isPending, isError, isPlaceholderData, data: products } = useCatalogProducts(selection);

  return (
    <>
      <CatalogFilters
        menuSlug={selection.menuSlug}
        categorySlug={selection.categorySlug ?? ALL_CATEGORY.slug}
        onMenuChange={selection.selectMenu}
        onCategoryChange={selection.selectCategory}
      />
      <Container>
        {isPending ? (
          <ProductGridSkeleton />
        ) : isError ? (
          <div>Failed to load products</div>
        ) : (
          <section className="py-5 sm:py-8">
            <CatalogHeader
              title={getCatalogTitle(selection)}
              sorting={selection.sorting}
              products={products}
              onSortingChange={selection.changeSorting}
            />
            <ProductGrid products={products} isUpdating={isPlaceholderData} />
          </section>
        )}
      </Container>
    </>
  );
};
