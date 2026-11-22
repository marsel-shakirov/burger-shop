import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { orderHistoryQueryKey } from '@/entities/order';
import { setSessionUser } from '@/entities/session';
import { routes } from '@/shared/config';
import { createTestQueryClient, createWrapper, json, pending, stubApi } from '@/shared/testing';

import { OrderHistoryPage } from './order-history-page';

const user = { id: 'user-1', email: 'user@example.com' };
const order = {
  id: 'order-1',
  orderNumber: '42',
  status: 'ready',
  totalPrice: 600,
  createdAt: '2026-11-22T12:00:00.123456Z',
};
const nextOrder = { ...order, id: 'order-2', orderNumber: '41', status: 'completed' };
const cursor = 'next-page';

const renderPage = (queryClient = createTestQueryClient()) =>
  render(<OrderHistoryPage />, { wrapper: createWrapper({ queryClient }) });

beforeEach(() => setSessionUser(user));

afterEach(() => {
  setSessionUser(null);
  vi.unstubAllGlobals();
});

describe('OrderHistoryPage', () => {
  it('показывает загрузку и ссылку в профиль', () => {
    stubApi({ 'GET /api/orders': pending });

    renderPage();

    expect(screen.getByRole('status').textContent).toBe('Загружаем заказы…');
    expect(screen.getByRole('link', { name: 'В профиль' }).getAttribute('href')).toBe(
      routes.profile,
    );
  });

  it('после ошибки повторяет первый запрос и показывает пустую историю', async () => {
    const getOrders = vi
      .fn()
      .mockImplementationOnce(json(null, 500))
      .mockImplementationOnce(json({ items: [], nextCursor: null }));
    stubApi({ 'GET /api/orders': getOrders });

    renderPage();

    expect((await screen.findByRole('alert')).textContent).toBe('Не удалось загрузить заказы.');
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('У вас пока нет заказов.')).toBeDefined();
    expect(getOrders).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('button', { name: 'Показать ещё' })).toBeNull();
  });

  it('сохраняет список при ошибке и повторяет подгрузку с тем же курсором', async () => {
    let resolveNext!: (response: Response) => void;
    const getOrders = vi
      .fn<(url: URL) => Response | Promise<Response>>()
      .mockImplementationOnce(json({ items: [order], nextCursor: cursor }))
      .mockImplementationOnce(() => new Promise<Response>((resolve) => (resolveNext = resolve)))
      .mockImplementationOnce(json({ items: [nextOrder], nextCursor: null }));
    stubApi({ 'GET /api/orders': getOrders });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Заказ №42' })).toBeDefined();
    expect(screen.getByText('Готов к выдаче')).toBeDefined();
    expect(screen.getByText(/^600\s₽$/)).toBeDefined();
    expect(screen.getByRole('listitem').querySelector('time')?.dateTime).toBe(order.createdAt);
    fireEvent.click(screen.getByRole('button', { name: 'Показать ещё' }));

    const loadingButton = await screen.findByRole('button', {
      name: 'Загружаем…',
    });
    expect(loadingButton.hasAttribute('disabled')).toBe(true);
    fireEvent.click(loadingButton);
    await waitFor(() => expect(getOrders).toHaveBeenCalledTimes(2));
    act(() => resolveNext(Response.json(null, { status: 500 })));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Не удалось загрузить следующие заказы.',
    );
    expect(screen.getByRole('heading', { name: 'Заказ №42' })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('heading', { name: 'Заказ №41' })).toBeDefined();
    expect(screen.getAllByRole('heading', { level: 2 }).map((item) => item.textContent)).toEqual([
      'Заказ №42',
      'Заказ №41',
    ]);
    expect(getOrders.mock.calls.map(([url]) => url.searchParams.get('cursor'))).toEqual([
      null,
      cursor,
      cursor,
    ]);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('оставляет записи из кэша при ошибке обновления и даёт повторить запрос', async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(orderHistoryQueryKey(user.id), {
      pages: [{ items: [nextOrder], nextCursor: null }],
      pageParams: [null],
    });
    const getOrders = vi
      .fn()
      .mockImplementationOnce(json(null, 500))
      .mockImplementationOnce(json({ items: [order, nextOrder], nextCursor: null }));
    stubApi({ 'GET /api/orders': getOrders });

    renderPage(queryClient);

    expect((await screen.findByRole('alert')).textContent).toBe('Не удалось обновить заказы.');
    expect(screen.getByRole('heading', { name: 'Заказ №41' })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('heading', { name: 'Заказ №42' })).toBeDefined();
    expect(screen.getAllByRole('heading', { level: 2 })[0]?.textContent).toBe('Заказ №42');
  });

  it('при смене аккаунта скрывает заказы предыдущего пользователя сразу', async () => {
    const getOrders = vi
      .fn()
      .mockImplementationOnce(json({ items: [order], nextCursor: null }))
      .mockImplementationOnce(pending);
    stubApi({ 'GET /api/orders': getOrders });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Заказ №42' })).toBeDefined();
    act(() => setSessionUser({ id: 'user-2', email: 'other@example.com' }));

    expect(screen.queryByRole('heading', { name: 'Заказ №42' })).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('Загружаем заказы…');
    expect(getOrders).toHaveBeenCalledTimes(2);
    act(() => setSessionUser(null));
    expect(screen.queryByRole('main')).toBeNull();
  });
});
