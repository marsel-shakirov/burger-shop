import type { Category } from '../model/menu.types';

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
      <legend className="sr-only">Раздел категории</legend>

      <ul role="list" className="flex flex-wrap items-center gap-x-2.5 gap-y-1 md:gap-x-3.5">
        {categories.map(({ id, name, slug }) => (
          <li key={id}>
            <label>
              <input
                onChange={() => onChange(slug)}
                checked={selectedCategorySlug === slug}
                type="radio"
                className="peer sr-only"
                value={slug}
                name="category"
              />
              <span className="block cursor-pointer rounded-4xl peer-checked-orange bg-white px-3 py-1.5 text-base font-bold text-stone-600 peer-focus-ring transition-colors duration-150 sm:px-4 sm:py-2">
                {name}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};
