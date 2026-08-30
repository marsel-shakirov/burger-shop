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
    <Link to={to} className="flex items-center gap-x-1.5 sm:gap-x-2.5">
      <BurgerIcon className="size-[clamp(2rem,5vw,2.75rem)] shrink-0" />
      <div>
        <span className="text-sm font-extrabold whitespace-nowrap uppercase md:text-xl">
          {title}
        </span>

        <span className="hidden text-sm leading-[1.18] whitespace-nowrap sm:block md:text-lg">
          {description}
        </span>
      </div>
    </Link>
  );
};
