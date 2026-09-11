import { useId, useRef } from 'react';

import type { ProductSortBy, ProductSorting, ProductSortOrder } from '@/entities/product';
import { PRODUCT_SORT_BY, PRODUCT_SORT_ORDER } from '@/entities/product';
import { ArrowDownSort, ArrowTopSort } from '@/shared/ui/icon';

const SORT_LABELS: Record<ProductSortBy, string> = {
  popularity: 'популярности',
  price: 'цене',
  rating: 'рейтингу',
};

const SORT_ICONS: Record<ProductSortOrder, typeof ArrowTopSort> = {
  desc: ArrowTopSort,
  asc: ArrowDownSort,
};

const SORT_OPTIONS: ProductSorting[] = PRODUCT_SORT_BY.flatMap((sort) =>
  PRODUCT_SORT_ORDER.map((order) => ({ sort, order })),
);

interface ProductSortMenuProps {
  sorting: ProductSorting;
  onChange: (sorting: ProductSorting) => void;
}

export const ProductSortMenu = ({ sorting, onChange }: ProductSortMenuProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  const handleSortChange = (option: ProductSorting) => {
    onChange(option);
    popoverRef.current?.hidePopover();
  };

  return (
    <div className="flex">
      <button
        type="button"
        popoverTarget={popoverId}
        className="cursor-pointer text-[clamp(0.625rem,3vw,1rem)] font-bold [anchor-name:--sort]"
      >
        Сортировка по:&nbsp;&nbsp;
        <span className="border-b border-dashed text-orange-400">{SORT_LABELS[sorting.sort]}</span>
      </button>

      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        className="inset-auto top-[anchor(bottom)] right-[anchor(right)] mt-2 rounded-[10px] shadow-(--shadow-base) [position-anchor:--sort]"
      >
        <ul className="py-3.25 text-[0.75rem] md:text-sm">
          {SORT_OPTIONS.map((option) => {
            const optionId = `${option.sort}-${option.order}`;
            const isSelected = sorting.sort === option.sort && sorting.order === option.order;
            const Icon = SORT_ICONS[option.order];

            return (
              <li key={optionId}>
                <label>
                  <input
                    onChange={() => handleSortChange(option)}
                    checked={isSelected}
                    type="radio"
                    name="sort"
                    value={optionId}
                    className="peer sr-only"
                  />
                  <span className="flex cursor-pointer items-center gap-x-1 px-4 py-2 font-bold opacity-50 transition-colors duration-300 peer-checked:bg-orange-200/20 peer-checked:text-orange-500 peer-checked:opacity-100 peer-not-checked:hover:text-orange-500">
                    <Icon className="size-4" />
                    {SORT_LABELS[option.sort]}
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
