import type { ReactNode } from 'react';

import type { AddToCartVariant } from '../model/add-to-cart.types';

interface AddToCartFrameProps {
  variant: AddToCartVariant;
  isActive: boolean;
  children: ReactNode;
}

const styles: Record<AddToCartVariant, { root: string; slider: string; sliderIdle: string }> = {
  card: {
    root: 'h-9 rounded-md',
    slider: 'rounded-md',
    sliderIdle: 'inset-y-1 right-1 w-7 rounded-[5px] group-hover/add:w-9',
  },
  details: {
    root: 'h-14 rounded-[14px]',
    slider: 'rounded-[14px]',
    sliderIdle: 'inset-y-1.5 right-1.5 w-36 rounded-[10px]',
  },
};

export const AddToCartFrame = ({ variant, isActive, children }: AddToCartFrameProps) => {
  const s = styles[variant];

  return (
    <div
      className={`group/add relative bg-stone-100 ring-1 ring-stone-200 transition-colors duration-150 ring-inset ${s.root} ${
        isActive ? '' : 'hover:bg-stone-200'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute bg-orange-500 transition-all duration-200 ease-out motion-reduce:transition-none ${
          isActive
            ? `inset-y-0 right-0 w-full ${s.slider}`
            : `${s.sliderIdle} group-hover/add:bg-orange-600`
        }`}
      />
      {children}
    </div>
  );
};
