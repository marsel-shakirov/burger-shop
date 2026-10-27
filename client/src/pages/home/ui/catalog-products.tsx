import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

import type { CatalogData } from '../model/use-catalog';
import { CatalogCategorySection } from './catalog-category-section';
import { CatalogProductsError } from './catalog-products-error';

interface CatalogProductsProps {
  catalog: CatalogData;
}

export const CatalogProducts = ({ catalog: { menus, products, groups } }: CatalogProductsProps) => {
  if (products.isError) {
    return <CatalogProductsError error={products.error} onRetry={() => void products.refetch()} />;
  }

  if (products.isPending) return <ProductGridSkeleton />;

  if (menus.isError) {
    return (
      <div className="py-5 sm:py-8">
        <ProductGrid products={products.data} />
      </div>
    );
  }

  if (!groups) return <ProductGridSkeleton />;

  const sections = groups.flatMap(({ menu, categories }) =>
    categories.map(({ category, products }) => ({ menu, category, products })),
  );

  return (
    <div className="pb-5 sm:pb-8">
      {sections.map(({ menu, category, products }, index) => (
        <CatalogCategorySection
          key={category.id}
          section={{ menuSlug: menu.slug, categorySlug: category.slug }}
          title={category.name}
          products={products}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
};
