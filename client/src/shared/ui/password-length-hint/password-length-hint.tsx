import { PASSWORD_MIN_LENGTH } from '@/shared/config';
import { cn } from '@/shared/lib';
import { DotLeaderRow } from '@/shared/ui/dot-leader-row';

interface PasswordLengthHintProps {
  id: string;
  length: number;
}

export const PasswordLengthHint = ({ id, length }: PasswordLengthHintProps) => {
  const isLongEnough = length >= PASSWORD_MIN_LENGTH;

  return (
    <DotLeaderRow
      className="text-sm"
      label={
        <span id={id} className="text-stone-500">
          Не короче {PASSWORD_MIN_LENGTH} символов
        </span>
      }
      value={
        <span
          aria-hidden="true"
          className={cn(
            'shrink-0 tabular-nums',
            isLongEnough ? 'font-bold text-stone-900' : 'text-stone-500',
          )}
        >
          {isLongEnough ? 'подходит' : `${length} из ${PASSWORD_MIN_LENGTH}`}
        </span>
      }
    />
  );
};
