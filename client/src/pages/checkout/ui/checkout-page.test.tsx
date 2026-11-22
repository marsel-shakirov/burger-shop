import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, assert, beforeEach, describe, expect, it, vi } from 'vitest';

import { CartNavBadge, cartQueryOptions, mergeGuestCart, useCartActions } from '@/entities/cart';
import { setSessionUser } from '@/entities/session';
import {
  type ApiHandlers,
  createTestQueryClient,
  createWrapper,
  json,
  pending,
  stubApi,
} from '@/shared/testing';

import type { CreateOrderRequest } from '../api/create-order';
import { CheckoutPage } from './checkout-page';

const user = { id: 'user-1', email: 'user@example.com' };
const items = [{ productId: 1, quantity: 2 }];
const products = [
  { id: 1, name: 'Бургер', price: 300 },
  { id: 2, name: 'Кола', price: 120 },
];

const setGuestCart = (...productIds: number[]) => {
  setSessionUser(null);
  const { result, unmount } = renderHook(useCartActions, { wrapper: createWrapper() });
  act(() => {
    result.current.clearCart();
    productIds.forEach((id) => result.current.addItem(id));
  });
  unmount();
  setSessionUser(user);
};

beforeEach(() => {
  vi.stubGlobal(
    'navigator',
    Object.assign(Object.create(navigator), {
      locks: { request: (_name: string, run: () => Promise<void>) => run() },
    }),
  );
  setGuestCart(1);
});

afterEach(() => {
  setSessionUser(null);
  vi.unstubAllGlobals();
});

describe('CheckoutPage', () => {
  it('ждёт уже запущенный перенос корзины, даже если в кеше лежит пустая серверная корзина', async () => {
    let resolveMerge: (response: Response) => void = () => {};
    const sendMerge = vi.fn(() => new Promise<Response>((resolve) => (resolveMerge = resolve)));
    stubApi({
      'POST /api/cart/merge': sendMerge,
      'GET /api/cart': json({ items: [] }),
      'GET /api/products': json(products),
    });
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

    expect(await screen.findByText('Бургер')).toBeDefined();
    expect(sendMerge).toHaveBeenCalledTimes(1);
  });

  it('показывает ошибку переноса и повторяет запрос по нажатию', async () => {
    const sendMerge = vi
      .fn()
      .mockImplementationOnce(json(null, 500))
      .mockImplementationOnce(json({ items }));
    stubApi({
      'POST /api/cart/merge': sendMerge,
      'GET /api/cart': json({ items: [] }),
      'GET /api/products': json(products),
    });
    const queryClient = createTestQueryClient();
    await expect(mergeGuestCart(queryClient, user.id)).rejects.toThrow();

    render(<CheckoutPage />, { wrapper: createWrapper({ queryClient }) });

    expect(screen.getByRole('alert').textContent).toContain(
      'Не удалось перенести гостевую корзину',
    );
    expect(sendMerge).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('Бургер')).toBeDefined();
    expect(sendMerge).toHaveBeenCalledTimes(2);
  });

  it('показывает цену и количество по каждой позиции и общий итог', async () => {
    stubApi({
      'POST /api/cart/merge': json({ items: [...items, { productId: 2, quantity: 3 }] }),
      'GET /api/products': json(products),
    });

    render(<CheckoutPage />, { wrapper: createWrapper() });

    const summary = await screen.findByRole('region', { name: 'Состав заказа' });
    const [burger, cola] = within(summary).getAllByRole('listitem');

    expect(burger?.textContent).toContain('Бургер');
    expect(burger?.textContent).toMatch(/2 × 300\s*₽/);
    expect(burger?.querySelector('data')?.value).toBe('600');
    expect(cola?.textContent).toContain('Кола');
    expect(cola?.textContent).toMatch(/3 × 120\s*₽/);
    expect(cola?.querySelector('data')?.value).toBe('360');
    expect(within(summary).getByText('Итого').nextElementSibling?.getAttribute('value')).toBe(
      '960',
    );
    expect(screen.getByRole('link', { name: 'Вернуться в корзину' }).getAttribute('href')).toBe(
      '/cart',
    );
  });
});

