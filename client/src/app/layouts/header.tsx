import { routes } from '@/shared/config';
import { Container } from '@/shared/ui/container';

import { Logo } from './logo';

export const Header = () => {
  return (
    <header className="border-b border-stone-200 py-[clamp(12px,4vw,36px)]">
      <Container>
        <div className="flex items-center justify-between gap-x-4">
          <Logo
            title="burger shop"
            description="самый вкусный бургер во вселенной"
            to={routes.home}
          />
        </div>
      </Container>
    </header>
  );
};
