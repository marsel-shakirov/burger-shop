import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { MAX_ITEM_QUANTITY, useCartActions, useCartItems } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { setSessionUser } from '@/entities/session';
import { createWrapper } from '@/shared/testing';

import { AddToCartButton } from './add-to-cart-button';

const product: Product = {
  id: 1,
  name: 'Чизбургер',
  description: '',
  price: 250,
  amount: 200,
  rating: 4.8,
  popularity: 10,
  category_id: 1,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
};

const wrapper = createWrapper();

const renderButton = (variant?: 'card' | 'details') =>
  render(<AddToCartButton product={product} variant={variant} />, { wrapper });

const getCartItems = () => renderHook(useCartItems, { wrapper }).result.current.items;

const getAddButton = () => screen.getByRole('button', { name: /^Добавить Чизбургер в корзину/ });

const getIncreaseButton = () =>
  screen.getByRole('button', { name: /^Увеличить количество: Чизбургер/ });

beforeEach(() => {
  setSessionUser(null);
  const { result } = renderHook(useCartActions, { wrapper });
  act(() => result.current.clearCart());
});

describe('AddToCartButton', () => {
  it('показывает кнопку добавления, пока товара нет в корзине', () => {
    renderButton();

    expect(getAddButton()).toBeDefined();
    expect(screen.queryByRole('group')).toBeNull();
  });

  it('добавляет товар и показывает счётчик', () => {
    renderButton();

    fireEvent.click(getAddButton());

    expect(getCartItems()).toEqual([{ productId: 1, quantity: 1 }]);
    expect(screen.getByRole('status', { name: 'Количество товара' }).textContent).toBe('1');
  });

  it('после добавления переводит фокус на кнопку увеличения', () => {
    renderButton();

    fireEvent.click(getAddButton());

    expect(document.activeElement).toBe(getIncreaseButton());
  });

  it('увеличивает и уменьшает количество', () => {
    renderButton();
    fireEvent.click(getAddButton());

    fireEvent.click(getIncreaseButton());
    fireEvent.click(getIncreaseButton());
    fireEvent.click(screen.getByRole('button', { name: 'Уменьшить количество: Чизбургер' }));

    expect(getCartItems()).toEqual([{ productId: 1, quantity: 2 }]);
  });

  it('удаление последней штуки возвращает кнопку добавления с фокусом', () => {
    renderButton();
    fireEvent.click(getAddButton());

    fireEvent.click(screen.getByRole('button', { name: 'Удалить: Чизбургер' }));

    expect(getCartItems()).toEqual([]);
    expect(document.activeElement).toBe(getAddButton());
  });

  it('не даёт добавить больше максимума', () => {
    renderButton();
    fireEvent.click(getAddButton());

    for (let i = 0; i < MAX_ITEM_QUANTITY + 5; i += 1) {
      fireEvent.click(getIncreaseButton());
    }

    expect(getCartItems()).toEqual([{ productId: 1, quantity: MAX_ITEM_QUANTITY }]);
    expect(getIncreaseButton().getAttribute('aria-disabled')).toBe('true');
  });

  it('в карточке товара показывает сумму и количество в корзине', () => {
    renderButton('details');
    fireEvent.click(getAddButton());
    fireEvent.click(getIncreaseButton());

    expect(screen.getByText('2 шт в корзине')).toBeDefined();
    expect(screen.getByRole('status').textContent).toMatch(/500/);
  });
});
