import { describe, expect, it, vi } from 'vitest';

import { deleteCartItems } from './cart.repository.ts';
import { clearCartUseCase } from './clear-cart.use-case.ts';

vi.mock('./cart.repository.ts', () => ({ deleteCartItems: vi.fn() }));

describe('clearCartUseCase', () => {
  it('удаляет все товары из корзины пользователя', async () => {
    await clearCartUseCase('user-1');

    expect(deleteCartItems).toHaveBeenCalledWith('user-1');
  });
});
