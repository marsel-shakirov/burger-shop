import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient, createWrapper, json, pending, stubApi } from '@/shared/testing';

import { ALL_PRODUCTS_PARAMS } from '../config/product.constants';
import type { Product } from '../model/product.types';
import { productsQueryOptions } from './products-query-options';
import { useProduct } from './use-product';

const createProduct = (id: number, name: string): Product => ({
  id,
  name,
  description: '',
  price: 250,
  amount: 200,
  rating: 4.8,
  popularity: 10,
  categoryId: 1,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

type TestQueryClient = ReturnType<typeof createTestQueryClient>;

const burgers = [createProduct(1, 'Чизбургер'), createProduct(2, 'Гамбургер')];

const drinks = [createProduct(3, 'Кола')];

const renderUseProduct = (
  productId: number | undefined,
  seed: (client: TestQueryClient) => void = () => {},
) => {
  const queryClient = createTestQueryClient();
  seed(queryClient);

  return renderHook(() => useProduct(productId), { wrapper: createWrapper({ queryClient }) });
};

const seedCatalog = (client: TestQueryClient) => {
  client.setQueryData(
    productsQueryOptions({ menu: 'burgers', sorting: { sort: 'rating', order: 'desc' } }).queryKey,
    burgers,
  );
  client.setQueryData(
    productsQueryOptions({ menu: 'drinks', sorting: { sort: 'price', order: 'asc' } }).queryKey,
    drinks,
  );
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useProduct', () => {
  it('без id ничего не запрашивает', () => {
    const fetchMock = stubApi({ 'GET /api/products': json(burgers) });

    const { result } = renderUseProduct(undefined);

    expect(result.current.data).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('находит товар в полном списке', () => {
    const { result } = renderUseProduct(3, (client) =>
      client.setQueryData(productsQueryOptions(ALL_PRODUCTS_PARAMS).queryKey, [
        ...burgers,
        ...drinks,
      ]),
    );

    expect(result.current.data?.name).toBe('Кола');
  });

  it('пока полный список грузится, берёт товар из уже загруженных подборок каталога', () => {
    stubApi({ 'GET /api/products': pending });

    const { result } = renderUseProduct(3, seedCatalog);

    expect(result.current.data?.name).toBe('Кола');
    expect(result.current.isPlaceholderData).toBe(true);
  });

  it('загружает полный список, если товара нет в кэше', async () => {
    const fetchMock = stubApi({ 'GET /api/products': json([...burgers, ...drinks]) });

    const { result } = renderUseProduct(2);

    await waitFor(() => expect(result.current.data?.name).toBe('Гамбургер'));
    const url = new URL(fetchMock.mock.calls[0]?.[0] as string, 'http://localhost');
    expect(Object.fromEntries(url.searchParams)).toEqual(ALL_PRODUCTS_PARAMS.sorting);
  });

  it('возвращает undefined для неизвестного товара', async () => {
    stubApi({ 'GET /api/products': json(burgers) });

    const { result } = renderUseProduct(99);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
