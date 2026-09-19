import type { ReactNode } from 'react';

import { routes } from '@/shared/config';
import { Container } from '@/shared/ui/container';

import { Logo } from './logo';

interface HeaderProps {
  navigation?: ReactNode;
}

export const Header = ({ navigation }: HeaderProps) => {
  return (
    <header className="border-b border-stone-200 py-3 sm:py-5 lg:py-7">
      <Container>
        <div className="flex items-center justify-between gap-x-4">
          <Logo
            title="burger shop"
            description="самый вкусный бургер во вселенной"
            to={routes.home}
          />
          {navigation}
        </div>
      </Container>
    </header>
  );
};
