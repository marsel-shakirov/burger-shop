import { useMutation } from '@tanstack/react-query';

import { setSessionUser } from '@/entities/session';
import { cn } from '@/shared/lib';

import { signOut } from '../api/sign-out';

interface SignOutButtonProps {
  className?: string;
}

export const SignOutButton = ({ className }: SignOutButtonProps) => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: signOut,
    onSuccess: () => setSessionUser(null),
  });

  return (
    <div className={cn('flex flex-col gap-y-2', className)}>
      <button
        type="button"
        onClick={() => mutate()}
        disabled={isPending}
        className="min-h-11 cursor-pointer rounded-lg border border-stone-300 bg-white px-4 text-sm font-bold text-stone-900 focus-ring transition-colors duration-150 hover:border-stone-600 disabled:cursor-wait disabled:opacity-60 disabled:hover:border-stone-300"
      >
        {isPending ? 'Выходим…' : 'Выйти из профиля'}
      </button>

      {isError && (
        <p role="alert" className="text-center text-sm text-red-700">
          Не получилось выйти. Проверьте интернет и попробуйте ещё раз
        </p>
      )}
    </div>
  );
};
