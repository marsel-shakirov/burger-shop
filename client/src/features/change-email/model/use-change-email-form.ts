import { useMutation } from '@tanstack/react-query';
import { type SubmitEvent, useState } from 'react';

import { changeEmail } from '../api/change-email';
import { getChangeEmailError } from '../lib/get-change-email-error';
import { readEmailForm } from '../lib/read-email-form';
import type { EmailFormError } from './change-email.types';

interface UseChangeEmailFormOptions {
  currentEmail: string;
  onRequested: (newEmail: string) => void;
}

export const useChangeEmailForm = ({ currentEmail, onRequested }: UseChangeEmailFormOptions) => {
  const [validationError, setValidationError] = useState<EmailFormError | null>(null);

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: changeEmail,
    onSuccess: (_data, { newEmail }) => onRequested(newEmail),
  });

  const formError = validationError ?? (error ? getChangeEmailError(error) : null);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = readEmailForm(new FormData(event.currentTarget), currentEmail);

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
