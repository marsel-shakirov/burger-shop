import type { ContainerProps } from './Container.types';

export const Container = ({ children }: ContainerProps) => {
  return <div className="mx-auto w-full max-w-7xl px-9.5">{children}</div>;
};
