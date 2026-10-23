import { useMutation } from '@tanstack/react-query';
import { type SubmitEvent, useId } from 'react';

import { setSessionUser } from '@/entities/session';
import { getFormString } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { FormAlert } from '@/shared/ui/form-alert';
import { FormField } from '@/shared/ui/form-field';
import { PasswordInput } from '@/shared/ui/password-input';
import { TextInput } from '@/shared/ui/text-input';

import { signIn } from '../api/sign-in';
import { getSignInErrorMessage } from '../lib/get-sign-in-error-message';
import { TestUserButtons } from './test-user-button';

export const SignInForm = () => {
  const errorId = useId();
  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: signIn,
    onSuccess: (user) => setSessionUser(user),
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    mutate({
      email: getFormString(formData, 'email').trim(),
      password: getFormString(formData, 'password'),
    });
  };

  const handleInput = () => {
    if (error) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} onInput={handleInput} className="flex flex-col gap-y-5">
      <FormField label="Email" invalid={!!error} errorId={errorId}>
        {(controlProps) => (
          <TextInput
            {...controlProps}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="введите email"
            required
          />
        )}
      </FormField>

      <FormField label="Пароль" invalid={!!error} errorId={errorId}>
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            name="password"
            autoComplete="current-password"
            placeholder="введите пароль"
            required
          />
        )}
      </FormField>

      {error && <FormAlert id={errorId}>{getSignInErrorMessage(error)}</FormAlert>}

      <div className="flex items-center gap-x-2">
        <p className="font-bold">Тест users: </p>
        <TestUserButtons />
      </div>

      <div className="border-t border-dashed border-stone-300 pt-5">
        <Button type="submit" pending={isPending} className="w-full">
          {isPending ? 'Входим…' : 'Войти'}
        </Button>
      </div>
    </form>
  );
};
