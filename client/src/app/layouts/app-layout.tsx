import { Outlet } from 'react-router';

import { BottomNav } from '@/widgets/bottom-nav';
import { Header } from '@/widgets/header';

export const AppLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-stone-100 pb-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom))] xs:pb-0">
      <Header />
      <Outlet />
      <BottomNav />
    </div>
  );
};
