import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useCartActions, useCartItems } from '@/entities/cart';
import { setSessionUser } from '@/entities/session';
import { createWrapper } from '@/shared/testing';

import { ClearCartButton } from './clear-cart-button';

const wrapper = createWrapper();

const getCartItems = () => renderHook(useCartItems, { wrapper }).result.current.items;

beforeEach(() => {
  setSessionUser(null);
  const { result } = renderHook(useCartActions, { wrapper });
  act(() => {
    result.current.clearCart();
    result.current.addItem(1);
    result.current.addItem(2);
  });
});

describe('ClearCartButton', () => {
  it('очищает корзину', () => {
    render(<ClearCartButton />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: 'Очистить корзину' }));

    expect(getCartItems()).toEqual([]);
  });
});
