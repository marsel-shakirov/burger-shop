import { fireEvent, render, screen, within } from '@testing-library/react';
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
    categories: [
      { id: 11, slug: 'beef', name: 'Говядина' },
      { id: 12, slug: 'chicken', name: 'Курица' },
      { id: 13, slug: 'fish', name: 'Рыба' },
    ],
  },
  { id: 2, slug: 'drinks', name: 'Напитки', categories: [{ id: 21, slug: 'cola', name: 'Кола' }] },
];

const createProduct = (id: number, name: string, categoryId: number): Product => ({
  id,
  name,
  description: '',
  price: 100 * id,
  amount: 200,
  rating: 4.5,
  popularity: id,
  categoryId,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

const products: Product[] = [
  createProduct(1, 'Чизбургер', 11),
  createProduct(2, 'Гамбургер', 11),
  createProduct(3, 'Кола', 21),
  createProduct(4, 'Чикенбургер', 12),
];

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
  'GET /api/products': json(products),
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

const getSectionTitles = () =>
  screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);

const getProductNames = (sectionName: string) =>
  within(screen.getByRole('region', { name: sectionName }))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent);

let scrollTo: ReturnType<typeof vi.fn>;

beforeEach(() => {
  setSessionUser(null);
  scrollTo = vi.fn();
  vi.stubGlobal('scrollTo', scrollTo);
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
  it('показывает все товары по категориям в порядке меню', async () => {
    stubApi(api);

    renderPage();

    expect(await screen.findByRole('heading', { level: 2, name: 'Говядина' })).toBeDefined();
    expect(getSectionTitles()).toEqual(['Говядина', 'Курица', 'Кола']);
    expect(getProductNames('Говядина')).toEqual(['Чизбургер', 'Гамбургер']);
    expect(getProductNames('Курица')).toEqual(['Чикенбургер']);
    expect(getProductNames('Кола')).toEqual(['Кола']);
  });

  it('загружает все товары одним запросом', async () => {
    const fetchMock = stubApi(api);

    renderPage();
    await screen.findByRole('heading', { level: 2, name: 'Говядина' });

    const productRequests = fetchMock.mock.calls
      .map(([input]) => input as string)
      .filter((url) => url.startsWith('/api/products'));
    expect(productRequests).toHaveLength(1);
    expect(productRequests[0]).not.toMatch(/menu=|category=/);
  });

  it('в панели отмечены первое меню и его первая категория, без «Все» и пустых категорий', async () => {
    stubApi(api);

    renderPage();

    expect(await screen.findByRole('radio', { name: 'Бургеры' })).toHaveProperty('checked', true);
    expect(screen.getByRole('radio', { name: 'Говядина' })).toHaveProperty('checked', true);
    expect(screen.queryByRole('radio', { name: 'Все' })).toBeNull();
    expect(screen.queryByRole('radio', { name: 'Рыба' })).toBeNull();
  });

  it('клик по меню прокручивает к его первой категории', async () => {
    stubApi(api);
    renderPage();

    fireEvent.click(await screen.findByRole('radio', { name: 'Напитки' }));

    expect(screen.getByRole('radio', { name: 'Напитки' })).toHaveProperty('checked', true);
    expect(screen.getByRole('radio', { name: 'Кола' })).toHaveProperty('checked', true);
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ behavior: 'smooth' }),
    );
  });

  it('клик по категории прокручивает к ней', async () => {
    stubApi(api);
    renderPage();

    fireEvent.click(await screen.findByRole('radio', { name: 'Курица' }));

    expect(screen.getByRole('radio', { name: 'Курица' })).toHaveProperty('checked', true);
    expect(scrollTo).toHaveBeenCalledOnce();
  });

  it('раздел из адреса отмечен в панели, страница прокручена к нему', async () => {
    stubApi(api);

    renderPage('/?menu=burgers&category=chicken');

    expect(await screen.findByRole('radio', { name: 'Курица' })).toHaveProperty('checked', true);
    expect(scrollTo).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ behavior: 'instant' }),
    );
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
    expect(screen.queryByRole('radio', { name: 'Бургеры' })).toBeNull();

    stubApi(api);
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('heading', { level: 2, name: 'Говядина' })).toBeDefined();
  });

  it('если меню не загрузилось, показывает ошибку и все товары без разделов', async () => {
    stubApi({ ...api, 'GET /api/menu': json(null, 500) });

    renderPage();

    expect((await screen.findByRole('alert')).textContent).toMatch(/Меню не загрузилось/);
    expect(
      (await screen.findAllByRole('heading', { level: 3 })).map((heading) => heading.textContent),
    ).toEqual(expect.arrayContaining(['Чизбургер', 'Гамбургер', 'Кола', 'Чикенбургер']));
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('«Повторить» в панели загружает меню снова', async () => {
    stubApi({ ...api, 'GET /api/menu': json(null, 500) });
    renderPage();
    await screen.findByRole('alert');

    stubApi(api);
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('heading', { level: 2, name: 'Говядина' })).toBeDefined();
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

    expect(await screen.findByRole('heading', { level: 2, name: 'Говядина' })).toBeDefined();
    expect(screen.queryByRole('region', { name: 'Акции и бонусы' })).toBeNull();
  });
});
