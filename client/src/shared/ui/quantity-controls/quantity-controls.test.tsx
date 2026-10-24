import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QuantityControls } from './quantity-controls';

const renderControls = (quantity: number, label?: string) => {
  const onDecrease = vi.fn();
  const onIncrease = vi.fn();

  render(
    <QuantityControls
      itemName="Чизбургер"
      quantity={quantity}
      min={1}
      max={5}
      onDecrease={onDecrease}
      onIncrease={onIncrease}
      variant="solid"
      label={label}
    />,
  );

  return { onDecrease, onIncrease };
};

describe('QuantityControls', () => {
  it('группирует кнопки под именем товара', () => {
    renderControls(2);

    expect(screen.getByRole('group', { name: 'Изменение количества: Чизбургер' })).toBeDefined();
  });

  it('показывает количество', () => {
    renderControls(3);

    expect(screen.getByRole('status', { name: 'Количество товара' }).textContent).toBe('3');
  });

  it('показывает переданную подпись вместо количества', () => {
    renderControls(3, '3 шт в корзине');

    expect(screen.getByText('3 шт в корзине')).toBeDefined();
  });

  it('кнопка уменьшения вызывает onDecrease', () => {
    const { onDecrease } = renderControls(3);

    fireEvent.click(screen.getByRole('button', { name: 'Уменьшить количество: Чизбургер' }));

    expect(onDecrease).toHaveBeenCalledOnce();
  });

  it('на минимуме кнопка уменьшения подписана как удаление', () => {
    const { onDecrease } = renderControls(1);

    fireEvent.click(screen.getByRole('button', { name: 'Удалить: Чизбургер' }));

    expect(onDecrease).toHaveBeenCalledOnce();
  });

  it('кнопка увеличения вызывает onIncrease', () => {
    const { onIncrease } = renderControls(3);

    fireEvent.click(screen.getByRole('button', { name: 'Увеличить количество: Чизбургер' }));

    expect(onIncrease).toHaveBeenCalledOnce();
  });

  it('на максимуме кнопка увеличения недоступна и сообщает лимит', () => {
    const { onIncrease } = renderControls(5);
    const increase = screen.getByRole('button', {
      name: 'Увеличить количество: Чизбургер, максимум 5 шт',
    });

    fireEvent.click(increase);

    expect(increase.getAttribute('aria-disabled')).toBe('true');
    expect(onIncrease).not.toHaveBeenCalled();
  });

  it('на максимуме кнопка остаётся в фокусе, а не становится disabled', () => {
    renderControls(5);

    expect(
      screen.getByRole('button', { name: /^Увеличить количество/ }).hasAttribute('disabled'),
    ).toBe(false);
  });
});
