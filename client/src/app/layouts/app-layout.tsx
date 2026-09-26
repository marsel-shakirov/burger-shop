import { Outlet } from 'react-router';

import { Header } from '@/widgets/header';
import { MainNav } from '@/widgets/main-nav';

export const AppLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-stone-100 pb-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom))] xs:pb-0">
      <Header navigation={<MainNav variant="header" />} />
      <Outlet />
      <MainNav variant="bottom" />
    </div>
  );
};
