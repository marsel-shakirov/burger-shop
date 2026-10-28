import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { foreignKeyError } from '../../testing/database-error.ts';
import { CART_PRODUCT_FK } from './cart.constants.ts';
import { findCartItems, insertCartItems } from './cart.repository.ts';
import { mergeCartUseCase } from './merge-cart.use-case.ts';

vi.mock('./cart.repository.ts', () => ({ findCartItems: vi.fn(), insertCartItems: vi.fn() }));

const guestItems = [
  { productId: 5, quantity: 2 },
  { productId: 7, quantity: 1 },
];

beforeEach(() => {
  vi.mocked(findCartItems).mockResolvedValue([
    { product_id: 5, quantity: 3 },
    { product_id: 7, quantity: 1 },
  ]);
});

describe('mergeCartUseCase', () => {
  it('добавляет гостевые позиции и возвращает итоговую корзину', async () => {
    await expect(mergeCartUseCase('user-1', guestItems)).resolves.toEqual({
      items: [
        { productId: 5, quantity: 3 },
        { productId: 7, quantity: 1 },
      ],
    });
    expect(insertCartItems).toHaveBeenCalledWith('user-1', guestItems);
    expect(findCartItems).toHaveBeenCalledWith('user-1');
  });

  it('читает корзину после вставки', async () => {
    await mergeCartUseCase('user-1', guestItems);

    expect(vi.mocked(insertCartItems).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(findCartItems).mock.invocationCallOrder[0],
    );
  });

  it('без гостевых позиций только возвращает корзину', async () => {
    await mergeCartUseCase('user-1', []);

    expect(insertCartItems).not.toHaveBeenCalled();
    expect(findCartItems).toHaveBeenCalledWith('user-1');
  });

  it('бросает BadRequest product_not_found и не читает корзину, если товара нет', async () => {
    vi.mocked(insertCartItems).mockRejectedValue(foreignKeyError(CART_PRODUCT_FK));

    const error = await mergeCartUseCase('user-1', guestItems).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequest);
    expect(error).toMatchObject({ code: 'product_not_found' });
    expect(findCartItems).not.toHaveBeenCalled();
  });

  it('бросает Unauthorized, если пользователя нет', async () => {
    vi.mocked(insertCartItems).mockRejectedValue(foreignKeyError('cart_items_user_id_fkey'));

    await expect(mergeCartUseCase('user-1', guestItems)).rejects.toBeInstanceOf(Unauthorized);
  });

  it('пробрасывает остальные ошибки без изменений', async () => {
    const dbError = new Error('connection lost');
    vi.mocked(insertCartItems).mockRejectedValue(dbError);

    await expect(mergeCartUseCase('user-1', guestItems)).rejects.toBe(dbError);
  });
});
