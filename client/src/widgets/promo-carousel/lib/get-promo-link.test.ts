import { describe, expect, it } from 'vitest';

import { getPromoLink } from './get-promo-link';

describe('getPromoLink', () => {
  it('ведёт на главную, если ссылки нет', () => {
    expect(getPromoLink()).toBe('/');
  });

  it('ведёт в меню', () => {
    expect(getPromoLink({ menu: 'burgers' })).toEqual({ pathname: '/', search: '?menu=burgers' });
  });

  it('ведёт в категорию меню', () => {
    expect(getPromoLink({ menu: 'burgers', category: 'beef' })).toEqual({
      pathname: '/',
      search: '?menu=burgers&category=beef',
    });
  });

  it('открывает товар в меню', () => {
    expect(getPromoLink({ menu: 'drinks', productId: 7 })).toEqual({
      pathname: '/',
      search: '?menu=drinks&product=7',
    });
  });

  it('открывает товар в категории', () => {
    expect(getPromoLink({ menu: 'burgers', category: 'beef', productId: 42 })).toEqual({
      pathname: '/',
      search: '?menu=burgers&category=beef&product=42',
    });
  });

  it('не добавляет пустую категорию', () => {
    expect(getPromoLink({ menu: 'burgers', category: '' })).toEqual({
      pathname: '/',
      search: '?menu=burgers',
    });
  });

  it('кодирует значения параметров', () => {
    expect(getPromoLink({ menu: 'бургеры & роллы' })).toEqual({
      pathname: '/',
      search: '?menu=%D0%B1%D1%83%D1%80%D0%B3%D0%B5%D1%80%D1%8B+%26+%D1%80%D0%BE%D0%BB%D0%BB%D1%8B',
    });
  });
});