describe('CheckoutPage: загрузка состава заказа', () => {
  it('показывает загрузку каталога без преждевременного итога', async () => {
    stubApi({
      'POST /api/cart/merge': json({ items }),
      'GET /api/products': pending,
    });

    render(<CheckoutPage />, { wrapper: createWrapper() });

    expect(await screen.findByText('Загружаем состав заказа…')).toBeDefined();
    expect(screen.queryByText('Итого')).toBeNull();
  });

  it('позволяет повторить загрузку корзины после ошибки', async () => {
    setGuestCart();
    const fetchCart = vi
      .fn()
      .mockImplementationOnce(json(null, 500))
      .mockImplementationOnce(json({ items }));
    const fetchProducts = vi.fn(json(products));
    stubApi({ 'GET /api/cart': fetchCart, 'GET /api/products': fetchProducts });

    render(<CheckoutPage />, { wrapper: createWrapper() });

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Не удалось загрузить корзину',
    );
    expect(fetchProducts).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('region', { name: 'Состав заказа' })).toBeDefined();
    expect(fetchCart).toHaveBeenCalledTimes(2);
  });

  it('повторяет загрузку товаров после ошибки каталога', async () => {
    const fetchProducts = vi
      .fn()
      .mockImplementationOnce(json(null, 500))
      .mockImplementationOnce(json(products));
    const fetchCart = vi.fn(json({ items }));
    stubApi({
      'POST /api/cart/merge': json({ items }),
      'GET /api/cart': fetchCart,
      'GET /api/products': fetchProducts,
    });

    render(<CheckoutPage />, { wrapper: createWrapper() });

    expect((await screen.findByRole('alert')).textContent).toContain('Не удалось загрузить товары');
    expect(screen.queryByText('Итого')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('region', { name: 'Состав заказа' })).toBeDefined();
    expect(fetchProducts).toHaveBeenCalledTimes(2);
    expect(fetchCart).not.toHaveBeenCalled();
  });

  it('при отсутствующем товаре скрывает итог и даёт обновить корзину и каталог', async () => {
    const fetchCart = vi.fn(json({ items }));
    const fetchProducts = vi.fn(json(products));
    stubApi({
      'POST /api/cart/merge': json({ items: [...items, { productId: 99, quantity: 1 }] }),
      'GET /api/cart': fetchCart,
      'GET /api/products': fetchProducts,
    });

    render(<CheckoutPage />, { wrapper: createWrapper() });

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Некоторые товары не найдены в меню',
    );
    expect(screen.queryByText('Итого')).toBeNull();
    expect(screen.getByRole('link', { name: 'Вернуться в корзину' }).getAttribute('href')).toBe(
      '/cart',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByRole('region', { name: 'Состав заказа' })).toBeDefined();
    expect(fetchCart).toHaveBeenCalledTimes(1);
    expect(fetchProducts).toHaveBeenCalledTimes(2);
  });
});

