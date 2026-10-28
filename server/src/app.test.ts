import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import app from './app.ts';
import { Conflict } from './errors/conflict.error.ts';
import { getMenusUseCase } from './modules/menu/get-menus.use-case.ts';
import { getProductsUseCase } from './modules/products/get-products.use-case.ts';
import { getPromosUseCase } from './modules/promos/get-promos.use-case.ts';
import { createSupabase } from './supabase.ts';
import { api, CLIENT_ORIGIN } from './testing/http.ts';
import { createSupabaseMock, noClaimsResult } from './testing/supabase-mock.ts';

vi.mock('./supabase.ts', () => ({ createSupabase: vi.fn(), createStatelessSupabase: vi.fn() }));

vi.mock('./modules/menu/get-menus.use-case.ts', () => ({ getMenusUseCase: vi.fn() }));

vi.mock('./modules/products/get-products.use-case.ts', () => ({ getProductsUseCase: vi.fn() }));

vi.mock('./modules/promos/get-promos.use-case.ts', () => ({ getPromosUseCase: vi.fn() }));

let supabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  supabase = createSupabaseMock();
  supabase.auth.getClaims.mockResolvedValue(noClaimsResult());
  vi.mocked(createSupabase).mockReturnValue(supabase.client);
  vi.mocked(getMenusUseCase).mockResolvedValue([]);
  vi.mocked(getProductsUseCase).mockResolvedValue([]);
  vi.mocked(getPromosUseCase).mockResolvedValue([]);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('app: обработка ошибок', () => {
  it('отдаёт статус и тело CustomError', async () => {
    vi.mocked(getMenusUseCase).mockRejectedValue(new Conflict('Menu is locked', 'menu_locked'));

    const response = await api().get('/api/menu');

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Menu is locked', code: 'menu_locked' });
  });

  it('отдаёт 500 без подробностей и логирует неизвестную ошибку', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('password=secret');
    vi.mocked(getMenusUseCase).mockRejectedValue(error);

    const response = await api().get('/api/menu');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
    expect(consoleError).toHaveBeenCalledWith(error);
  });

  it('отдаёт 400 на битый JSON', async () => {
    const response = await api()
      .post('/api/auth/sign-in')
      .set('Content-Type', 'application/json')
      .send('{"email":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bad request' });
  });
});

describe('app: проверка Origin', () => {
  it('пропускает GET без Origin', async () => {
    const response = await request(app).get('/api/menu');

    expect(response.status).toBe(200);
  });

  it.each([
    ['без Origin', undefined],
    ['с чужим Origin', 'https://evil.test'],
  ])('отвечает 403 на POST %s', async (_case, origin) => {
    const req = request(app).post('/api/auth/sign-out');
    const response = await (origin ? req.set('Origin', origin) : req);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Forbidden' });
    expect(createSupabase).not.toHaveBeenCalled();
  });

  it('пропускает POST с Origin клиента', async () => {
    const response = await request(app).post('/api/auth/sign-out').set('Origin', CLIENT_ORIGIN);

    expect(response.status).toBe(204);
  });
});

describe('app: закрытые маршруты', () => {
  it.each(['/api/profile', '/api/favorites', '/api/cart', '/api/bonus'])(
    '%s отвечает 401 без сессии',
    async (path) => {
      const response = await api().get(path);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Unauthorized' });
      expect(response.headers['cache-control']).toBe('no-store');
    },
  );

  it.each(['/api/products', '/api/menu', '/api/promos', '/api/auth/session'])(
    '%s не требует сессии',
    async (path) => {
      const response = await api().get(path);

      expect(response.status).toBe(200);
    },
  );
});

describe('app: trust proxy', () => {
  const loadApp = async (trustProxy: string) => {
    vi.stubEnv('TRUST_PROXY', trustProxy);
    vi.resetModules();
    return (await import('./app.ts')).default;
  };

  it('не доверяет прокси, если TRUST_PROXY не задан', async () => {
    expect((await loadApp('')).get('trust proxy')).toBe(false);
  });

  it('понимает число прокси', async () => {
    expect((await loadApp('2')).get('trust proxy')).toBe(2);
  });

  it('передаёт остальные значения как есть', async () => {
    expect((await loadApp('loopback')).get('trust proxy')).toBe('loopback');
  });
});
