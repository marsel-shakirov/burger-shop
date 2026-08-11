import { Container } from '@/shared/ui/container';
import { CatalogToolbar } from '@/widgets/catalog-toolbar';
import { ProductGrid } from '@/widgets/product-grid';

export const HomePage = () => {
  return (
    <main className="">
      <Container>
        <CatalogToolbar />
        <ProductGrid />
      </Container>
    </main>
  );
};
