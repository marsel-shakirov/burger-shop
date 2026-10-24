import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createWrapper } from '@/shared/testing';

import { OPENED_FROM_LIST_STATE } from '../config/product.constants';
import { useProductDetailsLink } from './use-product-details-link';

const render = (productId: number, initialEntry: string) =>
  renderHook(() => useProductDetailsLink(productId), {
    wrapper: createWrapper({ initialEntries: [initialEntry] }),
  });

describe('useProductDetailsLink', () => {
  it('добавляет товар к текущим параметрам адреса', () => {
    const { result } = render(7, '/?menu=drinks&sort=price');

    expect(result.current.to).toEqual({ search: '?menu=drinks&sort=price&product=7' });
  });

  it('ставит товар, если параметров нет', () => {
    const { result } = render(7, '/');

    expect(result.current.to).toEqual({ search: '?product=7' });
  });

  it('заменяет уже открытый товар, а не добавляет второй', () => {
    const { result } = render(7, '/?product=5&menu=drinks');

    expect(result.current.to).toEqual({ search: '?product=7&menu=drinks' });
  });

  it('помечает переход как открытие из списка', () => {
    const { result } = render(7, '/');

    expect(result.current.state).toBe(OPENED_FROM_LIST_STATE);
  });
});
