import { describe, expect, it } from 'vitest';

import { toProductImage } from '../../lib/product-image.ts';
import { toPromoResponse } from './promos.mapper.ts';
import type { PromoRow } from './promos.types.ts';

const base = {
  id: 1,
  title: 'Скидка на бургеры',
  description: 'Только по будням',
  terms: 'Не суммируется с другими акциями',
  theme: 'mustard',
  image_path: null,
  product_id: null,
  menu_slug: null,
  category_slug: null,
} as const;

const coupon = (overrides: Partial<PromoRow> = {}) =>
  ({
    ...base,
    kind: 'coupon',
    value: '-20%',
    value_caption: 'на всё меню',
    code: 'BURGER20',
    ...overrides,
  }) as PromoRow;

const bonus = (overrides: Partial<PromoRow> = {}) =>
  ({
    ...base,
    kind: 'bonus',
    value: '500',
    value_caption: 'бонусов за регистрацию',
    cta_label: 'Зарегистрироваться',
    ...overrides,
  }) as PromoRow;

describe('toPromoResponse', () => {
  it('собирает купон с кодом', () => {
    expect(toPromoResponse(coupon())).toEqual({
      id: 1,
      title: 'Скидка на бургеры',
      description: 'Только по будням',
      terms: 'Не суммируется с другими акциями',
      theme: 'mustard',
      link: undefined,
      kind: 'coupon',
      value: '-20%',
      valueCaption: 'на всё меню',
      code: 'BURGER20',
    });
  });

  it('собирает бонусную акцию с текстом кнопки и без кода', () => {
    const response = toPromoResponse(bonus());

    expect(response).toMatchObject({
      kind: 'bonus',
      value: '500',
      valueCaption: 'бонусов за регистрацию',
      ctaLabel: 'Зарегистрироваться',
    });
    expect(response).not.toHaveProperty('code');
  });

  it('не добавляет купону текст кнопки', () => {
    expect(toPromoResponse(coupon())).not.toHaveProperty('ctaLabel');
  });

  it('добавляет картинки, если у акции есть изображение', () => {
    expect(toPromoResponse(coupon({ image_path: 'promos/burger-week' }))).toMatchObject(
      toProductImage('promos/burger-week'),
    );
  });

  it('не добавляет картинки, если изображения нет', () => {
    const response = toPromoResponse(coupon());

    expect(response).not.toHaveProperty('imageUrl');
    expect(response).not.toHaveProperty('imageSrcSet');
  });
});

describe('toPromoResponse: ссылка', () => {
  it('не строит ссылку без меню', () => {
    expect(
      toPromoResponse(coupon({ category_slug: 'classic', product_id: 5 })).link,
    ).toBeUndefined();
  });

  it('ведёт на меню', () => {
    expect(toPromoResponse(coupon({ menu_slug: 'burgers' })).link).toEqual({ menu: 'burgers' });
  });

  it('ведёт на категорию в меню', () => {
    expect(
      toPromoResponse(coupon({ menu_slug: 'burgers', category_slug: 'classic' })).link,
    ).toEqual({ menu: 'burgers', category: 'classic' });
  });

  it('ведёт на товар в меню', () => {
    expect(
      toPromoResponse(coupon({ menu_slug: 'burgers', category_slug: 'classic', product_id: 5 }))
        .link,
    ).toEqual({ menu: 'burgers', category: 'classic', productId: 5 });
  });

  it('ведёт на товар без категории', () => {
    expect(toPromoResponse(coupon({ menu_slug: 'burgers', product_id: 5 })).link).toEqual({
      menu: 'burgers',
      productId: 5,
    });
  });
});
