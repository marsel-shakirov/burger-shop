import type { LinkProps } from 'react-router';
import { Link } from 'react-router';

import { BurgerIcon } from '@/shared/ui/icon';

export interface LogoProps {
  title?: string;
  description?: string;
  to: LinkProps['to'];
}

export const Logo = ({ title, description, to }: LogoProps) => {
  return (
    <Link to={to} className="flex items-center gap-x-4.25">
      <BurgerIcon className="size-11" />
      <div>
        <span className="text-2xl font-extrabold uppercase">{title}</span>
        <span className="block text-base/[1.1875]">{description}</span>
      </div>
    </Link>
  );
};
