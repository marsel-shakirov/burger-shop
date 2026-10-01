import type { ReactNode } from 'react';

interface CartHeaderProps {
  subtitle: string;
  action?: ReactNode;
}

export const CartHeader = ({ subtitle, action }: CartHeaderProps) => {
  return (
    <header className="flex items-end justify-between gap-x-4 pt-4 sm:pt-7">
      <div className="flex flex-col gap-y-5">
        <h1 className="text-2xl font-bold sm:text-4xl">Корзина</h1>
        <p className="text-stone-600">{subtitle}</p>
      </div>

      {action}
    </header>
  );
};
