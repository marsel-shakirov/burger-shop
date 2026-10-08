import { useMutation } from '@tanstack/react-query';

import { useSessionStore } from '@/entities/session';
import { cn } from '@/shared/lib';

import { signOut } from '../api/sign-out';

interface SignOutButtonProps {
  className?: string;
}

export const SignOutButton = ({ className }: SignOutButtonProps) => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: signOut,
    onSuccess: () => useSessionStore.getState().setUser(null),
  });

  return (
    <div className={cn('flex flex-col gap-y-2', className)}>
      <button
        type="button"
        onClick={() => mutate()}
        disabled={isPending}
        className="h-12 w-full cursor-pointer rounded-md border border-stone-400 bg-white font-bold text-stone-900 focus-ring transition-colors duration-150 hover:border-stone-900 disabled:cursor-wait disabled:opacity-60 disabled:hover:border-stone-400"
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
