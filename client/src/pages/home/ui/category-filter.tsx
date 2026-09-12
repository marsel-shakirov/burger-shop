import type { Category } from '../model/category.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategorySlug: string;
  onChange: (slug: string) => void;
}

export const CategoryFilter = ({
  selectedCategorySlug,
  categories,
  onChange,
}: CategoryFilterProps) => {
  return (
    <fieldset>
      <legend className="sr-only">Категории</legend>

      <ul role="list" className="flex items-center gap-x-2.5 md:gap-x-3.5">
        {categories.map(({ id, name, slug }) => (
          <li key={id}>
            <label>
              <input
                onChange={() => onChange(slug)}
                checked={selectedCategorySlug === slug}
                type="radio"
                className="peer sr-only"
                value={name}
                name="category"
              />
              <span
                className={`block cursor-pointer rounded-4xl bg-accent px-3 py-1.5 text-xs font-bold peer-focus-ring transition-colors peer-checked:bg-primary peer-not-checked:hover:bg-primary/50 sm:px-4 sm:py-2 sm:text-sm lg:text-base`}
              >
                {name}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};
