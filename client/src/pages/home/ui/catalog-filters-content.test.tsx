import { fireEvent, render, screen } from '@testing-library/react';
import { useLocation } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { type Menu, menusQueryOptions } from '@/entities/menu';
import { createTestQueryClient, createWrapper } from '@/shared/testing';

import { CatalogFiltersContent } from './catalog-filters-content';

const menus: Menu[] = [
  {
    id: 1,
    slug: 'burgers',
    name: 'Бургеры',
    categories: [
      { id: 11, slug: 'beef', name: 'Говядина' },
      { id: 12, slug: 'chicken', name: 'Курица' },
    ],
  },
  {
    id: 2,
    slug: 'drinks',
    name: 'Напитки',
    categories: [{ id: 21, slug: 'cola', name: 'Кола' }],
  },
];

const LocationProbe = () => <output data-testid="search">{useLocation().search}</output>;

const renderFilters = (initialEntry = '/') => {
  const queryClient = createTestQueryClient();
  queryClient.setQueryData(menusQueryOptions().queryKey, menus);
  const onSelectionChange = vi.fn();

  render(
    <>
      <CatalogFiltersContent onSelectionChange={onSelectionChange} />
      <LocationProbe />
    </>,
    { wrapper: createWrapper({ queryClient, initialEntries: [initialEntry] }) },
  );

  return { onSelectionChange };
};

const getSearch = () => screen.getByTestId('search').textContent;

describe('CatalogFiltersContent: меню', () => {
  it('показывает разделы меню и выбирает раздел по умолчанию', () => {
    renderFilters();

    expect(screen.getByRole('radio', { name: 'Бургеры' })).toHaveProperty('checked', true);
    expect(screen.getByRole('radio', { name: 'Напитки' })).toHaveProperty('checked', false);
  });

  it('выбирает раздел из адреса', () => {
    renderFilters('/?menu=drinks');

    expect(screen.getByRole('radio', { name: 'Напитки' })).toHaveProperty('checked', true);
    expect(screen.getByRole('radio', { name: 'Кола' })).toBeDefined();
    expect(screen.queryByRole('radio', { name: 'Говядина' })).toBeNull();
  });

  it('смена раздела записывает его в адрес, сбрасывает категорию и сообщает наверх', () => {
    const { onSelectionChange } = renderFilters('/?menu=burgers&category=beef');

    fireEvent.click(screen.getByRole('radio', { name: 'Напитки' }));

    expect(getSearch()).toBe('?menu=drinks');
    expect(screen.getByRole('radio', { name: 'Все' })).toHaveProperty('checked', true);
    expect(onSelectionChange).toHaveBeenCalledOnce();
  });
});

describe('CatalogFiltersContent: категории', () => {
  it('без категории в адресе выбраны «Все»', () => {
    renderFilters();

    expect(screen.getByRole('radio', { name: 'Все' })).toHaveProperty('checked', true);
  });

  it('выбор категории записывает её в адрес и сообщает наверх', () => {
    const { onSelectionChange } = renderFilters('/?menu=burgers');

    fireEvent.click(screen.getByRole('radio', { name: 'Курица' }));

    expect(getSearch()).toBe('?menu=burgers&category=chicken');
    expect(screen.getByRole('radio', { name: 'Курица' })).toHaveProperty('checked', true);
    expect(onSelectionChange).toHaveBeenCalledOnce();
  });

  it('«Все» убирает категорию из адреса', () => {
    renderFilters('/?menu=burgers&category=beef');

    fireEvent.click(screen.getByRole('radio', { name: 'Все' }));

    expect(getSearch()).toBe('?menu=burgers');
  });

  it('неизвестная категория из адреса не выбрана', () => {
    renderFilters('/?menu=burgers&category=fish');

    expect(screen.getByRole('radio', { name: 'Все' })).toHaveProperty('checked', true);
  });
});
