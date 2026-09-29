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
    <Link to={to} className="flex items-center gap-x-1.5 rounded-md focus-ring sm:gap-x-2.5">
      <BurgerIcon className="size-7 shrink-0 sm:size-10 lg:size-12" />
      <div>
        <span className="font-display text-sm font-extrabold whitespace-nowrap uppercase md:text-xl">
          {title}
        </span>

        <span className="hidden text-sm leading-[1.18] whitespace-nowrap sm:block md:text-base">
          {description}
        </span>
      </div>
    </Link>
  );
};
