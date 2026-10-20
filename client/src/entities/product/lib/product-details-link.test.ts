import { describe, expect, it } from 'vitest';

import {
  deleteProductDetailsParam,
  isOpenedFromList,
  parseProductDetailsId,
  setProductDetailsParam,
} from './product-details-link';

describe('parseProductDetailsId', () => {
  it('возвращает id товара числом', () => {
    expect(parseProductDetailsId(new URLSearchParams('product=42'))).toBe(42);
  });

  it('игнорирует остальные параметры', () => {
    expect(parseProductDetailsId(new URLSearchParams('menu=burgers&product=7&sort=price'))).toBe(7);
  });

  it('убирает ведущие нули', () => {
    expect(parseProductDetailsId(new URLSearchParams('product=007'))).toBe(7);
  });

  it.each([
    ['параметра нет', ''],
    ['пустое значение', 'product='],
    ['буквы', 'product=abc'],
    ['дробное число', 'product=4.2'],
    ['отрицательное число', 'product=-1'],
    ['экспоненциальная запись', 'product=1e3'],
    ['пробел перед числом', 'product=%2042'],
  ])('возвращает undefined: %s', (_case, query) => {
    expect(parseProductDetailsId(new URLSearchParams(query))).toBeUndefined();
  });
});

describe('setProductDetailsParam', () => {
  it('добавляет параметр product', () => {
    const params = new URLSearchParams();

    setProductDetailsParam(params, 42);

    expect(params.toString()).toBe('product=42');
  });

  it('заменяет предыдущий товар', () => {
    const params = new URLSearchParams('product=1');

    setProductDetailsParam(params, 42);

    expect(params.toString()).toBe('product=42');
  });

  it('сохраняет остальные параметры', () => {
    const params = new URLSearchParams('menu=burgers&category=beef');

    setProductDetailsParam(params, 42);

    expect(params.toString()).toBe('menu=burgers&category=beef&product=42');
  });

  it('записывает id так, что parseProductDetailsId читает его обратно', () => {
    const params = new URLSearchParams();

    setProductDetailsParam(params, 42);

    expect(parseProductDetailsId(params)).toBe(42);
  });
});

describe('deleteProductDetailsParam', () => {
  it('удаляет параметр product и сохраняет остальные', () => {
    const params = new URLSearchParams('menu=burgers&product=42&sort=price');

    deleteProductDetailsParam(params);

    expect(params.toString()).toBe('menu=burgers&sort=price');
  });

  it('ничего не меняет, если параметра нет', () => {
    const params = new URLSearchParams('menu=burgers');

    deleteProductDetailsParam(params);

    expect(params.toString()).toBe('menu=burgers');
  });
});

describe('isOpenedFromList', () => {
  it('возвращает true для состояния, которое ставит ссылка из списка', () => {
    expect(isOpenedFromList({ openedFromList: true })).toBe(true);
  });

  it('возвращает true, если в состоянии есть и другие поля', () => {
    expect(isOpenedFromList({ openedFromList: true, scroll: 120 })).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['строка', 'openedFromList'],
    ['число', 1],
    ['пустой объект', {}],
    ['openedFromList: false', { openedFromList: false }],
    ['openedFromList не boolean', { openedFromList: 'true' }],
  ])('возвращает false: %s', (_case, state) => {
    expect(isOpenedFromList(state)).toBe(false);
  });
});
