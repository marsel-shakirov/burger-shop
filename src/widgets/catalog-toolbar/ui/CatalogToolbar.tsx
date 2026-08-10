import { CategoryFilter } from './CategoryFilter';
import { SortSelect } from './SortSelect';

export const CatalogToolbar = () => {
  return (
    <div className="flex items-center justify-between pt-10.25">
      <CategoryFilter />
      <SortSelect />
    </div>
  );
};
