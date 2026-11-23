import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/shared/api';

import type { OrderDetails } from './order.types';
import { orderDetailsQueryOptions } from './order-details-query-options';

const order: OrderDetails = {
  id: '12340f03-6b80-45db-98ca-6797fbd7d424',
  orderNumber: '42',
  createdAt: '2026-11-22T12:00:00.123456Z',
  status: 'completed',
  totalPrice: 600,
  items: [{ lineNumber: 1, productName: 'Бургер', unitPrice: 300, quantity: 2 }],
};

const fetchMock = vi.fn<typeof fetch>();
const queryClient = new QueryClient();
const options = orderDetailsQueryOptions('user-1', order.id);

beforeEach(() => vi.stubGlobal('fetch', fetchMock));

afterEach(() => {
  queryClient.clear();
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('orderDetailsQueryOptions', () => {
  it('загружает детали заказа с сигналом отмены и сохраняет их для текущего пользователя и заказа', async () => {
    fetchMock.mockResolvedValueOnce(Response.json(order));

    await expect(queryClient.query(options)).resolves.toEqual(order);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [path, init] = fetchMock.mock.calls[0] ?? [];
    expect(path).toBe(`/api/orders/${order.id}`);
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(queryClient.getQueryData(options.queryKey)).toEqual(order);
    expect(
      queryClient.getQueryData(orderDetailsQueryOptions('user-2', order.id).queryKey),
    ).toBeUndefined();
    expect(
      queryClient.getQueryData(orderDetailsQueryOptions('user-1', 'order-2').queryKey),
    ).toBeUndefined();
  });

  it('передаёт статус и код ошибки отсутствующего заказа без автоматического повтора', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json({ message: 'Order not found', code: 'order_not_found' }, { status: 404 }),
    );

    await expect(queryClient.query(options)).rejects.toBeInstanceOf(ApiError);
    expect(queryClient.getQueryState(options.queryKey)?.error).toMatchObject({
      status: 404,
      code: 'order_not_found',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
