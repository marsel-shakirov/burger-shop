import type { LinkProps } from 'react-router';

export interface LogoProps {
  title?: string;
  description?: string;
  to: LinkProps['to'];
}
