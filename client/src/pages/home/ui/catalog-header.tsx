import type { Product, ProductSorting } from '@/entities/product';

import { getSortHighlights } from '../model/get-sort-highlights';
import { ProductSortMenu } from './product-sort-menu';

interface CatalogHeaderProps {
  title: string;
  sorting: ProductSorting;
  products: Product[];
  onSortingChange: (sorting: ProductSorting) => void;
}

export const CatalogHeader = ({
  title,
  sorting,
  products,
  onSortingChange,
}: CatalogHeaderProps) => {
  return (
    <div className="text-base font-bold [anchor-name:--sort] sm:text-xl">
      <h2 className="inline">{title}</h2>,{' '}
      <ProductSortMenu
        sorting={sorting}
        highlights={getSortHighlights(products)}
        onChange={onSortingChange}
      />
    </div>
  );
};
