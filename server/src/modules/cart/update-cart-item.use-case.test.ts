import { describe, expect, it, vi } from 'vitest';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { foreignKeyError } from '../../testing/database-error.ts';
import { CART_PRODUCT_FK } from './cart.constants.ts';
import { upsertCartItem } from './cart.repository.ts';
import { updateCartItemUseCase } from './update-cart-item.use-case.ts';

vi.mock('./cart.repository.ts', () => ({ upsertCartItem: vi.fn() }));

describe('updateCartItemUseCase', () => {
  it('сохраняет количество товара в корзине', async () => {
    await updateCartItemUseCase('user-1', 5, 3);

    expect(upsertCartItem).toHaveBeenCalledWith('user-1', 5, 3);
  });

  it('бросает BadRequest product_not_found, если товара нет', async () => {
    vi.mocked(upsertCartItem).mockRejectedValue(foreignKeyError(CART_PRODUCT_FK));

    const error = await updateCartItemUseCase('user-1', 999, 1).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequest);
    expect(error).toMatchObject({ code: 'product_not_found' });
  });

  it('бросает Unauthorized, если пользователя нет', async () => {
    vi.mocked(upsertCartItem).mockRejectedValue(foreignKeyError('cart_items_user_id_fkey'));

    await expect(updateCartItemUseCase('user-1', 5, 1)).rejects.toBeInstanceOf(Unauthorized);
  });

  it('пробрасывает остальные ошибки без изменений', async () => {
    const dbError = new Error('connection lost');
    vi.mocked(upsertCartItem).mockRejectedValue(dbError);

    await expect(updateCartItemUseCase('user-1', 5, 1)).rejects.toBe(dbError);
  });
});
