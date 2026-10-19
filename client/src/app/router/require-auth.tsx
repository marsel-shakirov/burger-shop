import { Navigate, Outlet } from 'react-router';

import { useSessionStatus } from '@/entities/session';
import { routes } from '@/shared/config';

export const RequireAuth = () => {
  const status = useSessionStatus();

  if (status === 'guest') {
    return <Navigate to={routes.login} replace />;
  }

  return <Outlet />;
};
