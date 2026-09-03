import { useRef } from 'react';

import type { ProductSortBy, ProductSorting, ProductSortOrder } from '@/entities/product';
import { ArrowSortMenu } from '@/shared/ui/icon';

interface SortOptionItem {
  value: ProductSortBy;
  label: string;
  order: ProductSortOrder;
}

interface ProductSortMenuProps {
  sorting: ProductSorting;
  onChange: (option: ProductSorting) => void;
}

const SORT_OPTIONS = [
  {
    value: 'popularity',
    order: 'desc',
    label: 'популярности',
  },
  {
    value: 'price',
    order: 'asc',
    label: 'цене',
  },
  {
    value: 'price',
    order: 'desc',
    label: 'цене',
  },
  {
    value: 'rating',
    order: 'desc',
    label: 'рейтингу',
  },
  {
    value: 'rating',
    order: 'asc',
    label: 'рейтингу',
  },
] satisfies SortOptionItem[];

export const ProductSortMenu = ({ sorting, onChange }: ProductSortMenuProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  const selectedOption = SORT_OPTIONS.find(
    (option) => option.value === sorting.sortBy && option.order === sorting.orderBy,
  );

  const handleSortChange = (option: SortOptionItem) => {
    onChange({ sortBy: option.value, orderBy: option.order });
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
          {SORT_OPTIONS.map((option, index) => {
            const optionId = `${option.value}-${option.order}`;
            const isSelected = sorting.sortBy === option.value && sorting.orderBy === option.order;

            return (
              <li key={`${optionId}_${index}`}>
                <label>
                  <input
                    onChange={() => handleSortChange(option)}
                    checked={isSelected}
                    type="radio"
                    name="sort"
                    value={`${optionId}`}
                    className="peer sr-only"
                  />
                  <span className="flex cursor-pointer items-center gap-x-1 px-4 py-2 font-bold opacity-50 transition-colors duration-300 peer-checked:bg-orange-200/20 peer-checked:text-orange-500 peer-checked:opacity-100 peer-not-checked:hover:text-orange-500">
                    <ArrowSortMenu className="size-4" />

                    {option.label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
