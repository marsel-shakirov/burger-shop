import { describe, expect, it } from 'vitest';

import type { CatalogMenuGroup, CatalogSection } from '../model/catalog.types';
import {
  findActiveSection,
  getActiveSection,
  getCatalogSectionId,
  getCatalogSections,
  isSameSection,
  resolveCatalogSection,
} from './catalog-section';

const beef: CatalogSection = { menuSlug: 'burgers', categorySlug: 'beef' };
const chicken: CatalogSection = { menuSlug: 'burgers', categorySlug: 'chicken' };
const cola: CatalogSection = { menuSlug: 'drinks', categorySlug: 'cola' };
const sections = [beef, chicken, cola];

describe('getCatalogSectionId', () => {
  it('собирает id из меню и категории', () => {
    expect(getCatalogSectionId(beef)).toBe('catalog-burgers-beef');
  });
});

describe('isSameSection', () => {
  it('сравнивает меню и категорию', () => {
    expect(isSameSection(beef, { ...beef })).toBe(true);
    expect(isSameSection(beef, chicken)).toBe(false);
    expect(isSameSection(beef, { menuSlug: 'drinks', categorySlug: 'beef' })).toBe(false);
  });
});

describe('getCatalogSections', () => {
  it('разворачивает группы в список разделов', () => {
    const groups: CatalogMenuGroup[] = [
      {
        menu: { id: 1, slug: 'burgers', name: 'Бургеры', categories: [] },
        categories: [
          { category: { id: 11, slug: 'beef', name: 'Говядина' }, products: [] },
          { category: { id: 12, slug: 'chicken', name: 'Курица' }, products: [] },
        ],
      },
      {
        menu: { id: 2, slug: 'drinks', name: 'Напитки', categories: [] },
        categories: [{ category: { id: 21, slug: 'cola', name: 'Кола' }, products: [] }],
      },
    ];

    expect(getCatalogSections(groups)).toEqual(sections);
  });
});

describe('resolveCatalogSection', () => {
  it('без меню ничего не выбирает', () => {
    expect(resolveCatalogSection(sections, undefined, 'beef')).toBeUndefined();
  });

  it('находит категорию меню', () => {
    expect(resolveCatalogSection(sections, 'burgers', 'chicken')).toBe(chicken);
  });

  it('без категории или с неизвестной категорией берёт первую категорию меню', () => {
    expect(resolveCatalogSection(sections, 'burgers')).toBe(beef);
    expect(resolveCatalogSection(sections, 'burgers', 'fish')).toBe(beef);
  });

  it('не берёт категорию из другого меню', () => {
    expect(resolveCatalogSection(sections, 'burgers', 'cola')).toBe(beef);
  });

  it('для неизвестного меню ничего не выбирает', () => {
    expect(resolveCatalogSection(sections, 'desserts')).toBeUndefined();
  });
});

describe('getActiveSection', () => {
  it('сначала берёт текущий раздел', () => {
    expect(getActiveSection(sections, cola, 'burgers', 'chicken')).toBe(cola);
  });

  it('без текущего раздела берёт раздел из адреса', () => {
    expect(getActiveSection(sections, undefined, 'burgers', 'chicken')).toBe(chicken);
  });

  it('без текущего раздела и адреса берёт первый раздел', () => {
    expect(getActiveSection(sections)).toBe(beef);
    expect(getActiveSection(sections, undefined, 'desserts')).toBe(beef);
  });

  it('без разделов ничего не выбирает', () => {
    expect(getActiveSection([])).toBeUndefined();
  });
});

describe('findActiveSection', () => {
  it('выбирает последний раздел, верх которого дошёл до линии', () => {
    const positions = [
      { section: beef, top: -400 },
      { section: chicken, top: 80 },
      { section: cola, top: 600 },
    ];

    expect(findActiveSection(positions, 81, false)).toBe(chicken);
  });

  it('пока ни один раздел не дошёл до линии, выбирает первый', () => {
    expect(findActiveSection([{ section: beef, top: 300 }], 81, false)).toBe(beef);
  });

  it('в конце страницы выбирает последний раздел, даже если он не дошёл до линии', () => {
    const positions = [
      { section: beef, top: -400 },
      { section: cola, top: 500 },
    ];

    expect(findActiveSection(positions, 81, true)).toBe(cola);
  });

  it('без разделов ничего не выбирает', () => {
    expect(findActiveSection([], 81, false)).toBeUndefined();
    expect(findActiveSection([], 81, true)).toBeUndefined();
  });
});
