import { cn } from '@/shared/lib';

import { PASSWORD_MIN_LENGTH } from '../model/sign-up.constants';

interface PasswordLengthHintProps {
  id: string;
  length: number;
}

export const PasswordLengthHint = ({ id, length }: PasswordLengthHintProps) => {
  const isLongEnough = length >= PASSWORD_MIN_LENGTH;

  return (
    <p className="flex items-baseline gap-x-1.5 text-sm">
      <span id={id} className="text-stone-500">
        Не короче {PASSWORD_MIN_LENGTH} символов
      </span>
      <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-stone-300" />
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 tabular-nums',
          isLongEnough ? 'font-bold text-stone-900' : 'text-stone-500',
        )}
      >
        {isLongEnough ? 'подходит' : `${length} из ${PASSWORD_MIN_LENGTH}`}
      </span>
    </p>
  );
};
