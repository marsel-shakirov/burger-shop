export interface LogoProps extends Omit<React.ComponentPropsWithoutRef<'a'>, 'children'> {
  title?: string;
  description?: string;
  href: string;
}
