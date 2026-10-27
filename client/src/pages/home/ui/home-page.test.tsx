import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type Menu, menusQueryOptions } from '@/entities/menu';
import type { Product } from '@/entities/product';
import { type Promo, promosQueryOptions } from '@/entities/promo';
import { setSessionUser } from '@/entities/session';
import {
  type ApiHandlers,
  createTestQueryClient,
  createWrapper,
  json,
  pending,
  stubApi,
} from '@/shared/testing';

import { HomePage } from './home-page';

const menus: Menu[] = [
  {
    id: 1,
    slug: 'burgers',
    name: 'Бургеры',
    categories: [{ id: 11, slug: 'beef', name: 'Говядина' }],
  },
  { id: 2, slug: 'drinks', name: 'Напитки', categories: [] },
];

const createProduct = (id: number, name: string, menuId: number): Product => ({
  id,
  name,
  description: '',
  price: 100 * id,
  amount: 200,
  rating: 4.5,
  popularity: id,
  categoryId: menuId,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

const productsByMenu: Record<string, Product[]> = {
  burgers: [createProduct(1, 'Чизбургер', 1), createProduct(2, 'Гамбургер', 1)],
  drinks: [createProduct(3, 'Кола', 2)],
};

const promos: Promo[] = [
  {
    id: 1,
    kind: 'coupon',
    title: 'Скидка на первый заказ',
    description: '',
    terms: 'До конца месяца',
    theme: 'mustard',
    value: '−20%',
    valueCaption: 'на заказ',
    code: 'FIRST20',
  },
];

const api: ApiHandlers = {
  'GET /api/menu': json(menus),
  'GET /api/promos': json(promos),
  'GET /api/products': (url) =>
    Response.json(productsByMenu[url.searchParams.get('menu') ?? ''] ?? []),
};

type Preloaded = 'promos' | 'menus';

const renderPage = (initialEntry = '/', preloaded: Preloaded = 'promos') => {
  const queryClient = createTestQueryClient();

  if (preloaded === 'promos') queryClient.setQueryData(promosQueryOptions().queryKey, promos);
  else queryClient.setQueryData(menusQueryOptions().queryKey, menus);

  return render(<HomePage />, {
    wrapper: createWrapper({ queryClient, initialEntries: [initialEntry] }),
  });
};

const getProductNames = () => {
  const catalog = screen.queryByRole('heading', { level: 2 })?.parentElement;

  return catalog
    ? within(catalog)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    : [];
};

beforeEach(() => {
  setSessionUser(null);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('HomePage: загрузка', () => {
  it('пока данные загружаются, показывает заголовок и скелетон товаров', () => {
    stubApi({ 'GET /api/menu': pending, 'GET /api/promos': pending, 'GET /api/products': pending });

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Меню' })).toBeDefined();
    expect(screen.getByRole('region', { name: 'Загрузка товаров' })).toBeDefined();
  });
});

describe('HomePage: каталог', () => {
  it('показывает разделы меню, заголовок подборки и товары раздела по умолчанию', async () => {
    stubApi(api);

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Все бургеры' })).toBeDefined();
    expect(await screen.findByRole('radio', { name: 'Бургеры' })).toHaveProperty('checked', true);
    expect(getProductNames()).toEqual(['Чизбургер', 'Гамбургер']);
    expect(screen.queryByRole('button', { name: /^Сортировка:/ })).toBeNull();
  });

  it('смена раздела загружает его товары', async () => {
    const fetchMock = stubApi(api);
    renderPage();
    await screen.findByRole('heading', { name: 'Все бургеры' });

    fireEvent.click(await screen.findByRole('radio', { name: 'Напитки' }));

    expect(await screen.findByRole('heading', { name: 'Все напитки' })).toBeDefined();
    await waitFor(() => expect(getProductNames()).toEqual(['Кола']));
    expect(fetchMock.mock.calls.some(([input]) => (input as string).includes('menu=drinks'))).toBe(
      true,
    );
  });

  it('категория из адреса попадает в заголовок и запрос', async () => {
    const fetchMock = stubApi(api);

    renderPage('/?menu=burgers&category=beef');

    expect(await screen.findByRole('heading', { name: 'Говядина' })).toBeDefined();
    expect(
      fetchMock.mock.calls.some(([input]) => (input as string).includes('category=beef')),
    ).toBe(true);
  });

  it('товар можно добавить в корзину прямо из каталога', async () => {
    stubApi(api);
    renderPage();

    fireEvent.click(await screen.findByRole('button', { name: /^Добавить Гамбургер/ }));

    expect(screen.getByRole('group', { name: 'Изменение количества: Гамбургер' })).toBeDefined();
  });
});

describe('HomePage: ошибки', () => {
  it('если товары не загрузились, показывает ошибку и загружает их снова', async () => {
    stubApi({ ...api, 'GET /api/products': json(null, 500) });
    renderPage();

    expect((await screen.findByRole('alert')).textContent).toMatch(/Товары не загрузились/);

    stubApi(api);
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('heading', { name: 'Все бургеры' })).toBeDefined();
  });

  it('если меню не загрузилось, показывает ошибку, а товары раздела по умолчанию', async () => {
    stubApi({ ...api, 'GET /api/menu': json(null, 500) });

    renderPage();

    expect((await screen.findByRole('alert')).textContent).toMatch(/Меню не загрузилось/);
    await waitFor(() => expect(getProductNames()).toEqual(['Чизбургер', 'Гамбургер']));
  });
});

describe('HomePage: акции', () => {
  it('показывает карусель акций с промокодом', async () => {
    stubApi(api);

    renderPage('/', 'menus');

    const carousel = await screen.findByRole('region', { name: 'Акции и бонусы' });
    expect(within(carousel).getByRole('heading', { name: 'Скидка на первый заказ' })).toBeDefined();
    expect(within(carousel).getByRole('button', { name: 'Скопировать код' })).toBeDefined();
  });

  it('если акции не загрузились, страница работает без карусели', async () => {
    stubApi({ ...api, 'GET /api/promos': json(null, 500) });

    renderPage('/', 'menus');

    expect(await screen.findByRole('heading', { name: 'Все бургеры' })).toBeDefined();
    expect(screen.queryByRole('region', { name: 'Акции и бонусы' })).toBeNull();
  });
});
