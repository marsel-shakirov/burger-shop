import { type ComponentPropsWithoutRef, useState } from 'react';

import { cn } from '@/shared/lib';

import { TextInput } from '../text-input';

type PasswordInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

export const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <TextInput
        {...props}
        type={isVisible ? 'text' : 'password'}
        className={cn('pr-28', className)}
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        className="absolute inset-y-1.5 right-1.5 cursor-pointer rounded-sm px-3 text-sm font-bold text-stone-600 focus-ring transition-colors duration-150 hover:bg-stone-100 hover:text-stone-900"
      >
        {isVisible ? 'Скрыть' : 'Показать'}
        <span className="sr-only"> пароль</span>
      </button>
    </div>
  );
};
