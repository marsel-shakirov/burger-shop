import { Outlet } from 'react-router';

import { useRememberSearch } from '@/shared/lib';
import { Header } from '@/widgets/header';
import { MainNav } from '@/widgets/main-nav';
import { ProductModal } from '@/widgets/product-modal';

export const AppLayout = () => {
  useRememberSearch();

  return (
    <div className="flex min-h-dvh flex-col bg-stone-100 pb-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom))] xs:pb-0">
      <Header navigation={<MainNav variant="header" />} />
      <Outlet />
      <MainNav variant="bottom" />
      <ProductModal />
    </div>
  );
};
