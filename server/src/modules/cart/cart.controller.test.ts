import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { createSupabase } from '../../supabase.ts';
import { api } from '../../testing/http.ts';
import { claimsResult, createSupabaseMock } from '../../testing/supabase-mock.ts';
import { CART_MAX_QUANTITY } from './cart.constants.ts';
import { clearCartUseCase } from './clear-cart.use-case.ts';
import { getCartUseCase } from './get-cart.use-case.ts';
import { mergeCartUseCase } from './merge-cart.use-case.ts';
import { removeCartItemUseCase } from './remove-cart-item.use-case.ts';
import { updateCartItemUseCase } from './update-cart-item.use-case.ts';

vi.mock('../../supabase.ts', () => ({ createSupabase: vi.fn(), createStatelessSupabase: vi.fn() }));

vi.mock('./clear-cart.use-case.ts', () => ({ clearCartUseCase: vi.fn() }));
vi.mock('./get-cart.use-case.ts', () => ({ getCartUseCase: vi.fn() }));
vi.mock('./merge-cart.use-case.ts', () => ({ mergeCartUseCase: vi.fn() }));
vi.mock('./remove-cart-item.use-case.ts', () => ({ removeCartItemUseCase: vi.fn() }));
vi.mock('./update-cart-item.use-case.ts', () => ({ updateCartItemUseCase: vi.fn() }));

const cart = { items: [{ productId: 5, quantity: 2 }] };

beforeEach(() => {
  const supabase = createSupabaseMock();
  supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1' }));
  vi.mocked(createSupabase).mockReturnValue(supabase.client);
});

describe('GET /api/cart', () => {
  it('отдаёт корзину пользователя', async () => {
    vi.mocked(getCartUseCase).mockResolvedValue(cart);

    const response = await api().get('/api/cart');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(cart);
    expect(getCartUseCase).toHaveBeenCalledWith('user-1');
  });
});

describe('PUT /api/cart/:productId', () => {
  it('сохраняет количество и отвечает 204', async () => {
    const response = await api().put('/api/cart/5').send({ quantity: 3 });

    expect(response.status).toBe(204);
    expect(updateCartItemUseCase).toHaveBeenCalledWith('user-1', 5, 3);
  });

  it.each([
    ['некорректный id', '/api/cart/abc', { quantity: 1 }],
    ['нулевой id', '/api/cart/0', { quantity: 1 }],
    ['нулевое количество', '/api/cart/5', { quantity: 0 }],
    ['количество больше максимума', '/api/cart/5', { quantity: CART_MAX_QUANTITY + 1 }],
    ['нет количества', '/api/cart/5', {}],
  ])('отвечает 400: %s', async (_case, path, body) => {
    const response = await api().put(path).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bad request' });
    expect(updateCartItemUseCase).not.toHaveBeenCalled();
  });

  it('отдаёт product_not_found, если товара нет', async () => {
    vi.mocked(updateCartItemUseCase).mockRejectedValue(
      new BadRequest('Product not found', 'product_not_found'),
    );

    const response = await api().put('/api/cart/999').send({ quantity: 1 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Product not found', code: 'product_not_found' });
  });
});

describe('DELETE /api/cart/:productId', () => {
  it('удаляет товар и отвечает 204', async () => {
    const response = await api().delete('/api/cart/5');

    expect(response.status).toBe(204);
    expect(removeCartItemUseCase).toHaveBeenCalledWith('user-1', 5);
  });

  it('отвечает 400 на некорректный id', async () => {
    const response = await api().delete('/api/cart/abc');

    expect(response.status).toBe(400);
    expect(removeCartItemUseCase).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/cart', () => {
  it('очищает корзину и отвечает 204', async () => {
    const response = await api().delete('/api/cart');

    expect(response.status).toBe(204);
    expect(clearCartUseCase).toHaveBeenCalledWith('user-1');
  });
});

describe('POST /api/cart/merge', () => {
  it('объединяет корзины и отдаёт итоговую', async () => {
    vi.mocked(mergeCartUseCase).mockResolvedValue(cart);

    const response = await api()
      .post('/api/cart/merge')
      .send({ items: [{ productId: 5, quantity: 2 }] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(cart);
    expect(mergeCartUseCase).toHaveBeenCalledWith('user-1', [{ productId: 5, quantity: 2 }]);
  });

  it.each([
    ['нет items', {}],
    ['некорректная позиция', { items: [{ productId: 0, quantity: 1 }] }],
  ])('отвечает 400: %s', async (_case, body) => {
    const response = await api().post('/api/cart/merge').send(body);

    expect(response.status).toBe(400);
    expect(mergeCartUseCase).not.toHaveBeenCalled();
  });
});
