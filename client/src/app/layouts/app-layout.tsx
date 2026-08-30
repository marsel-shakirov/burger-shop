import { Outlet } from 'react-router';

import { Header } from '@/widgets/header';

export const AppLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <Outlet />
    </div>
  );
};
