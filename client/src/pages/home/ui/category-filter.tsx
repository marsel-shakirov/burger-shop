import { useQuery } from '@tanstack/react-query';

import { getCategories } from '../api/get-categories';
import { ALL_CATEGORY } from '../model/category.constants';

interface CategoryFilterProps {
  selectedCategoryId: string;
  onClick: (id: string) => void;
}

export const CategoryFilter = ({ selectedCategoryId, onClick }: CategoryFilterProps) => {
  const { isPending, isError, data } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60,
  });

  if (isPending) {
    return <div>Hello</div>;
  }

  if (isError) {
    return <div>Failed to load categories</div>;
  }

  const categories = [ALL_CATEGORY, ...data];

  return (
    <div className="flex items-center gap-x-2.5">
      {categories.map(({ id, name }) => (
        <button
          key={id}
          type="button"
          onClick={() => onClick(id)}
          className={`cursor-pointer rounded-4xl px-[clamp(8px,4vw,29px)] py-2 text-[clamp(0.625rem,3vw,1rem)] font-bold transition-colors ${
            selectedCategoryId === id ? 'bg-primary' : 'bg-accent hover:bg-primary/50'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
};
