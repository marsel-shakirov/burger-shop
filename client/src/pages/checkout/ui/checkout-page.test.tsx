import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { cartQueryOptions, mergeGuestCart, useCartActions } from '@/entities/cart';
import { setSessionUser } from '@/entities/session';
import { createTestQueryClient, createWrapper, json, stubApi } from '@/shared/testing';

import { CheckoutPage } from './checkout-page';

const user = { id: 'user-1', email: 'user@example.com' };
const items = [{ productId: 1, quantity: 2 }];

beforeEach(() => {
  vi.stubGlobal(
    'navigator',
    Object.assign(Object.create(navigator), {
      locks: { request: (_name: string, run: () => Promise<void>) => run() },
    }),
  );
  setSessionUser(null);
  const { result, unmount } = renderHook(useCartActions, { wrapper: createWrapper() });
  act(() => {
    result.current.clearCart();
    result.current.addItem(1);
  });
  unmount();
  setSessionUser(user);
});

afterEach(() => {
  setSessionUser(null);
  vi.unstubAllGlobals();
});

describe('CheckoutPage', () => {
  it('ждёт уже запущенный перенос корзины, даже если в кеше лежит пустая серверная корзина', async () => {
    let resolveMerge: (response: Response) => void = () => {};
    const sendMerge = vi.fn(() => new Promise<Response>((resolve) => (resolveMerge = resolve)));
    stubApi({ 'POST /api/cart/merge': sendMerge, 'GET /api/cart': json({ items: [] }) });
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(cartQueryOptions(user.id).queryKey, []);

    const merge = mergeGuestCart(queryClient, user.id);
    render(<CheckoutPage />, { wrapper: createWrapper({ queryClient }) });

    expect(screen.getByRole('status').textContent).toBe('Подготавливаем корзину…');
    expect(screen.queryByText('В корзине пока пусто')).toBeNull();

    await waitFor(() => expect(sendMerge).toHaveBeenCalledTimes(1));
    await act(async () => {
      resolveMerge(Response.json({ items }));
      await merge;
    });

    expect(await screen.findByText('В корзине 2 товара')).toBeDefined();
    expect(sendMerge).toHaveBeenCalledTimes(1);
  });

  it('показывает ошибку переноса и повторяет запрос по нажатию', async () => {
    const sendMerge = vi
      .fn()
      .mockImplementationOnce(json(null, 500))
      .mockImplementationOnce(json({ items }));
    stubApi({ 'POST /api/cart/merge': sendMerge, 'GET /api/cart': json({ items: [] }) });
    const queryClient = createTestQueryClient();
    await expect(mergeGuestCart(queryClient, user.id)).rejects.toThrow();

    render(<CheckoutPage />, { wrapper: createWrapper({ queryClient }) });

    expect(screen.getByRole('alert').textContent).toContain(
      'Не удалось перенести гостевую корзину',
    );
    expect(sendMerge).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('В корзине 2 товара')).toBeDefined();
    expect(sendMerge).toHaveBeenCalledTimes(2);
  });
});
