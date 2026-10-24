import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import type { Product } from '@/entities/product';
import { setSessionUser } from '@/entities/session';
import { createWrapper } from '@/shared/testing';

import { ToggleFavoriteButton } from './toggle-favorite-button';

const createProduct = (id: number, name: string): Product => ({
  id,
  name,
  description: '',
  price: 250,
  amount: 200,
  rating: 4.8,
  popularity: 10,
  category_id: 1,
  imageUrl: '',
  imageSrcSet: '',
  unit: 'g',
});

const wrapper = createWrapper();

const getButton = (name: string) => screen.getByRole('button', { name: `В избранное: ${name}` });

beforeEach(() => {
  setSessionUser(null);
});

describe('ToggleFavoriteButton', () => {
  it('не нажата для товара не из избранного', () => {
    render(<ToggleFavoriteButton variant="product" product={createProduct(101, 'Чизбургер')} />, {
      wrapper,
    });

    expect(getButton('Чизбургер').getAttribute('aria-pressed')).toBe('false');
  });

  it('добавляет товар в избранное и убирает его повторным нажатием', () => {
    render(<ToggleFavoriteButton variant="product" product={createProduct(102, 'Наггетсы')} />, {
      wrapper,
    });

    fireEvent.click(getButton('Наггетсы'));
    expect(getButton('Наггетсы').getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(getButton('Наггетсы'));
    expect(getButton('Наггетсы').getAttribute('aria-pressed')).toBe('false');
  });

  it('кнопки одного товара в разных местах показывают одно состояние', () => {
    const product = createProduct(103, 'Кола');
    render(
      <>
        <ToggleFavoriteButton variant="product" product={product} />
        <ToggleFavoriteButton variant="details" product={product} />
      </>,
      { wrapper },
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'В избранное: Кола' })[0]!);

    expect(
      screen
        .getAllByRole('button', { name: 'В избранное: Кола' })
        .map((button) => button.getAttribute('aria-pressed')),
    ).toEqual(['true', 'true']);
  });

  it('не трогает другие товары', () => {
    render(
      <>
        <ToggleFavoriteButton variant="cart" product={createProduct(104, 'Фри')} />
        <ToggleFavoriteButton variant="cart" product={createProduct(105, 'Соус')} />
      </>,
      { wrapper },
    );

    fireEvent.click(getButton('Фри'));

    expect(getButton('Соус').getAttribute('aria-pressed')).toBe('false');
  });
});
