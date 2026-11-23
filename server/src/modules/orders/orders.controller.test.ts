import type { PoolClient } from 'pg';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSupabase } from '../../supabase.ts';
import { api } from '../../testing/http.ts';
import { claimsResult, createSupabaseMock, noClaimsResult } from '../../testing/supabase-mock.ts';
import {
  deleteOrderedCartItems,
  findOrderByKey,
  findOrderDetails,
  findOrders,
  insertOrder,
  insertOrderItems,
  lockOrderCart,
  withOrderTransaction,
} from './orders.repository.ts';

vi.mock('../../supabase.ts', () => ({ createSupabase: vi.fn(), createStatelessSupabase: vi.fn() }));
vi.mock('./orders.repository.ts');

const client = {} as PoolClient;
const userId = 'user-1';
const cartItem = { productId: 1, productName: 'Burger', quantity: 2, unitPrice: 300 };
const body = {
  idempotencyKey: '41ed2522-2f4e-4fd7-8671-45284a4e03aa',
  customerName: ' Анна ',
  customerPhone: '+7 (900) 123-45-67',
  items: [{ productId: 1, quantity: 2, unitPrice: 300 }],
};
const order = { id: 'order-1', orderNumber: '42', status: 'new', totalPrice: 600 };

beforeEach(() => {
  const supabase = createSupabaseMock();
  supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: userId }));
  vi.mocked(createSupabase).mockReturnValue(supabase.client);
  vi.mocked(withOrderTransaction).mockImplementation((_userId, run) => run(client));
  vi.mocked(lockOrderCart).mockResolvedValue([cartItem]);
  vi.mocked(insertOrder).mockResolvedValue(order);
});

const orderSummary = {
  ...order,
  id: '12340f03-6b80-45db-98ca-6797fbd7d424',
  createdAt: '2026-11-22T12:00:00.123456Z',
};

describe('GET /api/orders', () => {
  it('возвращает пустую историю с лимитом по умолчанию', async () => {
    vi.mocked(findOrders).mockResolvedValue([]);

    const response = await api().get('/api/orders');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ items: [], nextCursor: null });
    expect(findOrders).toHaveBeenCalledWith(userId, 21, undefined);
  });

  it('передаёт в курсоре ID и дату последнего выданного заказа с микросекундами', async () => {
    const nextOrder = {
      ...orderSummary,
      id: '12340f03-6b80-45db-98ca-6797fbd7d423',
      createdAt: '2026-11-22T12:00:00.123455Z',
    };
    vi.mocked(findOrders).mockResolvedValueOnce([orderSummary, nextOrder]);
    vi.mocked(findOrders).mockResolvedValueOnce([nextOrder]);

    const first = await api().get('/api/orders').query({ limit: 1 });
    expect(first.status).toBe(200);
    expect(first.body.items).toEqual([orderSummary]);
    expect(first.body.nextCursor).toEqual(expect.any(String));

    const second = await api()
      .get('/api/orders')
      .query({ limit: 1, cursor: first.body.nextCursor });

    expect(second.status).toBe(200);
    expect(second.body).toEqual({ items: [nextOrder], nextCursor: null });
    expect(findOrders).toHaveBeenNthCalledWith(1, userId, 2, undefined);
    expect(findOrders).toHaveBeenNthCalledWith(2, userId, 2, {
      createdAt: orderSummary.createdAt,
      id: orderSummary.id,
    });
  });

  it.each([
    '?limit=0',
    '?limit=51',
    '?limit=1.5',
    '?limit=1&limit=2',
    '?cursor=***',
    '?cursor=b2hp',
    '?cursor=e30',
    '?cursor=' +
      Buffer.from(
        JSON.stringify({ id: orderSummary.id, createdAt: '0000-01-01T00:00:00.000000Z' }),
      ).toString('base64url'),
    '?userId=someone-else',
  ])('отклоняет некорректный запрос %s', async (query) => {
    const response = await api().get(`/api/orders${query}`);

    expect(response.status).toBe(400);
    expect(findOrders).not.toHaveBeenCalled();
  });
});

