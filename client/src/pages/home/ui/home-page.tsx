import { Container } from '@/shared/ui/container';
import { PromoCarousel } from '@/widgets/promo-carousel';

import { Catalog } from './catalog';

export const HomePage = () => {
  return (
    <main>
      <Container>
        <h1 className="pt-4 text-2xl font-bold sm:pt-7 sm:text-4xl">Меню</h1>
        <PromoCarousel className="pt-3 pb-1 sm:pt-5" />
        <Catalog />
      </Container>
    </main>
  );
};
