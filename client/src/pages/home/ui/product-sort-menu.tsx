import { useRef } from 'react';

import type { ProductSort } from '@/entities/product';

interface SortOptionItem {
  value: ProductSort;
  label: string;
}

interface ProductSortMenuProps {
  sortBy: ProductSort;
  onChange: (value: ProductSort) => void;
}

const SORT_OPTIONS = [
  { value: 'popularity', label: 'популярности' },
  { value: 'price', label: 'цене' },
  { value: 'rating', label: 'рейтингу' },
] satisfies SortOptionItem[];

export const ProductSortMenu = ({ sortBy, onChange }: ProductSortMenuProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  const selectedOption = SORT_OPTIONS.find((option) => option.value === sortBy);

  const handleSortChange = (value: ProductSort) => {
    onChange(value);
    popoverRef.current?.hidePopover();
  };

  return (
    <div className="flex">
      <button
        type="button"
        popoverTarget="sort-menu"
        className="cursor-pointer text-[clamp(0.625rem,3vw,1rem)] font-bold [anchor-name:--sort]"
      >
        Сортировка по:&nbsp;&nbsp;
        <span className="border-b border-dashed text-orange-400">{selectedOption?.label}</span>
      </button>

      <div
        ref={popoverRef}
        id="sort-menu"
        popover="auto"
        className="inset-auto top-[anchor(bottom)] right-[anchor(right)] mt-2 rounded-[10px] shadow-(--shadow-base) [position-anchor:--sort]"
      >
        <ul className="py-3.25 text-[0.75rem] md:text-sm">
          {SORT_OPTIONS.map(({ value, label }, index) => (
            <li key={`${value}_${index}`}>
              <label>
                <input
                  onChange={() => handleSortChange(value)}
                  checked={sortBy === value}
                  type="radio"
                  name="sort"
                  value={`${value}`}
                  className="peer sr-only"
                />
                <span className="block cursor-pointer px-4 py-2 font-bold opacity-50 peer-checked:bg-orange-200/20 peer-checked:text-orange-500 peer-checked:opacity-100">
                  {label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
