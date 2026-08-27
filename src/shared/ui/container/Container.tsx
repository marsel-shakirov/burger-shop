import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

export const Container = ({ children, className = '', ...props }: ContainerProps) => {
  return (
    <div {...props} className={`mx-auto w-full max-w-7xl px-[clamp(16px,5vw,40px)] ${className}`}>
      {children}
    </div>
  );
};
