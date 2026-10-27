import { useId } from 'react';

import type { Product } from '@/entities/product';
import { ProductGrid } from '@/widgets/product-grid';

import { getCatalogSectionId } from '../lib/catalog-section';
import type { CatalogSection } from '../model/catalog.types';

interface CatalogCategorySectionProps {
  section: CatalogSection;
  title: string;
  products: Product[];
  isFirst: boolean;
}

export const CatalogCategorySection = ({
  section,
  title,
  products,
  isFirst,
}: CatalogCategorySectionProps) => {
  const headingId = useId();

  return (
    <section id={getCatalogSectionId(section)} aria-labelledby={headingId} className="pt-5 sm:pt-8">
      <h2 id={headingId} className="text-lg font-bold sm:text-xl">
        {title}
      </h2>
      <ProductGrid products={products} priorityCount={isFirst ? 4 : 0} />
    </section>
  );
};
