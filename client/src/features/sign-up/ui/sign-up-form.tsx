import { useMutation } from '@tanstack/react-query';
import { type SubmitEvent, useId, useState } from 'react';

import { setSessionUser } from '@/entities/session';
import { FormField } from '@/shared/ui/form-field';
import { PasswordInput } from '@/shared/ui/password-input';
import { PasswordLengthHint } from '@/shared/ui/password-length-hint';
import { TextInput } from '@/shared/ui/text-input';

import { signUp } from '../api/sign-up';
import { getSignUpErrorMessage } from '../lib/get-sign-up-error-message';
import { readSignUpForm } from '../lib/read-sign-up-form';
import type { SignUpFormError } from '../model/sign-up.types';

interface SignUpFormProps {
  defaultEmail?: string;
  onEmailSent: (email: string) => void;
}

export const SignUpForm = ({ defaultEmail, onEmailSent }: SignUpFormProps) => {
  const passwordHintId = useId();
  const errorId = useId();
  const [passwordLength, setPasswordLength] = useState(0);
  const [validationError, setValidationError] = useState<SignUpFormError | null>(null);
  const { mutate, isPending, error, reset } = useMutation({ mutationFn: signUp });

  const errorMessage = validationError?.message ?? (error ? getSignUpErrorMessage(error) : null);
  const isServerError = !validationError && !!error;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = readSignUpForm(new FormData(event.currentTarget));

    if (!result.ok) {
      setValidationError(result.error);
      return;
    }

    const { credentials } = result;

    mutate(credentials, {
      onSuccess: (user) => {
        if (user) {
          setSessionUser(user);
        } else {
          onEmailSent(credentials.email);
        }
      },
    });
  };

  const handleInput = () => {
    setValidationError(null);

    if (error) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} onInput={handleInput} className="flex flex-col gap-y-5">
      <FormField label="Email" invalid={isServerError} errorId={errorId}>
        {(controlProps) => (
          <TextInput
            {...controlProps}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="введите email"
            defaultValue={defaultEmail}
            required
          />
        )}
      </FormField>

      <FormField label="Пароль" invalid={isServerError} errorId={errorId} hintId={passwordHintId}>
        {(controlProps) => (
          <>
            <PasswordInput
              {...controlProps}
              name="password"
              autoComplete="new-password"
              placeholder="придумайте пароль"
              required
              onChange={(event) => setPasswordLength(event.currentTarget.value.length)}
            />
            <PasswordLengthHint id={passwordHintId} length={passwordLength} />
          </>
        )}
      </FormField>

      <FormField
        label="Повторите пароль"
        invalid={validationError?.field === 'confirmPassword'}
        errorId={errorId}
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="повторите пароль"
            required
          />
        )}
      </FormField>

      {errorMessage && (
        <p
          id={errorId}
          role="alert"
          className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <div className="border-t border-dashed border-stone-300 pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-full cursor-pointer rounded-md bg-orange-500 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-orange-500"
        >
          {isPending ? 'Создаём профиль…' : 'Создать профиль'}
        </button>
      </div>
    </form>
  );
};