describe('CheckoutPage: контакты и получение', () => {
  const profile = {
    name: 'Анна',
    phone: '+79001234567',
    birthDate: null,
    gender: null,
  };

  const getName = () => screen.getByRole<HTMLInputElement>('textbox', { name: 'Имя' });
  const getPhone = () => screen.getByRole<HTMLInputElement>('textbox', { name: 'Телефон' });

  it('подставляет контакты из профиля и показывает условия получения', async () => {
    stubApi({
      'POST /api/cart/merge': json({ items }),
      'GET /api/products': json(products),
      'GET /api/profile': json(profile),
    });

    render(<CheckoutPage />, { wrapper: createWrapper() });

    const form = await screen.findByRole('form', { name: 'Контакты для заказа' });
    await waitFor(() => expect(getName().value).toBe(profile.name));
    expect(getPhone().value).toBe(profile.phone);
    expect(getName().required).toBe(true);
    expect(getPhone().required).toBe(true);
    expect(
      within(form).getByRole<HTMLTextAreaElement>('textbox', { name: /Комментарий/ }).required,
    ).toBe(false);
    expect(within(form).getByText('Самовывоз')).toBeDefined();
    expect(within(form).getByText('При получении')).toBeDefined();
  });

  it('сохраняет ручной ввод, если профиль загружается позже', async () => {
    let resolveProfile: (response: Response) => void = () => {};
    stubApi({
      'POST /api/cart/merge': json({ items }),
      'GET /api/products': json(products),
      'GET /api/profile': () =>
        new Promise<Response>((resolve) => {
          resolveProfile = resolve;
        }),
    });

    render(<CheckoutPage />, { wrapper: createWrapper() });

    await screen.findByRole('form', { name: 'Контакты для заказа' });
    fireEvent.change(getName(), { target: { value: 'Мария' } });
    fireEvent.change(getName(), { target: { value: '' } });

    act(() => resolveProfile(Response.json(profile)));

    await waitFor(() => expect(getPhone().value).toBe(profile.phone));
    expect(getName().value).toBe('');
  });

  it('оставляет форму доступной при ошибке профиля и скрывает её при пустой корзине', async () => {
    const fetchProfile = vi.fn(json(null, 500));
    stubApi({
      'POST /api/cart/merge': json({ items }),
      'GET /api/products': json(products),
      'GET /api/profile': fetchProfile,
    });
    const queryClient = createTestQueryClient();

    render(<CheckoutPage />, { wrapper: createWrapper({ queryClient }) });

    await screen.findByRole('form', { name: 'Контакты для заказа' });
    await waitFor(() => expect(fetchProfile).toHaveBeenCalledTimes(1));
    fireEvent.change(getName(), { target: { value: 'Мария' } });
    fireEvent.change(getPhone(), { target: { value: '+79005551234' } });
    expect(getName().value).toBe('Мария');
    expect(getPhone().value).toBe('+79005551234');

    act(() => {
      queryClient.setQueryData(cartQueryOptions(user.id).queryKey, []);
    });

    expect(await screen.findByText('В корзине пока пусто')).toBeDefined();
    expect(screen.queryByRole('form', { name: 'Контакты для заказа' })).toBeNull();
  });
});

describe('CheckoutPage: проверка контактов', () => {
  const renderContacts = async () => {
    stubApi({
      'POST /api/cart/merge': json({ items }),
      'GET /api/products': json(products),
      'GET /api/profile': json({ name: null, phone: null, birthDate: null, gender: null }),
    });

    render(<CheckoutPage />, { wrapper: createWrapper() });

    const form = await screen.findByRole('form', { name: 'Контакты для заказа' });
    return {
      form,
      name: within(form).getByRole('textbox', { name: 'Имя' }),
      phone: within(form).getByRole('textbox', { name: 'Телефон' }),
      comment: within(form).getByRole('textbox', { name: /Комментарий/ }),
    };
  };

  const expectFieldError = (field: HTMLElement, message: string) => {
    const alert = screen.getByText(message);
    expect(field.getAttribute('aria-invalid')).toBe('true');
    expect(field.getAttribute('aria-describedby')).toBe(alert.id);
    expect(alert.getAttribute('role')).toBe('alert');
  };

  it('показывает ошибки обязательных полей после проверки формы', async () => {
    const { form, name, phone, comment } = await renderContacts();
    const fetch = vi.mocked(globalThis.fetch);
    fireEvent.change(name, { target: { value: '   ' } });
    fireEvent.change(phone, { target: { value: ' ( ) - ' } });
    expect(screen.queryByRole('alert')).toBeNull();

    fireEvent.submit(form);

    expectFieldError(name, 'Введите имя');
    expectFieldError(phone, 'Введите телефон');
    expect(comment.getAttribute('aria-invalid')).toBeNull();
    expect(fetch).not.toHaveBeenCalledWith('/api/orders', expect.anything());
  });

  it('проверяет длину и телефон после ухода с поля и убирает ошибки при исправлении', async () => {
    const { name, phone, comment } = await renderContacts();
    fireEvent.change(name, { target: { value: 'А'.repeat(101) } });
    fireEvent.change(phone, { target: { value: '+123456789' } });
    fireEvent.change(comment, { target: { value: 'А'.repeat(501) } });
    fireEvent.blur(name);
    fireEvent.blur(phone);
    fireEvent.blur(comment);

    expectFieldError(name, 'Имя должно быть не длиннее 100 символов');
    expectFieldError(phone, 'Введите телефон из 10–15 цифр. В начале можно указать «+».');
    expectFieldError(comment, 'Комментарий должен быть не длиннее 500 символов');

    fireEvent.change(name, { target: { value: ` ${'А'.repeat(100)} ` } });
    fireEvent.change(comment, { target: { value: ` ${'А'.repeat(500)} ` } });
    fireEvent.change(phone, { target: { value: '1234567890123456' } });
    expect(phone.getAttribute('aria-invalid')).toBe('true');
    fireEvent.change(phone, { target: { value: '+7 (900) 123-45-67' } });

    expect(screen.queryByRole('alert')).toBeNull();
    expect(phone.getAttribute('aria-describedby')).toBeNull();
  });
});

