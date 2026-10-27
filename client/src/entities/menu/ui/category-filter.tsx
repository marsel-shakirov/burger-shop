import { useEffect, useRef } from 'react';

import type { Category } from '../model/menu.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategorySlug: string;
  onChange: (slug: string) => void;
}

const getScrollPadding = (list: HTMLUListElement, side: 'Start' | 'End') =>
  parseFloat(getComputedStyle(list)[`scrollPaddingInline${side}`]) || 0;

const revealSelectedChip = (list: HTMLUListElement, behavior: ScrollBehavior) => {
  const chip = list.querySelector('input:checked')?.closest('li');
  if (!chip) return;

  const listRect = list.getBoundingClientRect();
  const chipRect = chip.getBoundingClientRect();
  const overflowEnd = chipRect.right - (listRect.right - getScrollPadding(list, 'End'));
  const overflowStart = chipRect.left - (listRect.left + getScrollPadding(list, 'Start'));

  if (overflowEnd > 0) list.scrollTo({ left: list.scrollLeft + overflowEnd, behavior });
  else if (overflowStart < 0) list.scrollTo({ left: list.scrollLeft + overflowStart, behavior });
};

export const CategoryFilter = ({
  selectedCategorySlug,
  categories,
  onChange,
}: CategoryFilterProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    let isActive = true;
    const behavior = isMountedRef.current ? 'auto' : 'instant';
    isMountedRef.current = true;

    void document.fonts.ready.then(() => {
      if (isActive && listRef.current) revealSelectedChip(listRef.current, behavior);
    });

    return () => {
      isActive = false;
    };
  }, [selectedCategorySlug]);

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Раздел категории</legend>

      <ul
        ref={listRef}
        role="list"
        className="-m-1 flex scroll-px-4 scrollbar-none gap-2 overflow-x-auto overscroll-x-contain mask-r-from-[calc(100%-1rem)] p-1 pr-4 motion-safe:scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {categories.map(({ id, name, slug }) => (
          <li key={id} className="shrink-0">
            <label>
              <input
                onChange={() => onChange(slug)}
                checked={selectedCategorySlug === slug}
                type="radio"
                className="peer sr-only"
                value={slug}
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
