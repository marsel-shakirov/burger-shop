import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSupabase } from '../../supabase.ts';
import { api } from '../../testing/http.ts';
import { claimsResult, createSupabaseMock } from '../../testing/supabase-mock.ts';
import { getProfileUseCase } from './get-profile.use-case.ts';
import { EMPTY_PROFILE } from './profile.constants.ts';
import { updateProfileUseCase } from './update-profile.use-case.ts';

vi.mock('../../supabase.ts', () => ({ createSupabase: vi.fn(), createStatelessSupabase: vi.fn() }));

vi.mock('./get-profile.use-case.ts', () => ({ getProfileUseCase: vi.fn() }));
vi.mock('./update-profile.use-case.ts', () => ({ updateProfileUseCase: vi.fn() }));

const profile = { name: 'Иван', phone: '+79991234567', birthDate: null, gender: null };

beforeEach(() => {
  const supabase = createSupabaseMock();
  supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1' }));
  vi.mocked(createSupabase).mockReturnValue(supabase.client);
});

describe('GET /api/profile', () => {
  it('отдаёт профиль пользователя', async () => {
    vi.mocked(getProfileUseCase).mockResolvedValue(EMPTY_PROFILE);

    const response = await api().get('/api/profile');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(EMPTY_PROFILE);
    expect(getProfileUseCase).toHaveBeenCalledWith('user-1');
  });
});

describe('PATCH /api/profile', () => {
  it('сохраняет нормализованные поля и отдаёт профиль', async () => {
    vi.mocked(updateProfileUseCase).mockResolvedValue(profile);

    const response = await api()
      .patch('/api/profile')
      .send({ name: '  Иван ', phone: '+7 (999) 123-45-67' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(profile);
    expect(updateProfileUseCase).toHaveBeenCalledWith('user-1', {
      name: 'Иван',
      phone: '+79991234567',
    });
  });

  it('очищает телефон при передаче null', async () => {
    vi.mocked(updateProfileUseCase).mockResolvedValue({ ...profile, phone: null });

    const response = await api().patch('/api/profile').send({ phone: null });

    expect(response.status).toBe(200);
    expect(response.body.phone).toBeNull();
    expect(updateProfileUseCase).toHaveBeenCalledWith('user-1', { phone: null });
  });

  it.each([
    ['name', { name: 'а'.repeat(51) }, 'invalid_name'],
    ['phone', { phone: '123' }, 'invalid_phone'],
    ['phone', { phone: '+447911123456' }, 'invalid_phone'],
    ['birthDate', { birthDate: '1899-12-31' }, 'invalid_birth_date'],
    ['gender', { gender: 'other' }, 'invalid_gender'],
  ])('отдаёт код ошибки поля %s', async (_field, body, code) => {
    const response = await api().patch('/api/profile').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bad request', code });
    expect(updateProfileUseCase).not.toHaveBeenCalled();
  });

  it.each([
    ['пустое тело', {}],
    ['лишнее поле', { email: 'user@example.com' }],
    ['нет тела', undefined],
  ])('отвечает 400 без кода поля: %s', async (_case, body) => {
    const response = await api().patch('/api/profile').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Bad request' });
  });
});
