import { describe, expect, it, vi } from 'vitest';

import { getMenusUseCase } from './get-menus.use-case.ts';
import { findMenus } from './menus.repository.ts';

vi.mock('./menus.repository.ts', () => ({ findMenus: vi.fn() }));

describe('getMenusUseCase', () => {
  it('возвращает меню с категориями из репозитория', async () => {
    const menus = [
      {
        id: 1,
        slug: 'burgers',
        name: 'Бургеры',
        categories: [{ id: 1, slug: 'classic', name: 'Классические' }],
      },
      { id: 2, slug: 'drinks', name: 'Напитки', categories: [] },
    ];
    vi.mocked(findMenus).mockResolvedValue(menus);

    await expect(getMenusUseCase()).resolves.toEqual(menus);
  });
});
