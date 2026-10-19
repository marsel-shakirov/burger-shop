import { Container } from '@/shared/ui/container';

import { ALL_CATEGORY } from '../config/catalog.constants';
import { useCatalogSelection } from '../model/use-catalog-selection';
import { CatalogFilters } from './catalog-filters';
import { CatalogProducts } from './catalog-products';

export const Catalog = () => {
  const selection = useCatalogSelection();

  return (
    <>
      <CatalogFilters
        menuSlug={selection.menuSlug}
        categorySlug={selection.categorySlug ?? ALL_CATEGORY.slug}
        onMenuChange={selection.selectMenu}
        onCategoryChange={selection.selectCategory}
      />
      <Container>
        <CatalogProducts selection={selection} />
      </Container>
    </>
  );
};
