import { describe, expect, it, vi } from 'vitest';

import { getPromosUseCase } from './get-promos.use-case.ts';
import { findActivePromos } from './promos.repository.ts';

vi.mock('./promos.repository.ts', () => ({ findActivePromos: vi.fn() }));

describe('getPromosUseCase', () => {
  it('возвращает активные акции в формате ответа с сохранением порядка', async () => {
    vi.mocked(findActivePromos).mockResolvedValue([
      {
        id: 2,
        kind: 'bonus',
        title: 'Бонусы за регистрацию',
        description: 'Начислим после входа',
        terms: 'Один раз',
        theme: 'pickle',
        image_path: null,
        product_id: null,
        menu_slug: null,
        category_slug: null,
        value: '500',
        value_caption: 'бонусов',
        cta_label: 'Зарегистрироваться',
      },
      {
        id: 1,
        kind: 'coupon',
        title: 'Скидка на бургеры',
        description: 'Только по будням',
        terms: 'Не суммируется',
        theme: 'mustard',
        image_path: null,
        product_id: null,
        menu_slug: 'burgers',
        category_slug: null,
        value: '-20%',
        value_caption: 'на бургеры',
        code: 'BURGER20',
      },
    ]);

    const promos = await getPromosUseCase();

    expect(promos.map((promo) => promo.id)).toEqual([2, 1]);
    expect(promos[0]).toMatchObject({ kind: 'bonus', ctaLabel: 'Зарегистрироваться' });
    expect(promos[1]).toMatchObject({
      kind: 'coupon',
      code: 'BURGER20',
      link: { menu: 'burgers' },
    });
  });

  it('возвращает пустой список без активных акций', async () => {
    vi.mocked(findActivePromos).mockResolvedValue([]);

    await expect(getPromosUseCase()).resolves.toEqual([]);
  });
});
