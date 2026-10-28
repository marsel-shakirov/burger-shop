import { describe, expect, it } from 'vitest';

import { toProductImage } from '../../lib/product-image.ts';
import { toProductResponse } from './products.mapper.ts';

describe('toProductResponse', () => {
  it('переводит строку товара в ответ с картинками', () => {
    expect(
      toProductResponse({
        id: 1,
        name: 'Классический',
        description: 'Говядина, сыр, соус',
        price: 390,
        amount: 250,
        unit: 'g',
        rating: 4.8,
        popularity: 120,
        category_id: 3,
        image_path: 'burgers/classic',
      }),
    ).toEqual({
      id: 1,
      name: 'Классический',
      description: 'Говядина, сыр, соус',
      price: 390,
      amount: 250,
      unit: 'g',
      rating: 4.8,
      popularity: 120,
      categoryId: 3,
      ...toProductImage('burgers/classic'),
    });
  });
});
