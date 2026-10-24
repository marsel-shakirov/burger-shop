import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCartActions } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { setSessionUser } from '@/entities/session';
import { createWrapper, json, pending, stubApi } from '@/shared/testing';

import { CartPage } from './cart-page';

const createProduct = (
  id: number,
  name: string,
  price: number,
  categoryId: number,
  popularity: number,
): Product => ({
  id,
  name,
  description: '',
  price,
  amount: 200,
  rating: 4.8,
  popularity,
  category_id: categoryId,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

const products = [
  createProduct(1, 'Чизбургер', 250, 1, 90),
  createProduct(2, 'Кола', 100, 2, 80),
  createProduct(3, 'Гамбургер', 200, 1, 50),
];

const user = { id: 'user-1', email: 'user@example.com' };

const renderPage = () => render(<CartPage />, { wrapper: createWrapper() });

const fillGuestCart = (...productIds: number[]) => {
  const { result } = renderHook(useCartActions, { wrapper: createWrapper() });
  act(() => {
    result.current.clearCart();
    productIds.forEach((id) => result.current.addItem(id));
  });
};

const getSummary = () => screen.getByRole('complementary', { name: 'Ваш заказ' });

beforeEach(() => {
  setSessionUser(null);
  fillGuestCart();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CartPage: пустая корзина', () => {
  it('показывает пустое состояние и ссылку в меню', async () => {
    stubApi({ 'GET /api/products': json(products) });

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Корзина' })).toBeDefined();
    expect(screen.getByText('Пока пусто')).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Вы ещё ничего не выбрали' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Открыть меню' }).getAttribute('href')).toBe('/');
    expect(await screen.findByRole('region', { name: 'Чаще всего заказывают' })).toBeDefined();
  });

  it('предлагает лидеров каждой категории и даёт добавить их в корзину', async () => {
    stubApi({ 'GET /api/products': json(products) });
    renderPage();
    const suggestions = await screen.findByRole('region', { name: 'Чаще всего заказывают' });

    expect(
      within(suggestions)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(['Чизбургер', 'Кола']);

    fireEvent.click(within(suggestions).getByRole('button', { name: /^Добавить Кола/ }));

    expect(await screen.findByText('1 товар')).toBeDefined();
  });
});

describe('CartPage: гостевая корзина с товарами', () => {
  beforeEach(() => {
    stubApi({ 'GET /api/products': json(products) });
    fillGuestCart(1, 1, 2);
  });

  it('показывает количество, позиции и итог', async () => {
    renderPage();

    expect(screen.getByText('3 товара')).toBeDefined();
    expect(await screen.findByRole('heading', { name: 'Чизбургер' })).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Кола' })).toBeDefined();
    expect(within(getSummary()).getByText('Итого').nextElementSibling?.getAttribute('value')).toBe(
      '600',
    );
  });

  it('пересчитывает итог при изменении количества', async () => {
    renderPage();
    await screen.findByRole('heading', { name: 'Чизбургер' });

    fireEvent.click(screen.getByRole('button', { name: 'Увеличить количество: Кола' }));

    expect(screen.getByText('4 товара')).toBeDefined();
    expect(within(getSummary()).getByText('Итого').nextElementSibling?.getAttribute('value')).toBe(
      '700',
    );
  });

  it('удаление последней позиции показывает пустую корзину', async () => {
    fillGuestCart(2);
    renderPage();
    await screen.findByRole('heading', { name: 'Кола' });

    fireEvent.click(screen.getByRole('button', { name: 'Удалить Кола из корзины' }));

    expect(screen.getByRole('heading', { name: 'Вы ещё ничего не выбрали' })).toBeDefined();
  });

  it('«Очистить корзину» показывает пустую корзину', async () => {
    renderPage();
    await screen.findByRole('heading', { name: 'Чизбургер' });

    fireEvent.click(screen.getByRole('button', { name: 'Очистить корзину' }));

    expect(screen.getByText('Пока пусто')).toBeDefined();
  });

  it('кнопка оформления пока недоступна и объясняет почему', async () => {
    renderPage();

    const checkout = await screen.findByRole('button', {
      name: 'Оформить заказ',
      description: 'Оформление заказа скоро появится',
    });

    expect(checkout).toHaveProperty('disabled', true);
  });
});

describe('CartPage: корзина пользователя', () => {
  beforeEach(() => {
    setSessionUser(user);
  });

  it('пока корзина загружается, показывает «Загружаем…»', () => {
    stubApi({ 'GET /api/cart': pending, 'GET /api/products': json(products) });

    renderPage();

    expect(screen.getByText('Загружаем…')).toBeDefined();
    expect(screen.queryByText('Пока пусто')).toBeNull();
  });

  it('показывает корзину с сервера', async () => {
    stubApi({
      'GET /api/cart': json({ items: [{ productId: 3, quantity: 2 }] }),
      'GET /api/products': json(products),
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Гамбургер' })).toBeDefined();
    expect(screen.getByText('2 товара')).toBeDefined();
  });

  it('если товары не загрузились, показывает ошибку и загружает их снова', async () => {
    const cart = json({ items: [{ productId: 3, quantity: 2 }] });
    stubApi({ 'GET /api/cart': cart, 'GET /api/products': json(null, 500) });
    renderPage();

    expect((await screen.findByRole('alert')).textContent).toMatch(/Товары не загрузились/);

    stubApi({ 'GET /api/cart': cart, 'GET /api/products': json(products) });
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('heading', { name: 'Гамбургер' })).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('если корзина не загрузилась, загружает её снова', async () => {
    stubApi({ 'GET /api/cart': json(null, 500), 'GET /api/products': json(products) });
    renderPage();

    await screen.findByRole('alert');

    stubApi({
      'GET /api/cart': json({ items: [{ productId: 1, quantity: 1 }] }),
      'GET /api/products': json(products),
    });
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('heading', { name: 'Чизбургер' })).toBeDefined();
  });
});
