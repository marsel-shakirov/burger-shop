import { describe, expect, it } from 'vitest';

import { toSessionUser } from './auth.mapper.ts';

describe('toSessionUser', () => {
  it('оставляет только id и email', () => {
    expect(
      toSessionUser({ id: 'user-1', email: 'user@example.com', role: 'authenticated' } as {
        id: string;
        email: string;
      }),
    ).toEqual({ id: 'user-1', email: 'user@example.com' });
  });

  it('заменяет отсутствующий email на null', () => {
    expect(toSessionUser({ id: 'user-1' })).toEqual({ id: 'user-1', email: null });
  });
});
