import type { ContainerProps } from './container.types';

export const Container = ({ children, className = '', ...props }: ContainerProps) => {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-[clamp(5px,calc(2.8125vw-4px),32px)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
