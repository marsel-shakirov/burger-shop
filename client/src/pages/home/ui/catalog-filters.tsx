import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { CategoryFilterSkeleton, MenuTabsSkeleton } from '@/entities/menu';
import { cn, useIsStuck } from '@/shared/lib';

import { CatalogFiltersContent } from './catalog-filters-content';
import { CatalogFiltersError } from './catalog-filters-error';

interface CatalogFiltersProps {
  menuSlug: string;
  categorySlug: string;
  onMenuChange: (slug: string) => void;
  onCategoryChange: (slug: string) => void;
}

export const CatalogFilters = ({
  menuSlug,
  categorySlug,
  onMenuChange,
  onCategoryChange,
}: CatalogFiltersProps) => {
  const { sentinelRef, isStuck } = useIsStuck();
  const { reset } = useQueryErrorResetBoundary();

  const scrollToCatalogStart = () => {
    if (isStuck) sentinelRef.current?.scrollIntoView({ block: 'start' });
  };

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      <div
        className={cn(
          'sticky top-0 z-30 bg-stone-100 pb-3 transition-shadow duration-200 sm:pb-4',
          isStuck && 'shadow-[0_12px_12px_-12px_rgb(0_0_0/0.18)]',
        )}
      >
        <ErrorBoundary onReset={reset} FallbackComponent={CatalogFiltersError}>
          <Suspense
            fallback={
              <>
                <MenuTabsSkeleton />
                <div className="pt-4 sm:pt-5">
                  <CategoryFilterSkeleton />
                </div>
              </>
            }
          >
            <CatalogFiltersContent
              menuSlug={menuSlug}
              categorySlug={categorySlug}
              onMenuChange={(slug) => {
                onMenuChange(slug);
                scrollToCatalogStart();
              }}
              onCategoryChange={(slug) => {
                onCategoryChange(slug);
                scrollToCatalogStart();
              }}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
};
