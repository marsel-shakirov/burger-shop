import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { CatalogMenuGroup, CatalogSection } from '../model/catalog.types';
import { CatalogFiltersContent } from './catalog-filters-content';

const beef = { id: 11, slug: 'beef', name: 'Говядина' };
const chicken = { id: 12, slug: 'chicken', name: 'Курица' };
const fish = { id: 13, slug: 'fish', name: 'Рыба' };
const cola = { id: 21, slug: 'cola', name: 'Кола' };

const groups: CatalogMenuGroup[] = [
  {
    menu: { id: 1, slug: 'burgers', name: 'Бургеры', categories: [beef, chicken, fish] },
    categories: [
      { category: beef, products: [] },
      { category: chicken, products: [] },
    ],
  },
  {
    menu: { id: 2, slug: 'drinks', name: 'Напитки', categories: [cola] },
    categories: [{ category: cola, products: [] }],
  },
];

const renderFilters = (activeSection: CatalogSection) => {
  const onMenuSelect = vi.fn();
  const onCategorySelect = vi.fn();

  render(
    <CatalogFiltersContent
      groups={groups}
      activeSection={activeSection}
      onMenuSelect={onMenuSelect}
      onCategorySelect={onCategorySelect}
    />,
  );

  return { onMenuSelect, onCategorySelect };
};

describe('CatalogFiltersContent: меню', () => {
  it('отмечает меню активного раздела', () => {
    renderFilters({ menuSlug: 'drinks', categorySlug: 'cola' });

    expect(screen.getByRole('radio', { name: 'Напитки' })).toHaveProperty('checked', true);
    expect(screen.getByRole('radio', { name: 'Бургеры' })).toHaveProperty('checked', false);
  });

  it('выбор меню сообщает его slug', () => {
    const { onMenuSelect } = renderFilters({ menuSlug: 'burgers', categorySlug: 'beef' });

    fireEvent.click(screen.getByRole('radio', { name: 'Напитки' }));

    expect(onMenuSelect).toHaveBeenCalledExactlyOnceWith('drinks');
  });
});

describe('CatalogFiltersContent: категории', () => {
  it('показывает только категории активного меню, у которых есть товары, без «Все»', () => {
    renderFilters({ menuSlug: 'burgers', categorySlug: 'chicken' });

    expect(screen.getAllByRole('radio', { name: /^(Говядина|Курица|Рыба|Кола|Все)$/ })).toEqual([
      screen.getByRole('radio', { name: 'Говядина' }),
      screen.getByRole('radio', { name: 'Курица' }),
    ]);
    expect(screen.getByRole('radio', { name: 'Курица' })).toHaveProperty('checked', true);
  });

  it('выбор категории сообщает раздел активного меню', () => {
    const { onCategorySelect } = renderFilters({ menuSlug: 'burgers', categorySlug: 'beef' });

    fireEvent.click(screen.getByRole('radio', { name: 'Курица' }));

    expect(onCategorySelect).toHaveBeenCalledExactlyOnceWith({
      menuSlug: 'burgers',
      categorySlug: 'chicken',
    });
  });

  it('для неизвестного меню не показывает категории', () => {
    renderFilters({ menuSlug: 'desserts', categorySlug: 'cake' });

    expect(screen.queryByRole('radio', { name: 'Говядина' })).toBeNull();
  });
});
