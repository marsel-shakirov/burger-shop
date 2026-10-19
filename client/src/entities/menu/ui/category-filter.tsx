import { useEffect, useRef } from 'react';

import type { Category } from '../model/menu.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategorySlug?: string;
  onChange: (slug?: string) => void;
}

interface CategoryOption {
  name: string;
  slug?: string;
}

const ALL_OPTION: CategoryOption = { name: 'Все' };

const revealChip = (input: HTMLInputElement) => {
  input.closest('li')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
};

const revealSelectedChip = (list: HTMLUListElement) => {
  const chip = list.querySelector('input:checked')?.closest('li');
  if (!chip) return;

  const scrollPadding = parseFloat(getComputedStyle(list).scrollPaddingInlineEnd) || 0;
  const overflow =
    chip.getBoundingClientRect().right - (list.getBoundingClientRect().right - scrollPadding);

  if (overflow > 0) list.scrollTo({ left: list.scrollLeft + overflow, behavior: 'instant' });
};

export const CategoryFilter = ({
  selectedCategorySlug,
  categories,
  onChange,
}: CategoryFilterProps) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let isActive = true;

    void document.fonts.ready.then(() => {
      if (isActive && listRef.current) revealSelectedChip(listRef.current);
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Раздел категории</legend>

      <ul
        ref={listRef}
        role="list"
        className="-m-1 flex scroll-px-4 scrollbar-none gap-2 overflow-x-auto overscroll-x-contain mask-r-from-[calc(100%-1rem)] p-1 pr-4 motion-safe:scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {[ALL_OPTION, ...categories].map(({ name, slug }) => (
          <li key={slug ?? ''} className="shrink-0">
            <label>
              <input
                onChange={(event) => {
                  onChange(slug);
                  revealChip(event.currentTarget);
                }}
                checked={selectedCategorySlug === slug}
                type="radio"
                className="peer sr-only"
                value={slug ?? ''}
                name="category"
              />
              <span className="flex h-10 cursor-pointer items-center rounded-full border border-stone-200 bg-white px-3.5 text-base font-bold whitespace-nowrap text-stone-700 peer-focus-ring transition-colors duration-150 peer-checked:border-mustard peer-checked:bg-mustard peer-checked:text-stone-900 peer-not-checked:hover:border-stone-300 peer-not-checked:hover:text-stone-900">
                {name}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};
