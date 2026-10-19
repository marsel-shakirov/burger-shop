import type { ReactNode } from 'react';

interface CatalogFiltersLayoutProps {
  menuTabs: ReactNode;
  categoryFilter: ReactNode;
}

export const CatalogFiltersLayout = ({ menuTabs, categoryFilter }: CatalogFiltersLayoutProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <div className="md:shrink-0">{menuTabs}</div>
      <span aria-hidden="true" className="hidden h-7 w-px shrink-0 bg-stone-300 md:block" />
      <div className="min-w-0 md:flex-1">{categoryFilter}</div>
    </div>
  );
};
