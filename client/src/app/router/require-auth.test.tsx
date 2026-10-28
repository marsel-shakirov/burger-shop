import { render, screen } from '@testing-library/react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { useSessionStatus } from '@/entities/session';
import { routes } from '@/shared/config';
import { createWrapper } from '@/shared/testing';

import { RequireAuth } from './require-auth';

type SessionStatus = ReturnType<typeof useSessionStatus>;

const session = vi.hoisted(() => {
  const state: { status: SessionStatus } = { status: 'loading' };

  return state;
});

vi.mock('@/entities/session', () => ({ useSessionStatus: () => session.status }));

const LocationProbe = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  return <output data-testid="location">{`${navigationType} ${pathname}`}</output>;
};

const renderAt = (status: SessionStatus) => {
  session.status = status;

  return render(
    <>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path={routes.profile} element={<p>profile page</p>} />
        </Route>
        <Route path={routes.login} element={<p>login page</p>} />
      </Routes>
      <LocationProbe />
    </>,
    { wrapper: createWrapper({ initialEntries: [routes.profile] }) },
  );
};

const getLocation = () => screen.getByTestId('location').textContent;

beforeEach(() => {
  session.status = 'loading';
});

describe('RequireAuth', () => {
  it('пока сессия загружается, ничего не показывает и не перенаправляет', () => {
    renderAt('loading');

    expect(screen.queryByText('profile page')).toBeNull();
    expect(screen.queryByText('login page')).toBeNull();
    expect(getLocation()).toBe(`POP ${routes.profile}`);
  });

  it('гостя перенаправляет на вход с заменой записи в истории', () => {
    renderAt('guest');

    expect(screen.getByText('login page')).toBeDefined();
    expect(getLocation()).toBe(`REPLACE ${routes.login}`);
  });

  it('авторизованному пользователю показывает страницу', () => {
    renderAt('authenticated');

    expect(screen.getByText('profile page')).toBeDefined();
    expect(getLocation()).toBe(`POP ${routes.profile}`);
  });
});
