import { Container } from '@/shared/ui/container';
import { Logo } from '@/shared/ui/logo';

import { CartButton } from './CartButton';

export const Header = () => {
  return (
    <header className="border-b border-[#F6F6F6] py-9">
      <Container>
        <div className="flex items-center justify-between">
          <Logo title="react burger" description="самый вкусный бургер во вселенной" />
          <CartButton />
        </div>
      </Container>
    </header>
  );
};
