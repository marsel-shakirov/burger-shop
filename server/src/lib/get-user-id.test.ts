import type { Request } from 'express';
import { describe, expect, it } from 'vitest';

import { Unauthorized } from '../errors/unauthorized.error.ts';
import { getUserId } from './get-user-id.ts';

describe('getUserId', () => {
  it('возвращает id пользователя из запроса', () => {
    expect(getUserId({ userId: 'user-1' } as Request)).toBe('user-1');
  });

  it.each([
    ['id не задан', {}],
    ['id пустой', { userId: '' }],
  ])('бросает Unauthorized, если %s', (_case, req) => {
    expect(() => getUserId(req as Request)).toThrow(Unauthorized);
  });
});
