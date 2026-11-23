import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Link, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { OrderDetails } from '@/entities/order';
import { setSessionUser } from '@/entities/session';
import { getOrderPath, routes } from '@/shared/config';
import { createWrapper, json, pending, stubApi } from '@/shared/testing';

import { OrderDetailsPage } from './order-details-page';

const user = { id: 'user-1', email: 'user@example.com' };
const order: OrderDetails = {
  id: '12340f03-6b80-45db-98ca-6797fbd7d424',
  orderNumber: '42',
  status: 'ready',
  totalPrice: 770,
  createdAt: '2026-11-22T12:00:00.123456Z',
  items: [
    { lineNumber: 1, productName: 'Бургер из старого меню', quantity: 2, unitPrice: 300 },
    { lineNumber: 2, productName: 'Картофель', quantity: 1, unitPrice: 170 },
  ],
};
const nextOrder = { ...order, id: '12340f03-6b80-45db-98ca-6797fbd7d423', orderNumber: '41' };
const orderRequest = `GET /api/orders/${order.id}`;

const renderPage = (id = order.id) =>
  render(
    <>
      <Link to={getOrderPath(nextOrder.id)}>Открыть другой заказ</Link>
      <Routes>
        <Route path={routes.orderDetails} element={<OrderDetailsPage />} />
      </Routes>
    </>,
    { wrapper: createWrapper({ initialEntries: [getOrderPath(id)] }) },
  );

beforeEach(() => setSessionUser(user));

afterEach(() => {
  setSessionUser(null);
  vi.unstubAllGlobals();
});

describe('OrderDetailsPage', () => {
  it('загружает заказ и показывает сохранённые позиции, статус, дату и итог', async () => {
    const fetch = stubApi({ [orderRequest]: json(order) });

    renderPage();

    expect(screen.getByRole('status').textContent).toBe('Загружаем заказ…');
    expect(screen.getByRole('link', { name: 'К покупкам' }).getAttribute('href')).toBe(
      routes.orders,
    );
    expect(await screen.findByRole('heading', { name: 'Заказ №42' })).toBeDefined();
    expect(screen.getByText('Готов к выдаче')).toBeDefined();
    expect(screen.getByRole('main').querySelector('time')?.dateTime).toBe(order.createdAt);
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Бургер из старого меню2 × 300\u00a0₽',
      'Картофель1 × 170\u00a0₽',
    ]);
    expect(screen.getByText(/^770\s₽$/).getAttribute('value')).toBe('770');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('показывает «Заказ не найден» для некорректного UUID без обращения к API', () => {
    const fetch = stubApi({});

    renderPage('incorrect-id');

    expect(screen.getByRole('heading', { name: 'Заказ не найден' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'К покупкам' })).toBeDefined();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('показывает «Заказ не найден» при 404', async () => {
    stubApi({ [orderRequest]: json({ code: 'order_not_found' }, 404) });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Заказ не найден' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Повторить' })).toBeNull();
  });

  it('повторяет запрос того же заказа после ошибки сервера', async () => {
    let resolveOrder!: (response: Response) => void;
    const getOrder = vi
      .fn()
      .mockImplementationOnce(json(null, 500))
      .mockImplementationOnce(() => new Promise<Response>((resolve) => (resolveOrder = resolve)));
    stubApi({ [orderRequest]: getOrder });

    renderPage();

    expect((await screen.findByRole('alert')).textContent).toBe('Не удалось загрузить заказ.');
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));
    expect((await screen.findByRole('status')).textContent).toBe('Загружаем заказ…');
    expect(screen.queryByRole('button', { name: 'Повторить' })).toBeNull();
    await waitFor(() => expect(getOrder).toHaveBeenCalledTimes(2));
    act(() => resolveOrder(Response.json(order)));

    expect(await screen.findByRole('heading', { name: 'Заказ №42' })).toBeDefined();
  });

  it('при смене ID в маршруте загружает другой заказ', async () => {
    stubApi({ [orderRequest]: json(order), [`GET /api/orders/${nextOrder.id}`]: json(nextOrder) });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Заказ №42' })).toBeDefined();
    fireEvent.click(screen.getByRole('link', { name: 'Открыть другой заказ' }));

    expect(await screen.findByRole('heading', { name: 'Заказ №41' })).toBeDefined();
    expect(screen.queryByRole('heading', { name: 'Заказ №42' })).toBeNull();
  });

  it('при смене аккаунта сразу скрывает детали предыдущего пользователя', async () => {
    const getOrder = vi.fn().mockImplementationOnce(json(order)).mockImplementationOnce(pending);
    stubApi({ [orderRequest]: getOrder });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Заказ №42' })).toBeDefined();
    act(() => setSessionUser({ id: 'user-2', email: 'other@example.com' }));

    const main = within(screen.getByRole('main'));
    expect(main.queryByRole('heading', { name: 'Заказ №42' })).toBeNull();
    expect(main.getByRole('status').textContent).toBe('Загружаем заказ…');
    expect(getOrder).toHaveBeenCalledTimes(2);
    act(() => setSessionUser(null));
    expect(screen.queryByRole('main')).toBeNull();
  });
});
