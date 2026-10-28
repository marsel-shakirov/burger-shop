import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type Promo, promosQueryOptions } from '@/entities/promo';
import type { useSessionStatus } from '@/entities/session';
import { createTestQueryClient, createWrapper, json, stubApi } from '@/shared/testing';

import { PromoCarousel } from './promo-carousel';

type SessionStatus = ReturnType<typeof useSessionStatus>;

const session = vi.hoisted(() => {
  const state: { status: SessionStatus } = { status: 'guest' };

  return state;
});

vi.mock('@/entities/session', () => ({ useSessionStatus: () => session.status }));

const coupon: Promo = {
  id: 1,
  kind: 'coupon',
  title: 'Скидка на напитки',
  description: '',
  terms: 'До конца месяца',
  theme: 'mustard',
  value: '−20%',
  valueCaption: 'на напитки',
  code: 'DRINK20',
  link: { menu: 'drinks', category: 'cola' },
};

const bonus: Promo = {
  id: 2,
  kind: 'bonus',
  title: 'Бонусы за регистрацию',
  description: '',
  terms: 'Для новых пользователей',
  theme: 'pickle',
  value: '200',
  valueCaption: 'бонусов',
  ctaLabel: 'Получить',
};

const renderCarousel = (promos?: Promo[]) => {
  const queryClient = createTestQueryClient();
  if (promos) queryClient.setQueryData(promosQueryOptions().queryKey, promos);

  return render(<PromoCarousel />, { wrapper: createWrapper({ queryClient }) });
};

const getCarousel = () => screen.getByRole('region', { name: 'Акции и бонусы' });

beforeEach(() => {
  session.status = 'guest';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PromoCarousel: слайды', () => {
  it('купон ведёт в каталог по ссылке акции и даёт скопировать код', () => {
    renderCarousel([coupon]);

    expect(
      within(getCarousel()).getByRole('link', { name: 'Скидка на напитки' }).getAttribute('href'),
    ).toBe('/?menu=drinks&category=cola');
    expect(within(getCarousel()).getByText('DRINK20')).toBeDefined();
    expect(within(getCarousel()).getByRole('button', { name: 'Скопировать код' })).toBeDefined();
  });

  it('бонусная акция ведёт на регистрацию и показывает призыв без кнопки копирования', () => {
    renderCarousel([bonus]);

    expect(
      within(getCarousel())
        .getByRole('link', { name: 'Бонусы за регистрацию' })
        .getAttribute('href'),
    ).toBe('/profile/register');
    expect(within(getCarousel()).getByText('Получить')).toBeDefined();
    expect(within(getCarousel()).queryByRole('button', { name: 'Скопировать код' })).toBeNull();
  });
});

describe('PromoCarousel: статус сессии', () => {
  it('гостю показывает и купоны, и бонусные акции', () => {
    renderCarousel([coupon, bonus]);

    expect(within(getCarousel()).getAllByRole('group', { name: /из 2$/ })).toHaveLength(2);
  });

  it('пользователю скрывает бонусные акции за регистрацию', () => {
    session.status = 'authenticated';

    renderCarousel([coupon, bonus]);

    expect(within(getCarousel()).getAllByRole('group', { name: /из 1$/ })).toHaveLength(1);
    expect(screen.queryByText('Бонусы за регистрацию')).toBeNull();
  });

  it('пользователю без купонов не показывает карусель', () => {
    session.status = 'authenticated';

    const { container } = renderCarousel([bonus]);

    expect(container.childElementCount).toBe(0);
  });

  it('пока сессия загружается, показывает скелетон вместо акций', () => {
    session.status = 'loading';

    const { container } = renderCarousel([coupon, bonus]);

    expect(screen.queryByRole('region', { name: 'Акции и бонусы' })).toBeNull();
    expect(container.childElementCount).toBe(1);
  });
});

describe('PromoCarousel: управление', () => {
  it('для нескольких акций показывает точки и стрелки', () => {
    renderCarousel([coupon, bonus]);

    expect(within(getCarousel()).getAllByRole('button', { name: /^Показать слайд/ })).toHaveLength(
      2,
    );
    expect(within(getCarousel()).getByRole('button', { name: 'Следующий слайд' })).toBeDefined();
    expect(within(getCarousel()).getByText('Слайд 1 из 2')).toBeDefined();
  });

  it('для одной акции управление не показывает', () => {
    renderCarousel([coupon]);

    expect(within(getCarousel()).queryByRole('button', { name: /слайд/i })).toBeNull();
  });
});

describe('PromoCarousel: загрузка', () => {
  it('без акций ничего не показывает', () => {
    const { container } = renderCarousel([]);

    expect(container.childElementCount).toBe(0);
  });

  it('если акции не загрузились, ничего не показывает', async () => {
    stubApi({ 'GET /api/promos': json(null, 500) });

    const { container } = renderCarousel();

    await vi.waitFor(() => expect(container.childElementCount).toBe(0));
  });
});
