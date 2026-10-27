import { Container } from '@/shared/ui/container';
import { StickyBar } from '@/shared/ui/sticky-bar';

import { useCatalog } from '../model/use-catalog';
import { useCatalogScroll } from '../model/use-catalog-scroll';
import { CatalogFilters } from './catalog-filters';
import { CatalogProducts } from './catalog-products';

export const Catalog = () => {
  const catalog = useCatalog();
  const { barRef, activeSection, selectMenu, selectCategory } = useCatalogScroll(catalog.groups);

  return (
    <>
      <StickyBar ref={barRef} className="pt-4 pb-3 sm:pb-4">
        <Container>
          <CatalogFilters
            catalog={catalog}
            activeSection={activeSection}
            onMenuSelect={selectMenu}
            onCategorySelect={selectCategory}
          />
        </Container>
      </StickyBar>
      <Container>
        <CatalogProducts catalog={catalog} />
      </Container>
    </>
  );
};
