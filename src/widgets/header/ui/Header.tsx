import { useMatch } from 'react-router';

import { routes } from '@/shared/routes';
import { Container } from '@/shared/ui/container';

import { CartButton } from './cart-button';
import { Logo } from './logo';

export const Header = () => {
  const isCartPage = useMatch(routes.cart);

  return (
    <header className="border-b border-neutral-100 py-[clamp(12px,4vw,36px)]">
      <Container>
        <div className="flex items-center justify-between gap-x-4">
          <Logo
            title="burger shop"
            description="самый вкусный бургер во вселенной"
            to={routes.home}
          />
          {!isCartPage && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
