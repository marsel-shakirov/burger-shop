import {
  type KeyboardEvent,
  type MouseEvent,
  type ToggleEvent,
  useId,
  useRef,
  useState,
} from 'react';

import type { ProductSortBy, ProductSorting, ProductSortOrder } from '@/entities/product';
import { PRODUCT_SORT_BY, PRODUCT_SORT_ORDER } from '@/entities/product';
import { ArrowDownSort, ArrowTopSort } from '@/shared/ui/icon';

const SORT_LABELS: Record<ProductSortBy, string> = {
  popularity: 'популярности',
  price: 'цене',
  rating: 'рейтингу',
};

const SORT_ORDER_LABELS: Record<ProductSortOrder, string> = {
  desc: 'по убыванию',
  asc: 'по возрастанию',
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

export const ProductSortMenu = ({ sorting, onChange: onSortChange }: ProductSortMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverId = useId();
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleTogglePopover = (event: ToggleEvent<HTMLDivElement>) => {
    setIsOpen(event.newState === 'open');
    if (event.newState === 'open') {
      popoverRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
    }
  };

  const closeMenu = () => {
    popoverRef.current?.hidePopover();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      closeMenu();
    }
  };

  const handleOptionClick = (event: MouseEvent<HTMLInputElement>) => {
    if (event.detail > 0) closeMenu();
  };

  return (
    <div className="flex">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        popoverTarget={popoverId}
        className="flex cursor-pointer gap-x-2 rounded text-sm font-bold focus-ring [anchor-name:--sort] lg:text-base"
      >
        Сортировка по:
        <span className="border-b border-dashed text-orange-400">{SORT_LABELS[sorting.sort]}</span>
      </button>

      <div
        ref={popoverRef}
        id={popoverId}
        aria-haspopup="true"
        popover="auto"
        onToggle={handleTogglePopover}
        className="inset-auto top-[anchor(bottom)] right-[anchor(right)] mt-2 rounded-xl shadow-(--shadow-base) [position-anchor:--sort]"
      >
        <fieldset>
          <legend className="sr-only">Сортировка по</legend>
          <ul onKeyDown={handleKeyDown} className="py-3.25 text-xs md:text-sm">
            {SORT_OPTIONS.map((option) => {
              const optionId = `${option.sort}-${option.order}`;
              const isSelected = sorting.sort === option.sort && sorting.order === option.order;
              const Icon = SORT_ICONS[option.order];

              return (
                <li key={optionId}>
                  <label>
                    <input
                      onChange={() => onSortChange(option)}
                      checked={isSelected}
                      onClick={handleOptionClick}
                      type="radio"
                      name="sort"
                      value={optionId}
                      className="peer sr-only"
                    />
                    <span className="flex cursor-pointer items-center gap-x-1 px-4 py-2 font-bold opacity-50 transition-colors duration-300 peer-checked:bg-orange-200/20 peer-checked:text-orange-500 peer-checked:opacity-100 peer-not-checked:hover:text-orange-500">
                      <Icon className="size-4" />
                      {SORT_LABELS[option.sort]}
                      <span className="sr-only">, {SORT_ORDER_LABELS[option.order]}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>
    </div>
  );
};
