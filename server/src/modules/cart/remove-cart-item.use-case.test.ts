import { describe, expect, it, vi } from 'vitest';

import { deleteCartItem } from './cart.repository.ts';
import { removeCartItemUseCase } from './remove-cart-item.use-case.ts';

vi.mock('./cart.repository.ts', () => ({ deleteCartItem: vi.fn() }));

describe('removeCartItemUseCase', () => {
  it('удаляет товар из корзины пользователя', async () => {
    await removeCartItemUseCase('user-1', 5);

    expect(deleteCartItem).toHaveBeenCalledWith('user-1', 5);
  });
});
