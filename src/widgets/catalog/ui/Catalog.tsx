import { CategoryFilter } from './category-filter';
import { ProductGrid } from './product-grid';
import { SortSelect } from './sort-select';

export const Catalog = () => {
  return (
    <>
      <div className="flex items-center justify-between pt-10.25">
        <CategoryFilter />
        <SortSelect />
      </div>
      <ProductGrid />
    </>
  );
};
