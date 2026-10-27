import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Category } from '../model/menu.types';
import { CategoryFilter } from './category-filter';

const categories: Category[] = [
  { id: 1, slug: 'beef', name: 'Говядина' },
  { id: 2, slug: 'chicken', name: 'Курица' },
  { id: 3, slug: 'fish', name: 'Рыба' },
];

const LIST_LEFT = 0;
const LIST_RIGHT = 300;
const CHIP_WIDTH = 120;

const chipLeft: Record<string, number> = { beef: -100, chicken: 100, fish: 250 };

const renderFilter = (selectedCategorySlug: string) => {
  const view = render(
    <CategoryFilter
      categories={categories}
      selectedCategorySlug={selectedCategorySlug}
      onChange={vi.fn()}
    />,
  );
  const list = view.container.querySelector('ul')!;

  list.getBoundingClientRect = () => ({ left: LIST_LEFT, right: LIST_RIGHT }) as DOMRect;
  list.querySelectorAll('li').forEach((chip, index) => {
    const left = chipLeft[categories[index]!.slug]!;
    chip.getBoundingClientRect = () => ({ left, right: left + CHIP_WIDTH }) as DOMRect;
  });
  const scrollTo = vi.spyOn(list, 'scrollTo');

  return { ...view, scrollTo };
};

const rerenderFilter = (view: ReturnType<typeof renderFilter>, selectedCategorySlug: string) =>
  view.rerender(
    <CategoryFilter
      categories={categories}
      selectedCategorySlug={selectedCategorySlug}
      onChange={vi.fn()}
    />,
  );

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CategoryFilter: прокрутка ленты', () => {
  it('при открытии сразу показывает выбранный чип, ушедший за правый край', async () => {
    const { scrollTo } = renderFilter('fish');

    await waitFor(() =>
      expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 70, behavior: 'instant' }),
    );
  });

  it('при смене выбора плавно возвращает чип, ушедший за левый край', async () => {
    const view = renderFilter('chicken');
    await Promise.resolve();

    rerenderFilter(view, 'beef');

    await waitFor(() =>
      expect(view.scrollTo).toHaveBeenCalledExactlyOnceWith({ left: -100, behavior: 'auto' }),
    );
  });

  it('не прокручивает, если выбранный чип виден целиком', async () => {
    const { scrollTo } = renderFilter('chicken');
    await Promise.resolve();

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('не прокручивает, если выбранной категории нет в списке', async () => {
    const { scrollTo } = renderFilter('cake');
    await Promise.resolve();

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
