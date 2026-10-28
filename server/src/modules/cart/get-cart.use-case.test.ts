import { describe, expect, it, vi } from 'vitest';

import { findCartItems } from './cart.repository.ts';
import { getCartUseCase } from './get-cart.use-case.ts';

vi.mock('./cart.repository.ts', () => ({ findCartItems: vi.fn() }));

describe('getCartUseCase', () => {
  it('возвращает корзину пользователя', async () => {
    vi.mocked(findCartItems).mockResolvedValue([{ product_id: 3, quantity: 2 }]);

    await expect(getCartUseCase('user-1')).resolves.toEqual({
      items: [{ productId: 3, quantity: 2 }],
    });
    expect(findCartItems).toHaveBeenCalledWith('user-1');
  });
});
