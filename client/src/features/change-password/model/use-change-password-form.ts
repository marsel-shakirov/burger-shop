import { useMutation } from '@tanstack/react-query';
import { type SubmitEvent, useState } from 'react';

import { changePassword } from '../api/change-password';
import { getChangePasswordError } from '../lib/get-change-password-error';
import { readPasswordForm } from '../lib/read-password-form';
import type { PasswordFormError } from './change-password.types';

interface UseChangePasswordFormOptions {
  onChanged: () => void;
}

export const useChangePasswordForm = ({ onChanged }: UseChangePasswordFormOptions) => {
  const [validationError, setValidationError] = useState<PasswordFormError | null>(null);

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => onChanged(),
  });

  const formError = validationError ?? (error ? getChangePasswordError(error) : null);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = readPasswordForm(new FormData(event.currentTarget));

    if (!result.ok) {
      setValidationError(result.error);
      return;
    }

    mutate(result.change);
  };

  const handleInput = () => {
    setValidationError(null);

    if (error) {
      reset();
    }
  };

  return { formError, isPending, handleSubmit, handleInput };
};
