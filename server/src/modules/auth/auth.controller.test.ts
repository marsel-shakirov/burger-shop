import { AuthApiError } from '@supabase/supabase-js';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import app from '../../app.ts';
import { Conflict } from '../../errors/conflict.error.ts';
import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { createStatelessSupabase, createSupabase } from '../../supabase.ts';
import { api } from '../../testing/http.ts';
import {
  claimsResult,
  createStatelessSupabaseMock,
  createSupabaseMock,
  noClaimsResult,
} from '../../testing/supabase-mock.ts';
import { changeEmailUseCase } from './change-email.use-case.ts';
import { changePasswordUseCase } from './change-password.use-case.ts';
import { confirmEmailChangeUseCase } from './confirm-email-change.use-case.ts';
import { exchangeCodeUseCase } from './exchange-code.use-case.ts';
import { getSessionUseCase } from './get-session.use-case.ts';
import { signInUseCase } from './sign-in.use-case.ts';
import { signOutUseCase } from './sign-out.use-case.ts';
import { signUpUseCase } from './sign-up.use-case.ts';

vi.mock('../../supabase.ts', () => ({ createSupabase: vi.fn(), createStatelessSupabase: vi.fn() }));

vi.mock('../../middlewares/rate-limit.ts', () => {
  const pass = (_req: unknown, _res: unknown, next: () => void) => next();
  return {
    signInLimiter: pass,
    signUpLimiter: pass,
    changePasswordLimiter: pass,
    changeEmailLimiter: pass,
  };
});

vi.mock('./change-email.use-case.ts', () => ({ changeEmailUseCase: vi.fn() }));
vi.mock('./change-password.use-case.ts', () => ({ changePasswordUseCase: vi.fn() }));
vi.mock('./confirm-email-change.use-case.ts', () => ({ confirmEmailChangeUseCase: vi.fn() }));
vi.mock('./exchange-code.use-case.ts', () => ({ exchangeCodeUseCase: vi.fn() }));
vi.mock('./get-session.use-case.ts', () => ({ getSessionUseCase: vi.fn() }));
vi.mock('./sign-in.use-case.ts', () => ({ signInUseCase: vi.fn() }));
vi.mock('./sign-out.use-case.ts', () => ({ signOutUseCase: vi.fn() }));
vi.mock('./sign-up.use-case.ts', () => ({ signUpUseCase: vi.fn() }));

const EMAIL = 'user@example.com';
const PASSWORD = 'long-enough-password';
const user = { id: 'user-1', email: EMAIL };

let supabase: ReturnType<typeof createSupabaseMock>;
let verifier: ReturnType<typeof createStatelessSupabaseMock>;

beforeEach(() => {
  supabase = createSupabaseMock();
  verifier = createStatelessSupabaseMock();
  supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1', email: EMAIL }));
  vi.mocked(createSupabase).mockReturnValue(supabase.client);
  vi.mocked(createStatelessSupabase).mockReturnValue(verifier.client);
});

describe('POST /api/auth/sign-up', () => {
  it('регистрирует и отвечает 201 с пользователем', async () => {
    vi.mocked(signUpUseCase).mockResolvedValue(user);

    const response = await api()
      .post('/api/auth/sign-up')
      .send({ email: EMAIL, password: PASSWORD });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ user });
    expect(signUpUseCase).toHaveBeenCalledWith(supabase.client, {
      email: EMAIL,
      password: PASSWORD,
    });
  });

  it('отвечает user: null, если нужно подтвердить email', async () => {
    vi.mocked(signUpUseCase).mockResolvedValue(null);

    const response = await api()
      .post('/api/auth/sign-up')
      .send({ email: EMAIL, password: PASSWORD });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ user: null });
  });

  it.each([
    ['короткий', 'short'],
    ['длинный', 'a'.repeat(73)],
  ])('отвечает weak_password length на %s пароль', async (_case, password) => {
    const response = await api().post('/api/auth/sign-up').send({ email: EMAIL, password });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Weak password',
      code: 'weak_password',
      reasons: ['length'],
    });
    expect(signUpUseCase).not.toHaveBeenCalled();
  });

  it.each([
    ['некорректный email', { email: 'user', password: PASSWORD }],
    ['лишнее поле', { email: EMAIL, password: PASSWORD, role: 'admin' }],
    ['пустое тело', undefined],
  ])('отвечает 400 Bad request: %s', async (_case, body) => {
    const response = await api().post('/api/auth/sign-up').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bad request' });
    expect(signUpUseCase).not.toHaveBeenCalled();
  });

  it('отдаёт ошибку use-case', async () => {
    vi.mocked(signUpUseCase).mockRejectedValue(
      new Conflict('Email already registered', 'email_exists'),
    );

    const response = await api()
      .post('/api/auth/sign-up')
      .send({ email: EMAIL, password: PASSWORD });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Email already registered', code: 'email_exists' });
  });
});

describe('POST /api/auth/sign-in', () => {
  it('входит и отвечает 200 с пользователем', async () => {
    vi.mocked(signInUseCase).mockResolvedValue(user);

    const response = await api().post('/api/auth/sign-in').send({ email: EMAIL, password: 'x' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user });
    expect(signInUseCase).toHaveBeenCalledWith(supabase.client, { email: EMAIL, password: 'x' });
  });

  it.each([
    ['некорректный email', { email: 'user', password: 'x' }],
    ['пустой пароль', { email: EMAIL, password: '' }],
  ])('отвечает 400 Bad request: %s', async (_case, body) => {
    const response = await api().post('/api/auth/sign-in').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bad request' });
    expect(signInUseCase).not.toHaveBeenCalled();
  });

  it('отдаёт ошибку Supabase', async () => {
    vi.mocked(signInUseCase).mockRejectedValue(
      new SupabaseAuthError(
        new AuthApiError('Invalid login credentials', 400, 'invalid_credentials'),
      ),
    );

    const response = await api().post('/api/auth/sign-in').send({ email: EMAIL, password: 'x' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Invalid login credentials',
      code: 'invalid_credentials',
    });
  });
});

