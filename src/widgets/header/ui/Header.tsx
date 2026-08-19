import { routes } from '@/shared/routes';
import { Container } from '@/shared/ui/container';

import { CartButton } from './CartButton';
import { Logo } from './Logo';

export const Header = () => {
  return (
    <header className="border-b border-[#F6F6F6] py-9">
      <Container>
        <div className="flex items-center justify-between">
          <Logo
            title="react burger"
            description="самый вкусный бургер во вселенной"
            to={routes.home}
          />
          <CartButton />
        </div>
      </Container>
    </header>
  );
};
