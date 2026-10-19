import { Container } from '@/shared/ui/container';

import { useCatalogSelection } from '../model/use-catalog-selection';
import { CatalogFilters } from './catalog-filters';
import { CatalogProducts } from './catalog-products';

export const Catalog = () => {
  const selection = useCatalogSelection();

  return (
    <>
      <CatalogFilters />
      <Container>
        <CatalogProducts selection={selection} />
      </Container>
    </>
  );
};
