import { useMutation } from '@tanstack/react-query';
import { type SubmitEvent, useId, useState } from 'react';

import { PasswordInput } from '@/shared/ui/password-input';
import { TextInput } from '@/shared/ui/text-input';

import { signUp } from '../api/sign-up';
import { getSignUpErrorMessage } from '../lib/get-sign-up-error-message';
import { PASSWORD_MIN_LENGTH } from '../model/sign-up.constants';
import { PasswordLengthHint } from './password-length-hint';

interface SignUpFormProps {
  defaultEmail?: string;
  onEmailSent: (email: string) => void;
}

export const SignUpForm = ({ defaultEmail, onEmailSent }: SignUpFormProps) => {
  const emailId = useId();
  const passwordId = useId();
  const passwordHintId = useId();
  const [passwordLength, setPasswordLength] = useState(0);
  const { mutate, isPending, error, reset } = useMutation({ mutationFn: signUp });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email')).trim();

    mutate(
      { email, password: String(formData.get('password')) },
      { onSuccess: () => onEmailSent(email) },
    );
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
          defaultValue={defaultEmail}
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
          autoComplete="new-password"
          placeholder="придумайте пароль"
          minLength={PASSWORD_MIN_LENGTH}
          required
          aria-describedby={passwordHintId}
          aria-invalid={error ? true : undefined}
          onChange={(event) => setPasswordLength(event.currentTarget.value.length)}
        />
        <PasswordLengthHint id={passwordHintId} length={passwordLength} />
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {getSignUpErrorMessage(error)}
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
