import { Navigate, Outlet, useMatch } from 'react-router';

import { useSessionStatus } from '@/entities/session';
import { routes } from '@/shared/config';

export const RequireAuth = () => {
  const status = useSessionStatus();
  const isCheckout = useMatch(routes.checkout);

  if (status === 'loading') {
    return null;
  }

  if (status === 'guest') {
    const search = isCheckout ? '?next=checkout' : '';
    return <Navigate to={{ pathname: routes.login, search }} replace />;
  }

  return <Outlet />;
};
