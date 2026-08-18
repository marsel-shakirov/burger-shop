import { CategoryFilter } from './CategoryFilter';
import { ProductGrid } from './ProductGrid';
import { SortSelect } from './SortSelect';

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