const order = { id: 'order-1', orderNumber: '42', status: 'new', totalPrice: 600 };

const renderOrder = async (
  sendOrder: ApiHandlers[string],
  handlers: ApiHandlers = {},
  queryClient = createTestQueryClient(),
) => {
  stubApi({
    'POST /api/cart/merge': json({ items }),
    'GET /api/cart': json({ items: [] }),
    'GET /api/products': json(products),
    'GET /api/profile': json({ name: null, phone: null, birthDate: null, gender: null }),
    'POST /api/orders': sendOrder,
    ...handlers,
  });

  render(<CheckoutPage />, { wrapper: createWrapper({ queryClient }) });
  const form = await screen.findByRole('form', { name: 'Контакты для заказа' });
  fireEvent.change(within(form).getByRole('textbox', { name: 'Имя' }), {
    target: { value: ' Анна ' },
  });
  fireEvent.change(within(form).getByRole('textbox', { name: 'Телефон' }), {
    target: { value: '+7 (900) 123-45-67' },
  });

  return form;
};

const readOrderBody = (init?: RequestInit) => {
  assert(typeof init?.body === 'string');
  return JSON.parse(init.body) as CreateOrderRequest;
};

describe('CheckoutPage: отправка заказа', () => {
  it('отправляет заказ из браузера без crypto.randomUUID', async () => {
    vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) });
    const sendOrder = vi
      .fn<(_url: URL, init?: RequestInit) => Promise<Response>>()
      .mockResolvedValueOnce(Response.json(order, { status: 201 }));
    const form = await renderOrder(sendOrder);

    fireEvent.submit(form);

    expect(await screen.findByText('Заказ №42 оформлен')).toBeDefined();
    expect(readOrderBody(sendOrder.mock.calls[0]?.[1]).idempotencyKey).toMatch(
      /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i,
    );
  });

  it('отправляет показанные позиции и нормализованные контакты один раз', async () => {
    let resolveOrder: (response: Response) => void = () => {};
    const sendOrder = vi.fn(
      (_url: URL, _init?: RequestInit) =>
        new Promise<Response>((resolve) => {
          resolveOrder = resolve;
        }),
    );
    const form = await renderOrder(sendOrder);
    fireEvent.change(within(form).getByRole('textbox', { name: /Комментарий/ }), {
      target: { value: ' Позвонить по готовности ' },
    });

    act(() => {
      fireEvent.click(within(form).getByRole('button', { name: 'Подтвердить заказ' }));
      fireEvent.submit(form);
    });

    const pendingButton = await screen.findByRole<HTMLButtonElement>('button', {
      name: 'Оформляем…',
    });
    expect(pendingButton.disabled).toBe(true);
    await waitFor(() => expect(sendOrder).toHaveBeenCalledTimes(1));
    const { idempotencyKey, ...details } = readOrderBody(sendOrder.mock.calls[0]?.[1]);
    expect(idempotencyKey).toMatch(
      /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i,
    );
    expect(details).toEqual({
      customerName: 'Анна',
      customerPhone: '+79001234567',
      customerComment: 'Позвонить по готовности',
      items: [{ productId: 1, quantity: 2, unitPrice: 300 }],
    });

    act(() => resolveOrder(Response.json({ ...order, totalPrice: 610 }, { status: 201 })));

    expect(await screen.findByText('Заказ №42 оформлен')).toBeDefined();
    expect(screen.getByText('Итого').nextElementSibling?.getAttribute('value')).toBe('610');
    expect(screen.getByText('Самовывоз')).toBeDefined();
    expect(screen.getByText('При получении')).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Подтвердить заказ' })).toBeNull();
  });

  it.each([
    ['при потере ответа', () => Promise.reject(new TypeError('Network error'))],
    ['при ошибке сервера', () => Promise.resolve(Response.json({}, { status: 500 }))],
  ])('%s повторяет отправку с тем же телом и ключом', async (_scenario, fail) => {
    const sendOrder = vi
      .fn<(_url: URL, init?: RequestInit) => Promise<Response>>()
      .mockImplementationOnce(fail)
      .mockResolvedValueOnce(Response.json(order));
    const form = await renderOrder(sendOrder);

    fireEvent.submit(form);
    fireEvent.click(await screen.findByRole('button', { name: 'Повторить отправку' }));

    expect(await screen.findByText('Заказ №42 оформлен')).toBeDefined();
    expect(sendOrder).toHaveBeenCalledTimes(2);
    expect(sendOrder.mock.calls[1]?.[1]?.body).toBe(sendOrder.mock.calls[0]?.[1]?.body);
  });
});

