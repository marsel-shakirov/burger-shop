import { Container } from '@/shared/ui/container';
import { Catalog } from '@/widgets/catalog';

export const HomePage = () => {
  return (
    <main className="">
      <Container>
        <h1 className="pt-[clamp(12px,4vw,32px)] text-2xl font-bold sm:text-4xl">Меню</h1>
        <Catalog />
      </Container>
    </main>
  );
};
