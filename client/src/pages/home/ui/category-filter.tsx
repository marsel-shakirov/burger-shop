import type { Category } from '../model/catalog.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategorySlug: string;
  onClick: (slug: string) => void;
}

export const CategoryFilter = ({
  selectedCategorySlug,
  categories,
  onClick,
}: CategoryFilterProps) => {
  return (
    <div className="flex items-center gap-x-2.5">
      {categories.map(({ id, name, slug }) => (
        <button
          key={id}
          type="button"
          onClick={() => onClick(slug)}
          className={`cursor-pointer rounded-4xl px-[clamp(8px,4vw,29px)] py-2 text-[clamp(0.625rem,3vw,1rem)] font-bold transition-colors ${
            selectedCategorySlug === slug ? 'bg-primary' : 'bg-accent hover:bg-primary/50'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
};
