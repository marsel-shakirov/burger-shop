import { CategoryFilter } from './category-filter';
import { ProductGrid } from './product-grid';
import { SortSelect } from './sort-select';

export const Catalog = () => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 pt-2.5 sm:gap-y-6 sm:pt-5">
        <CategoryFilter />
        <SortSelect />
      </div>
      <ProductGrid />
    </>
  );
};
