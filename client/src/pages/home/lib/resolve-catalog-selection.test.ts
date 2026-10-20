import { describe, expect, it } from 'vitest';

import type { Menu } from '@/entities/menu';

import { resolveCatalogSelection } from './resolve-catalog-selection';

const drinks: Menu = {
  id: 1,
  slug: 'drinks',
  name: 'Напитки',
  categories: [
    { id: 11, slug: 'cold', name: 'Холодные' },
    { id: 12, slug: 'hot', name: 'Горячие' },
  ],
};

const burgers: Menu = {
  id: 2,
  slug: 'burgers',
  name: 'Бургеры',
  categories: [
    { id: 21, slug: 'beef', name: 'Говядина' },
    { id: 22, slug: 'chicken', name: 'Курица' },
  ],
};

const menus = [drinks, burgers];

describe('resolveCatalogSelection', () => {
  it('возвращает исходные slug, пока меню не загружены', () => {
    expect(resolveCatalogSelection(undefined, 'drinks', 'hot')).toEqual({
      menuSlug: 'drinks',
      categorySlug: 'hot',
    });
  });

  it('возвращает исходные slug для пустого списка меню', () => {
    expect(resolveCatalogSelection([], 'drinks', 'hot')).toEqual({
      menuSlug: 'drinks',
      categorySlug: 'hot',
    });
  });

  it('находит меню и категорию', () => {
    expect(resolveCatalogSelection(menus, 'drinks', 'hot')).toEqual({
      menuSlug: 'drinks',
      categorySlug: 'hot',
      menu: drinks,
      category: drinks.categories[1],
    });
  });

  it('возвращает меню без категории, если она не указана', () => {
    expect(resolveCatalogSelection(menus, 'drinks')).toEqual({
      menuSlug: 'drinks',
      categorySlug: undefined,
      menu: drinks,
      category: undefined,
    });
  });

  it('сбрасывает неизвестную категорию', () => {
    expect(resolveCatalogSelection(menus, 'drinks', 'juice')).toMatchObject({
      menuSlug: 'drinks',
      categorySlug: undefined,
      category: undefined,
    });
  });

  it('не находит категорию из другого меню', () => {
    expect(resolveCatalogSelection(menus, 'drinks', 'beef')).toMatchObject({
      categorySlug: undefined,
      category: undefined,
    });
  });

  it('для неизвестного меню выбирает меню по умолчанию, а не первое в списке', () => {
    expect(resolveCatalogSelection(menus, 'pizza', 'chicken')).toEqual({
      menuSlug: 'burgers',
      categorySlug: 'chicken',
      menu: burgers,
      category: burgers.categories[1],
    });
  });

  it('выбирает первое меню, если нет ни запрошенного, ни меню по умолчанию', () => {
    expect(resolveCatalogSelection([drinks], 'pizza')).toMatchObject({
      menuSlug: 'drinks',
      menu: drinks,
    });
  });

  it('возвращает тот же объект меню, а не копию', () => {
    expect(resolveCatalogSelection(menus, 'burgers').menu).toBe(burgers);
  });
});
