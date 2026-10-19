import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { CategoryFilterSkeleton, MenuTabsSkeleton } from '@/entities/menu';
import { Container } from '@/shared/ui/container';
import { StickyBar } from '@/shared/ui/sticky-bar';

import { CatalogFiltersContent } from './catalog-filters-content';
import { CatalogFiltersError } from './catalog-filters-error';
import { CatalogFiltersLayout } from './catalog-filters-layout';

export const CatalogFilters = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <StickyBar className="pt-4 pb-3 sm:pb-4">
      {({ scrollToStart }) => (
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
              <CatalogFiltersContent onSelectionChange={scrollToStart} />
            </Suspense>
          </ErrorBoundary>
        </Container>
      )}
    </StickyBar>
  );
};
