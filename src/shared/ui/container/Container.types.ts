import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}
