import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFavoriteActions, useFavoriteIds } from '@/entities/favorite';
import type { Product } from '@/entities/product';
import { setSessionUser } from '@/entities/session';
import { routes } from '@/shared/config';
import { useLastSearchStore } from '@/shared/lib';
import { createWrapper, json, pending, stubApi } from '@/shared/testing';

import { FavoritePage } from './favorite-page';

const createProduct = (id: number, name: string): Product => ({
  id,
  name,
  description: '',
  price: 250,
  amount: 200,
  rating: 4.8,
  popularity: 10,
  category_id: 1,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

const products = [createProduct(1, 'Чизбургер'), createProduct(2, 'Кола'), createProduct(3, 'Фри')];

const renderPage = () => render(<FavoritePage />, { wrapper: createWrapper() });

const setGuestFavorites = (...productIds: number[]) => {
  const wrapper = createWrapper();
  const ids = renderHook(useFavoriteIds, { wrapper }).result.current.productIds;
  const { result } = renderHook(useFavoriteActions, { wrapper });

  act(() => {
    ids.forEach((id) => result.current.toggleFavorite(id));
    [...productIds].reverse().forEach((id) => result.current.toggleFavorite(id));
  });
};

const getCardTitles = () =>
  screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);

beforeEach(() => {
  setSessionUser(null);
  setGuestFavorites();
  useLastSearchStore.setState(useLastSearchStore.getInitialState(), true);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('FavoritePage: пусто', () => {
  it('показывает пустое состояние со ссылкой в меню с последними фильтрами', () => {
    useLastSearchStore.getState().saveSearch(routes.home, '?menu=drinks');
    stubApi({ 'GET /api/products': json(products) });

    renderPage();

    expect(screen.getByRole('heading', { name: 'В избранном пока пусто' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Перейти в меню' }).getAttribute('href')).toBe(
      '/?menu=drinks',
    );
  });
});

describe('FavoritePage: есть товары', () => {
  beforeEach(() => {
    setGuestFavorites(3, 1);
  });

  it('пока товары загружаются, показывает скелетон', () => {
    stubApi({ 'GET /api/products': pending });

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Избранное' })).toBeDefined();
    expect(screen.getByRole('region', { name: 'Загрузка товаров' })).toBeDefined();
  });

  it('показывает избранные товары в порядке добавления', async () => {
    stubApi({ 'GET /api/products': json(products) });

    renderPage();

    await screen.findByRole('heading', { name: 'Фри' });
    expect(getCardTitles()).toEqual(['Фри', 'Чизбургер']);
  });

  it('карточки отмечены как избранные', async () => {
    stubApi({ 'GET /api/products': json(products) });

    renderPage();

    expect(
      (await screen.findByRole('button', { name: 'В избранное: Фри' })).getAttribute(
        'aria-pressed',
      ),
    ).toBe('true');
  });

  it('если товары не загрузились, показывает ошибку вместо пустого состояния', async () => {
    stubApi({ 'GET /api/products': json(null, 500) });

    renderPage();

    expect((await screen.findByRole('alert')).textContent).toMatch(/Товары не загрузились/);
    expect(screen.queryByRole('heading', { name: 'В избранном пока пусто' })).toBeNull();
  });

  it('«Повторить» загружает товары снова', async () => {
    stubApi({ 'GET /api/products': json(null, 500) });
    renderPage();
    await screen.findByRole('alert');

    stubApi({ 'GET /api/products': json(products) });
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    await screen.findByRole('heading', { name: 'Фри' });
    expect(getCardTitles()).toEqual(['Фри', 'Чизбургер']);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
