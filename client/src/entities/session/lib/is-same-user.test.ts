import { describe, expect, it } from 'vitest';

import type { SessionUser } from '../model/session.types';
import { isSameUser } from './is-same-user';

const user: SessionUser = { id: 'user-1', email: 'user@example.com' };

describe('isSameUser', () => {
  it('считает одинаковыми пользователей с тем же id и email', () => {
    expect(isSameUser(user, { ...user })).toBe(true);
  });

  it('считает одинаковыми одну и ту же ссылку', () => {
    expect(isSameUser(user, user)).toBe(true);
  });

  it('различает пользователей с разным id', () => {
    expect(isSameUser(user, { ...user, id: 'user-2' })).toBe(false);
  });

  it('различает пользователей с тем же id, но другим email', () => {
    expect(isSameUser(user, { ...user, email: 'new@example.com' })).toBe(false);
  });

  it('различает email и его отсутствие', () => {
    expect(isSameUser(user, { ...user, email: null })).toBe(false);
  });

  it('считает одинаковыми двух гостей', () => {
    expect(isSameUser(null, null)).toBe(true);
  });

  it('различает гостя и пользователя в любом порядке', () => {
    expect(isSameUser(null, user)).toBe(false);
    expect(isSameUser(user, null)).toBe(false);
  });
});
