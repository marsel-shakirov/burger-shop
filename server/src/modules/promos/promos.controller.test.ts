import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../../app.ts';
import { getPromosUseCase } from './get-promos.use-case.ts';

vi.mock('./get-promos.use-case.ts', () => ({ getPromosUseCase: vi.fn() }));

describe('GET /api/promos', () => {
  it('отдаёт акции без сессии', async () => {
    const promos = [{ id: 1, title: 'Скидка', kind: 'coupon', code: 'BURGER20' }];
    vi.mocked(getPromosUseCase).mockResolvedValue(
      promos as Awaited<ReturnType<typeof getPromosUseCase>>,
    );

    const response = await request(app).get('/api/promos');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(promos);
  });
});
