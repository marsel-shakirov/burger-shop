import type { Category } from '../model/category.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onClick: (id: string) => void;
}

export const CategoryFilter = ({
  selectedCategoryId,
  categories,
  onClick,
}: CategoryFilterProps) => {
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