describe('POST /api/auth/sign-out', () => {
  it('выходит и отвечает 204', async () => {
    const response = await api().post('/api/auth/sign-out');

    expect(response.status).toBe(204);
    expect(signOutUseCase).toHaveBeenCalledWith(supabase.client);
  });
});

describe('GET /api/auth/session', () => {
  it('отдаёт пользователя и запрещает кеширование', async () => {
    vi.mocked(getSessionUseCase).mockResolvedValue(user);

    const response = await request(app).get('/api/auth/session');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user });
    expect(response.headers['cache-control']).toBe('no-store');
  });

  it('отдаёт user: null без сессии', async () => {
    vi.mocked(getSessionUseCase).mockResolvedValue(null);

    const response = await request(app).get('/api/auth/session');

    expect(response.body).toEqual({ user: null });
  });
});

describe('POST /api/auth/password', () => {
  const body = { currentPassword: 'old-password', newPassword: PASSWORD };

  it('меняет пароль и отвечает 204', async () => {
    const response = await api().post('/api/auth/password').send(body);

    expect(response.status).toBe(204);
    expect(changePasswordUseCase).toHaveBeenCalledWith(supabase.client, verifier.client, body);
  });

  it('отвечает 401 без сессии', async () => {
    supabase.auth.getClaims.mockResolvedValue(noClaimsResult());

    const response = await api().post('/api/auth/password').send(body);

    expect(response.status).toBe(401);
    expect(changePasswordUseCase).not.toHaveBeenCalled();
  });

  it('отвечает weak_password length на короткий новый пароль', async () => {
    const response = await api()
      .post('/api/auth/password')
      .send({ ...body, newPassword: 'short' });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ code: 'weak_password', reasons: ['length'] });
  });

  it('отвечает 400 Bad request на пустой текущий пароль', async () => {
    const response = await api()
      .post('/api/auth/password')
      .send({ ...body, currentPassword: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bad request' });
  });
});

describe('POST /api/auth/email', () => {
  const body = { newEmail: 'new@example.com', currentPassword: 'secret' };

  it('запрашивает смену email и отвечает 204', async () => {
    const response = await api().post('/api/auth/email').send(body);

    expect(response.status).toBe(204);
    expect(changeEmailUseCase).toHaveBeenCalledWith(supabase.client, verifier.client, body);
  });

  it('отвечает 401 без сессии', async () => {
    supabase.auth.getClaims.mockResolvedValue(noClaimsResult());

    const response = await api().post('/api/auth/email').send(body);

    expect(response.status).toBe(401);
    expect(changeEmailUseCase).not.toHaveBeenCalled();
  });

  it('отвечает email_address_invalid на некорректный email', async () => {
    const response = await api()
      .post('/api/auth/email')
      .send({ ...body, newEmail: 'new@' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid email', code: 'email_address_invalid' });
  });

  it('отвечает 400 Bad request на пустой текущий пароль', async () => {
    const response = await api()
      .post('/api/auth/email')
      .send({ ...body, currentPassword: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bad request' });
  });
});

describe('GET /api/auth/callback', () => {
  it('ведёт в профиль, если код обменялся на сессию', async () => {
    vi.mocked(exchangeCodeUseCase).mockResolvedValue(true);

    const response = await request(app).get('/api/auth/callback?code=code-1');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/profile');
    expect(exchangeCodeUseCase).toHaveBeenCalledWith(supabase.client, 'code-1');
  });

  it('ведёт на вход с email_confirmed, если сессию открыть не удалось', async () => {
    vi.mocked(exchangeCodeUseCase).mockResolvedValue(false);

    const response = await request(app).get('/api/auth/callback?code=code-1');

    expect(response.headers.location).toBe('/profile/login?email_confirmed=1');
  });

  it.each([
    ['без code', ''],
    ['с пустым code', '?code='],
    ['с несколькими code', '?code=a&code=b'],
  ])('ведёт на вход с ошибкой %s', async (_case, query) => {
    const response = await request(app).get(`/api/auth/callback${query}`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/profile/login?error=confirm_failed');
    expect(exchangeCodeUseCase).not.toHaveBeenCalled();
  });
});

describe('GET /api/auth/email-callback', () => {
  it.each(['changed', 'confirm_other', 'failed'] as const)(
    'ведёт в редактирование профиля со статусом %s',
    async (status) => {
      vi.mocked(confirmEmailChangeUseCase).mockResolvedValue(status);

      const response = await request(app).get('/api/auth/email-callback?code=code-1');

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe(`/profile/edit?email=${status}`);
      expect(confirmEmailChangeUseCase).toHaveBeenCalledWith(supabase.client, { code: 'code-1' });
    },
  );

  it('ведёт со статусом failed без вызова use-case на некорректный запрос', async () => {
    const response = await request(app).get('/api/auth/email-callback?code=');

    expect(response.headers.location).toBe('/profile/edit?email=failed');
    expect(confirmEmailChangeUseCase).not.toHaveBeenCalled();
  });
});
