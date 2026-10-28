import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

type LimiterName =
  'signInLimiter' | 'signUpLimiter' | 'changePasswordLimiter' | 'changeEmailLimiter';

async function createApp(limiterName: LimiterName) {
  vi.resetModules();
  const limiters = await import('./rate-limit.ts');

  const app = express();
  app.post('/', limiters[limiterName], (req, res) => {
    res.status(req.query.fail ? 400 : 200).end();
  });

  return app;
}

async function sendRequests(app: express.Express, count: number, path = '/') {
  for (let i = 0; i < count; i += 1) {
    await request(app).post(path);
  }
}

describe('лимиты запросов', () => {
  it.each([
    ['signInLimiter', 10],
    ['signUpLimiter', 5],
    ['changePasswordLimiter', 5],
    ['changeEmailLimiter', 5],
  ] as const)('%s отвечает 429 после %i неудачных запросов', async (limiterName, limit) => {
    const app = await createApp(limiterName);

    await sendRequests(app, limit, '/?fail=1');
    const response = await request(app).post('/?fail=1');

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: 'Too many requests',
      code: 'over_request_rate_limit',
    });
  });

  it.each(['signInLimiter', 'changePasswordLimiter'] as const)(
    '%s не считает успешные запросы',
    async (limiterName) => {
      const app = await createApp(limiterName);

      await sendRequests(app, 20);
      const response = await request(app).post('/?fail=1');

      expect(response.status).toBe(400);
    },
  );

  it.each([
    ['signUpLimiter', 5],
    ['changeEmailLimiter', 5],
  ] as const)('%s считает и успешные запросы', async (limiterName, limit) => {
    const app = await createApp(limiterName);

    await sendRequests(app, limit);
    const response = await request(app).post('/');

    expect(response.status).toBe(429);
  });

  it('отдаёт стандартные заголовки RateLimit и не отдаёт устаревшие X-RateLimit', async () => {
    const app = await createApp('signUpLimiter');

    const response = await request(app).post('/');

    expect(response.headers['ratelimit-policy']).toBeDefined();
    expect(response.headers['ratelimit']).toBeDefined();
    expect(response.headers['x-ratelimit-limit']).toBeUndefined();
  });
});
