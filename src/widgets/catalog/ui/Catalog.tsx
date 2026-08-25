import { CategoryFilter } from './category-filter';
import { ProductGrid } from './product-grid';
import { SortSelect } from './sort-select';

export const Catalog = () => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 pt-[clamp(20px,5vw,41px)]">
        <CategoryFilter />
        <SortSelect />
      </div>
      <ProductGrid />
    </>
  );
};
