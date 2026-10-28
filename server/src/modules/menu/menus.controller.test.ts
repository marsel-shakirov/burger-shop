import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../../app.ts';
import { getMenusUseCase } from './get-menus.use-case.ts';

vi.mock('./get-menus.use-case.ts', () => ({ getMenusUseCase: vi.fn() }));

describe('GET /api/menu', () => {
  it('отдаёт меню без сессии', async () => {
    const menus = [{ id: 1, slug: 'burgers', name: 'Бургеры', categories: [] }];
    vi.mocked(getMenusUseCase).mockResolvedValue(menus);

    const response = await request(app).get('/api/menu');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(menus);
  });
});
