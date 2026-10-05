import { useMutation } from '@tanstack/react-query';
import { type SubmitEvent, useId } from 'react';

import { PasswordInput } from '@/shared/ui/password-input';
import { TextInput } from '@/shared/ui/text-input';

import { signIn } from '../api/sign-in';
import { getSignInErrorMessage } from '../lib/get-sign-in-error-message';

export const SignInForm = () => {
  const emailId = useId();
  const passwordId = useId();
  const { mutate, isPending, error, reset } = useMutation({ mutationFn: signIn });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    mutate({
      email: String(formData.get('email')).trim(),
      password: String(formData.get('password')),
    });
  };

  const handleInput = () => {
    if (error) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} onInput={handleInput} className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-2">
        <label htmlFor={emailId} className="font-bold">
          Email
        </label>
        <TextInput
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="введите email"
          required
          aria-invalid={error ? true : undefined}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <label htmlFor={passwordId} className="font-bold">
          Пароль
        </label>
        <PasswordInput
          id={passwordId}
          name="password"
          autoComplete="current-password"
          placeholder="введите пароль"
          required
          aria-invalid={error ? true : undefined}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {getSignInErrorMessage(error)}
        </p>
      )}

      <div className="border-t border-dashed border-stone-300 pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-full cursor-pointer rounded-md bg-orange-500 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-orange-500"
        >
          {isPending ? 'Входим…' : 'Войти'}
        </button>
      </div>
    </form>
  );
};
