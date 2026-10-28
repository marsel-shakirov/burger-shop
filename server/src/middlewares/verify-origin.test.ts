import type { Request, Response } from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';

const CLIENT_ORIGIN = 'http://localhost:5173';

async function loadVerifyOrigin(env: { CLIENT_ORIGIN?: string; ALLOWED_ORIGINS?: string } = {}) {
  vi.stubEnv('CLIENT_ORIGIN', env.CLIENT_ORIGIN ?? CLIENT_ORIGIN);
  vi.stubEnv('ALLOWED_ORIGINS', 'ALLOWED_ORIGINS' in env ? env.ALLOWED_ORIGINS : '');
  vi.resetModules();

  const { verifyOrigin } = await import('./verify-origin.ts');
  const { Forbidden } = await import('../errors/forbidden.error.ts');

  return { verifyOrigin, Forbidden };
}

const createRequest = (method: string, origin?: string) =>
  ({ method, headers: origin === undefined ? {} : { origin } }) as Request;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('verifyOrigin', () => {
  it.each(['GET', 'HEAD', 'OPTIONS'])(
    'пропускает безопасный метод %s без Origin',
    async (method) => {
      const { verifyOrigin } = await loadVerifyOrigin();
      const next = vi.fn();

      verifyOrigin(createRequest(method), {} as Response, next);

      expect(next).toHaveBeenCalledOnce();
    },
  );

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])('пропускает %s с Origin клиента', async (method) => {
    const { verifyOrigin } = await loadVerifyOrigin();
    const next = vi.fn();

    verifyOrigin(createRequest(method, CLIENT_ORIGIN), {} as Response, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it.each([
    ['без Origin', undefined],
    ['с чужим Origin', 'https://evil.test'],
    ['с Origin null', 'null'],
    ['с Origin клиента на другом порту', 'http://localhost:5174'],
  ])('отклоняет POST %s', async (_case, origin) => {
    const { verifyOrigin, Forbidden } = await loadVerifyOrigin();
    const next = vi.fn();

    expect(() => verifyOrigin(createRequest('POST', origin), {} as Response, next)).toThrow(
      Forbidden,
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('пропускает Origin из ALLOWED_ORIGINS с пробелами вокруг', async () => {
    const { verifyOrigin } = await loadVerifyOrigin({
      ALLOWED_ORIGINS: ' https://a.test , https://b.test ',
    });
    const next = vi.fn();

    verifyOrigin(createRequest('POST', 'https://a.test'), {} as Response, next);
    verifyOrigin(createRequest('POST', 'https://b.test'), {} as Response, next);

    expect(next).toHaveBeenCalledTimes(2);
  });

  it('не пропускает запрос без Origin из-за пустых элементов в ALLOWED_ORIGINS', async () => {
    const { verifyOrigin, Forbidden } = await loadVerifyOrigin({
      ALLOWED_ORIGINS: 'https://a.test,, ,',
    });

    expect(() => verifyOrigin(createRequest('POST'), {} as Response, vi.fn())).toThrow(Forbidden);
  });

  it('пропускает Origin клиента, если CLIENT_ORIGIN задан со слешем на конце', async () => {
    const { verifyOrigin } = await loadVerifyOrigin({ CLIENT_ORIGIN: `${CLIENT_ORIGIN}/` });
    const next = vi.fn();

    verifyOrigin(createRequest('POST', CLIENT_ORIGIN), {} as Response, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('работает только по CLIENT_ORIGIN, если ALLOWED_ORIGINS не задан', async () => {
    const { verifyOrigin, Forbidden } = await loadVerifyOrigin({ ALLOWED_ORIGINS: undefined });
    const next = vi.fn();

    verifyOrigin(createRequest('POST', CLIENT_ORIGIN), {} as Response, next);

    expect(next).toHaveBeenCalledOnce();
    expect(() => verifyOrigin(createRequest('POST'), {} as Response, vi.fn())).toThrow(Forbidden);
  });
});
