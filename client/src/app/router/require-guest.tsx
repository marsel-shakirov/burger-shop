import { Navigate, Outlet } from 'react-router';

import { useSessionStatus } from '@/entities/session';
import { routes } from '@/shared/config';

export const RequireGuest = () => {
  const status = useSessionStatus();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    return <Navigate to={routes.profile} replace />;
  }

  return <Outlet />;
};
