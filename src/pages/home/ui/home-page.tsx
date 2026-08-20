import { Container } from '@/shared/ui/container';
import { Catalog } from '@/widgets/catalog';

export const HomePage = () => {
  return (
    <main className="">
      <Container>
        <h1 className="sr-only">Меню Burger Shop</h1>
        <Catalog />
      </Container>
    </main>
  );
};
