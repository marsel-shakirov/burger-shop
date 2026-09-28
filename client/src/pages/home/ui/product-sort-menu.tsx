import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type ToggleEvent,
  useId,
  useRef,
  useState,
} from 'react';

import type { ProductSorting } from '@/entities/product';
import { RatingStarIcon } from '@/shared/ui/icon';

import type { SortHighlights } from '../model/get-sort-highlights';
import { isSameSorting, SORT_OPTIONS, type SortOption } from '../model/sort-options';

const renderHighlight = ({ sort, order }: SortOption, highlights: SortHighlights): ReactNode => {
  if (sort === 'popularity') return <span className="truncate">{highlights.mostPopularName}</span>;
  if (sort === 'rating') {
    return (
      <>
        <RatingStarIcon className="size-3.5 text-yellow-400" />
        {highlights.topRating}
      </>
    );
  }
  return order === 'asc' ? (
    <>от&nbsp;{highlights.minPrice}&nbsp;₽</>
  ) : (
    <>до&nbsp;{highlights.maxPrice}&nbsp;₽</>
  );
};

interface ProductSortMenuProps {
  sorting: ProductSorting;
  highlights?: SortHighlights;
  onChange: (sorting: ProductSorting) => void;
}

export const ProductSortMenu = ({ sorting, highlights, onChange }: ProductSortMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverId = useId();
  const popoverRef = useRef<HTMLDivElement>(null);
  const selectedLabel = SORT_OPTIONS.find((option) => isSameSorting(option, sorting))?.label ?? '';

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
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        popoverTarget={popoverId}
        className="cursor-pointer rounded text-left text-orange-700 underline decoration-orange-600 decoration-dashed decoration-1 underline-offset-4 focus-ring"
      >
        <span className="sr-only">Сортировка: </span>
        {selectedLabel.toLowerCase()}
      </button>

      {/* Якорь --sort — строка заголовка в Catalog: меню выравнивается по её левому краю */}
      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        onToggle={handleTogglePopover}
        className="inset-auto top-[anchor(bottom)] left-[anchor(left)] mt-2 max-w-[anchor-size(width)] rounded-xl shadow-(--shadow-base) [position-anchor:--sort]"
      >
        <fieldset>
          <legend className="sr-only">Сортировка</legend>
          <ul role="list" onKeyDown={handleKeyDown} className="py-3.25">
            {SORT_OPTIONS.map((option) => {
              const optionId = `${option.sort}-${option.order}`;

              return (
                <li key={optionId}>
                  <label className="group">
                    <input
                      onChange={() => onChange(option)}
                      checked={isSameSorting(option, sorting)}
                      onClick={handleOptionClick}
                      type="radio"
                      name="sort"
                      value={optionId}
                      className="peer sr-only"
                    />
                    <span className="flex cursor-pointer items-baseline justify-between gap-x-4 peer-checked-orange px-4 py-2 text-base leading-tight font-bold text-stone-600 transition-colors duration-150">
                      {option.label}
                      {highlights && (
                        <span className="flex max-w-32 shrink-0 items-baseline gap-x-1 text-sm font-semibold whitespace-nowrap text-stone-500 tabular-nums group-has-checked:text-stone-900 sm:max-w-none">
                          <span className="sr-only">, </span>
                          {renderHighlight(option, highlights)}
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>
    </>
  );
};
