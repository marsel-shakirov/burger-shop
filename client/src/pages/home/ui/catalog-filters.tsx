import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { CategoryFilterSkeleton, MenuTabsSkeleton } from '@/entities/menu';
import { cn, useIsStuck } from '@/shared/lib';
import { Container } from '@/shared/ui/container';

import { CatalogFiltersContent } from './catalog-filters-content';
import { CatalogFiltersError } from './catalog-filters-error';
import { CatalogFiltersLayout } from './catalog-filters-layout';

export const CatalogFilters = () => {
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
          'sticky top-0 z-30 bg-stone-100 pt-4 pb-3 transition-shadow duration-200 sm:pb-4',
          isStuck && 'shadow-[0_12px_12px_-12px_rgb(0_0_0/0.18)]',
        )}
      >
        <Container>
          <ErrorBoundary onReset={reset} FallbackComponent={CatalogFiltersError}>
            <Suspense
              fallback={
                <CatalogFiltersLayout
                  menuTabs={<MenuTabsSkeleton />}
                  categoryFilter={<CategoryFilterSkeleton />}
                />
              }
            >
              <CatalogFiltersContent onSelectionChange={scrollToCatalogStart} />
            </Suspense>
          </ErrorBoundary>
        </Container>
      </div>
    </>
  );
};
