import { fireEvent, render, screen } from '@testing-library/react';
import { type InitialEntry, useLocation } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ALL_PRODUCTS_PARAMS, type Product, productsQueryOptions } from '@/entities/product';
import { setSessionUser } from '@/entities/session';
import { createTestQueryClient, createWrapper } from '@/shared/testing';

import { ProductModal } from './product-modal';

const createProduct = (id: number, name: string): Product => ({
  id,
  name,
  description: `Описание: ${name}`,
  price: 250,
  amount: 200,
  rating: 4.8,
  popularity: 10,
  category_id: 1,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

const products = [createProduct(1, 'Чизбургер'), createProduct(2, 'Кола')];

const LocationProbe = () => <output data-testid="search">{useLocation().search}</output>;

const renderModal = (initialEntries: InitialEntry[]) => {
  const queryClient = createTestQueryClient();
  queryClient.setQueryData(productsQueryOptions(ALL_PRODUCTS_PARAMS).queryKey, products);

  return render(
    <>
      <ProductModal />
      <LocationProbe />
    </>,
    { wrapper: createWrapper({ queryClient, initialEntries }) },
  );
};

const getDialog = () => screen.getByRole<HTMLDialogElement>('dialog', { hidden: true });

beforeEach(() => {
  setSessionUser(null);
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ProductModal', () => {
  it('закрыта без товара в адресе', () => {
    renderModal(['/?menu=burgers']);

    expect(getDialog().open).toBe(false);
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('открывается с товаром из адреса и подписана его названием', () => {
    renderModal(['/?product=2']);

    expect(getDialog().open).toBe(true);
    expect(screen.getByRole('dialog', { name: 'Кола' })).toBe(getDialog());
    expect(screen.getByText('Описание: Кола')).toBeDefined();
  });

  it('показывает действия: избранное и добавление в корзину', () => {
    renderModal(['/?product=1']);

    expect(screen.getByRole('button', { name: 'В избранное: Чизбургер' })).toBeDefined();
    expect(screen.getByRole('button', { name: /^Добавить Чизбургер в корзину/ })).toBeDefined();
  });

  it('остаётся закрытой для неизвестного товара', () => {
    renderModal(['/?product=99']);

    expect(getDialog().open).toBe(false);
  });

  it('при закрытии убирает товар из адреса, сохраняя остальные параметры', () => {
    renderModal(['/?menu=drinks&product=2']);

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    expect(screen.getByTestId('search').textContent).toBe('?menu=drinks');
    expect(getDialog().open).toBe(false);
  });

  it('пока модалка закрывается, показывает последний товар', () => {
    renderModal(['/?product=2']);

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    expect(screen.getByRole('heading', { name: 'Кола', hidden: true })).toBeDefined();
  });
});
