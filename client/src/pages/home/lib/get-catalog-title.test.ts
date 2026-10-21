import { describe, expect, it } from 'vitest';

import type { Category, Menu } from '@/entities/menu';

import { getCatalogTitle } from './get-catalog-title';

const beef: Category = { id: 11, slug: 'beef', name: 'Говяжьи' };

const burgers: Menu = { id: 1, slug: 'burgers', name: 'Бургеры', categories: [beef] };

describe('getCatalogTitle', () => {
  it('возвращает «Все», если меню и категория не выбраны', () => {
    expect(getCatalogTitle({})).toBe('Все');
  });

  it('возвращает «Все» и название меню строчными буквами', () => {
    expect(getCatalogTitle({ menu: burgers })).toBe('Все бургеры');
  });

  it('переводит в нижний регистр всё название меню', () => {
    expect(getCatalogTitle({ menu: { ...burgers, name: 'Напитки И ДЕСЕРТЫ' } })).toBe(
      'Все напитки и десерты',
    );
  });

  it('возвращает название категории, если она выбрана', () => {
    expect(getCatalogTitle({ menu: burgers, category: beef })).toBe('Говяжьи');
  });

  it('не меняет регистр названия категории', () => {
    expect(getCatalogTitle({ menu: burgers, category: { ...beef, name: 'BBQ' } })).toBe('BBQ');
  });

  it('возвращает название категории, даже если меню не передано', () => {
    expect(getCatalogTitle({ category: beef })).toBe('Говяжьи');
  });
});
