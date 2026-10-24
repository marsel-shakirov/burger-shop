import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ProductSorting } from '@/entities/product';

import type { SortHighlights } from '../lib/get-sort-highlights';
import { ProductSortMenu } from './product-sort-menu';

const highlights: SortHighlights = {
  mostPopularName: 'Чизбургер',
  topRating: 4.9,
  minPrice: 99,
  maxPrice: 650,
};

const renderMenu = (sorting: ProductSorting = { sort: 'rating', order: 'desc' }) => {
  const onChange = vi.fn();
  render(<ProductSortMenu sorting={sorting} highlights={highlights} onChange={onChange} />);

  return { onChange };
};

const getTrigger = () => screen.getByRole('button', { name: /^Сортировка:/ });

const getPopover = () => screen.getByRole('group', { name: 'Сортировка', hidden: true });

const getOption = (name: RegExp) => screen.getByRole('radio', { name, hidden: true });

const isOpen = () => getTrigger().getAttribute('aria-expanded') === 'true';

describe('ProductSortMenu: кнопка', () => {
  it('показывает выбранную сортировку', () => {
    renderMenu({ sort: 'price', order: 'asc' });

    expect(getTrigger().textContent).toBe('Сортировка: сначала дешёвые');
  });

  it('открывает и закрывает меню', () => {
    renderMenu();

    expect(isOpen()).toBe(false);

    fireEvent.click(getTrigger());
    expect(isOpen()).toBe(true);

    fireEvent.click(getTrigger());
    expect(isOpen()).toBe(false);
  });

  it('при открытии ставит фокус на выбранный вариант', () => {
    renderMenu({ sort: 'price', order: 'desc' });

    fireEvent.click(getTrigger());

    expect(document.activeElement).toBe(getOption(/^Сначала дорогие/));
  });

  it('связана с меню через aria-controls', () => {
    renderMenu();

    expect(getTrigger().getAttribute('aria-controls')).toBe(getPopover().closest('[popover]')?.id);
  });
});

describe('ProductSortMenu: варианты', () => {
  it('отмечает текущую сортировку', () => {
    renderMenu({ sort: 'popularity', order: 'desc' });

    expect(getOption(/^Сначала популярные/)).toHaveProperty('checked', true);
    expect(getOption(/^Сначала дешёвые/)).toHaveProperty('checked', false);
  });

  it('выбор варианта вызывает onChange с сортировкой', () => {
    const { onChange } = renderMenu();

    fireEvent.click(getOption(/^Сначала дешёвые/));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ sort: 'price', order: 'asc' }),
    );
  });

  it('клик по варианту закрывает меню', () => {
    renderMenu();
    fireEvent.click(getTrigger());

    fireEvent.click(screen.getByText('Сначала дешёвые'));

    expect(isOpen()).toBe(false);
  });

  it('Enter на варианте закрывает меню', () => {
    renderMenu();
    fireEvent.click(getTrigger());

    fireEvent.keyDown(getOption(/^Сначала с высоким рейтингом/), { key: 'Enter' });

    expect(isOpen()).toBe(false);
  });

  it('стрелки на варианте не закрывают меню', () => {
    renderMenu();
    fireEvent.click(getTrigger());

    fireEvent.keyDown(getOption(/^Сначала с высоким рейтингом/), { key: 'ArrowDown' });

    expect(isOpen()).toBe(true);
  });
});

describe('ProductSortMenu: подсказки', () => {
  it('показывает самый популярный товар, рейтинг и цены', () => {
    renderMenu();

    expect(getOption(/^Сначала популярные.*Чизбургер$/)).toBeDefined();
    expect(getOption(/^Сначала с высоким рейтингом.*4\.9$/)).toBeDefined();
    expect(getOption(/^Сначала дешёвые.*от\s99\s₽$/)).toBeDefined();
    expect(getOption(/^Сначала дорогие.*до\s650\s₽$/)).toBeDefined();
  });

  it('без подсказок показывает только названия', () => {
    render(<ProductSortMenu sorting={{ sort: 'rating', order: 'desc' }} onChange={vi.fn()} />);

    expect(getOption(/^Сначала популярные$/)).toBeDefined();
  });
});
