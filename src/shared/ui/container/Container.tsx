import type { ContainerProps } from './container.types';

export const Container = ({ children, className = '', ...props }: ContainerProps) => {
  return (
    <div className={`mx-auto w-full max-w-7xl px-9.5 ${className}`} {...props}>
      {children}
    </div>
  );
};