describe('CheckoutPage: сервер отклонил заказ', () => {
  const changedProducts = [{ id: 1, name: 'Бургер', price: 350 }];

  it('обновляет корзину и цены, сохраняет контакты и ждёт нового подтверждения', async () => {
    const sendOrder = vi
      .fn<ApiHandlers[string]>()
      .mockImplementationOnce(json({ code: 'cart_changed' }, 409))
      .mockImplementationOnce(json(order, 201));
    const fetchCart = vi.fn(json({ items: [{ productId: 1, quantity: 3 }] }));
    const fetchProducts = vi
      .fn()
      .mockImplementationOnce(json(products))
      .mockImplementationOnce(json(changedProducts));
    const form = await renderOrder(sendOrder, {
      'GET /api/cart': fetchCart,
      'GET /api/products': fetchProducts,
    });
    fireEvent.change(within(form).getByRole('textbox', { name: /Комментарий/ }), {
      target: { value: 'Позвонить' },
    });
    fireEvent.submit(form);

    expect((await screen.findByRole('alert')).textContent).toContain('Состав или цены изменились');
    expect(screen.getByText('Итого').nextElementSibling?.getAttribute('value')).toBe('1050');
    expect(fetchCart).toHaveBeenCalledTimes(1);
    expect(fetchProducts).toHaveBeenCalledTimes(2);
    expect(sendOrder).toHaveBeenCalledTimes(1);
    expect(screen.getByRole<HTMLInputElement>('textbox', { name: 'Имя' }).value).toBe(' Анна ');
    expect(screen.getByRole<HTMLInputElement>('textbox', { name: 'Телефон' }).value).toBe(
      '+7 (900) 123-45-67',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Подтвердить заказ' }));

    expect(await screen.findByText('Заказ №42 оформлен')).toBeDefined();
    const first = readOrderBody(sendOrder.mock.calls[0]?.[1]);
    const second = readOrderBody(sendOrder.mock.calls[1]?.[1]);
    expect(second.idempotencyKey).not.toBe(first.idempotencyKey);
    expect(second.items).toEqual([{ productId: 1, quantity: 3, unitPrice: 350 }]);
    expect(second.customerComment).toBe('Позвонить');
  });

  it('предлагает повторить обновление, если оно не удалось, и не отправляет заказ', async () => {
    const sendOrder = vi.fn(json({ code: 'cart_changed' }, 409));
    const fetchProducts = vi
      .fn()
      .mockImplementationOnce(json(products))
      .mockImplementationOnce(json(null, 500))
      .mockImplementationOnce(json(changedProducts));
    const form = await renderOrder(sendOrder, {
      'GET /api/cart': json({ items }),
      'GET /api/products': fetchProducts,
    });
    fireEvent.submit(form);

    expect((await screen.findByRole('alert')).textContent).toContain('Не удалось обновить');
    expect(screen.queryByRole('button', { name: 'Подтвердить заказ' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Обновить корзину и цены' }));

    expect(await screen.findByRole('button', { name: 'Подтвердить заказ' })).toBeDefined();
    expect(fetchProducts).toHaveBeenCalledTimes(3);
    expect(sendOrder).toHaveBeenCalledTimes(1);
  });

  it('при пустой корзине убирает форму и даёт перейти в меню', async () => {
    const form = await renderOrder(json({ code: 'cart_empty' }, 409));

    fireEvent.submit(form);

    expect(await screen.findByText('В корзине пока пусто')).toBeDefined();
    expect(screen.queryByRole('form', { name: 'Контакты для заказа' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Открыть меню' }).getAttribute('href')).toBe('/');
  });

  it('предлагает уменьшить заказ, если итог превышает предел', async () => {
    const form = await renderOrder(json({ code: 'order_total_too_large' }, 409));

    fireEvent.submit(form);

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Сумма заказа слишком большая',
    );
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Подтвердить заказ' }).disabled,
    ).toBe(true);
    expect(screen.getByRole('link', { name: 'Вернуться в корзину' }).getAttribute('href')).toBe(
      '/cart',
    );
  });
});

describe('CheckoutPage: корзина после успешного заказа', () => {
  it.each([
    { remainingItems: [], quantity: null },
    { remainingItems: [{ productId: 2, quantity: 3 }], quantity: '3' },
  ])('обновляет счётчик по ответу сервера, сохраняя подтверждение %#', async (scenario) => {
    let resolveCart: (response: Response) => void = () => {};
    const fetchCart = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveCart = resolve;
        }),
    );
    const queryClient = createTestQueryClient();
    const form = await renderOrder(json(order, 201), { 'GET /api/cart': fetchCart }, queryClient);
    const badge = render(<CartNavBadge />, { wrapper: createWrapper({ queryClient }) });
    expect(within(badge.container).getByText('2')).toBeDefined();

    fireEvent.submit(form);

    const confirmation = await screen.findByText('Заказ №42 оформлен');
    expect(screen.getByText('Обновляем корзину…')).toBeDefined();
    expect(within(badge.container).getByText('2')).toBeDefined();
    await waitFor(() => expect(fetchCart).toHaveBeenCalledTimes(1));
    act(() => resolveCart(Response.json({ items: scenario.remainingItems })));

    await waitFor(() => expect(screen.queryByText('Обновляем корзину…')).toBeNull());
    expect(within(badge.container).queryByText('2')).toBeNull();
    if (scenario.quantity)
      expect(within(badge.container).getByText(scenario.quantity)).toBeDefined();
    expect(queryClient.getQueryData(cartQueryOptions(user.id).queryKey)).toEqual(
      scenario.remainingItems,
    );
    expect(screen.getByText('Заказ №42 оформлен')).toBe(confirmation);
    expect(screen.queryByText('В корзине пока пусто')).toBeNull();
  });

  it('после ошибки обновляет только корзину и оставляет номер заказа на экране', async () => {
    const sendOrder = vi.fn(json(order, 201));
    const fetchCart = vi
      .fn()
      .mockImplementationOnce(json(null, 500))
      .mockImplementationOnce(json({ items: [] }));
    const form = await renderOrder(sendOrder, { 'GET /api/cart': fetchCart });

    fireEvent.submit(form);

    const refreshButton = await screen.findByRole('button', { name: 'Обновить корзину' });
    expect(screen.getByText('Заказ №42 оформлен')).toBeDefined();
    expect(screen.getByRole('alert').textContent).toContain('Не удалось обновить корзину');
    fireEvent.click(refreshButton);

    await waitFor(() => expect(fetchCart).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByText('Обновляем корзину…')).toBeNull());
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('Заказ №42 оформлен')).toBeDefined();
    expect(sendOrder).toHaveBeenCalledTimes(1);
  });
});