describe('GET /api/orders/:id', () => {
  it('возвращает детали заказа текущего пользователя', async () => {
    const details = {
      ...orderSummary,
      items: [{ lineNumber: 1, productName: 'Burger', unitPrice: 300, quantity: 2 }],
    };
    vi.mocked(findOrderDetails).mockResolvedValue(details);

    const response = await api().get(`/api/orders/${orderSummary.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(details);
    expect(findOrderDetails).toHaveBeenCalledWith(userId, orderSummary.id);
  });

  it('возвращает 404, если среди заказов пользователя нет указанного заказа', async () => {
    const response = await api().get(`/api/orders/${orderSummary.id}`);

    expect(response.status).toBe(404);
    expect(response.body.code).toBe('order_not_found');
  });

  it('отклоняет некорректный UUID', async () => {
    const response = await api().get('/api/orders/invalid');

    expect(response.status).toBe(400);
    expect(findOrderDetails).not.toHaveBeenCalled();
  });
});

it.each(['/api/orders', `/api/orders/${orderSummary.id}`])(
  'отклоняет GET %s без сессии',
  async (path) => {
    const supabase = createSupabaseMock();
    supabase.auth.getClaims.mockResolvedValue(noClaimsResult());
    vi.mocked(createSupabase).mockReturnValue(supabase.client);

    const response = await api().get(path);

    expect(response.status).toBe(401);
    expect(findOrders).not.toHaveBeenCalled();
    expect(findOrderDetails).not.toHaveBeenCalled();
  },
);

describe('POST /api/orders', () => {
  it('сохраняет заказ и его позиции перед удалением оформленных позиций из корзины', async () => {
    const response = await api()
      .post('/api/orders')
      .send({ ...body, customerPhone: '8 (900) 123-45-67' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(order);
    expect(withOrderTransaction).toHaveBeenCalledWith(userId, expect.any(Function));
    expect(insertOrder).toHaveBeenCalledWith(
      client,
      userId,
      { ...body, customerName: 'Анна', customerPhone: '+79001234567' },
      600,
    );
    expect(insertOrderItems).toHaveBeenCalledWith(client, order.id, [cartItem]);
    expect(deleteOrderedCartItems).toHaveBeenCalledWith(client, userId, [cartItem]);
    expect(vi.mocked(insertOrderItems).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(deleteOrderedCartItems).mock.invocationCallOrder[0],
    );
  });

  it('возвращает предыдущий заказ при повторной отправке, даже если корзина уже пуста', async () => {
    vi.mocked(findOrderByKey).mockResolvedValue(order);

    const response = await api().post('/api/orders').send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(order);
    expect(findOrderByKey).toHaveBeenCalledWith(client, userId, body.idempotencyKey);
    expect(lockOrderCart).not.toHaveBeenCalled();
    expect(insertOrder).not.toHaveBeenCalled();
  });

  it('отклоняет запрос без сессии', async () => {
    const supabase = createSupabaseMock();
    supabase.auth.getClaims.mockResolvedValue(noClaimsResult());
    vi.mocked(createSupabase).mockReturnValue(supabase.client);

    const response = await api().post('/api/orders').send(body);

    expect(response.status).toBe(401);
    expect(withOrderTransaction).not.toHaveBeenCalled();
  });

  it.each([
    { ...body, idempotencyKey: 'bad-key' },
    { ...body, customerName: ' ' },
    { ...body, customerPhone: '123' },
    { ...body, customerPhone: '+447911123456' },
    { ...body, customerPhone: null },
    { ...body, items: [] },
    { ...body, items: [body.items[0], body.items[0]] },
    { ...body, userId: 'someone-else' },
  ])('не создаёт заказ при некорректном запросе %#', async (invalidBody) => {
    const response = await api().post('/api/orders').send(invalidBody);

    expect(response.status).toBe(400);
    expect(withOrderTransaction).not.toHaveBeenCalled();
  });

  it.each([
    { items: [], code: 'cart_empty' },
    { items: [cartItem, { ...cartItem, productId: 2 }], code: 'cart_changed' },
    { items: [{ ...cartItem, productId: 2 }], code: 'cart_changed' },
    { items: [{ ...cartItem, unitPrice: 350 }], code: 'cart_changed' },
    { items: [{ ...cartItem, quantity: 3 }], code: 'cart_changed' },
  ])('сохраняет корзину при несовпадении с подтверждённым составом %#', async ({ items, code }) => {
    vi.mocked(lockOrderCart).mockResolvedValue(items);

    const response = await api().post('/api/orders').send(body);

    expect(response.status).toBe(409);
    expect(response.body.code).toBe(code);
    expect(insertOrder).not.toHaveBeenCalled();
    expect(deleteOrderedCartItems).not.toHaveBeenCalled();
  });

  it('сообщает, если итог не помещается в поле суммы заказа', async () => {
    const unitPrice = 2_147_483_647;
    vi.mocked(lockOrderCart).mockResolvedValue([{ ...cartItem, unitPrice }]);

    const response = await api()
      .post('/api/orders')
      .send({ ...body, items: [{ ...body.items[0], unitPrice }] });

    expect(response.status).toBe(409);
    expect(response.body.code).toBe('order_total_too_large');
    expect(insertOrder).not.toHaveBeenCalled();
  });
});
