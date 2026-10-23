import { useId, useState } from 'react';

import { FormField } from '@/shared/ui/form-field';
import { PasswordInput } from '@/shared/ui/password-input';
import { PasswordLengthHint } from '@/shared/ui/password-length-hint';

import type { PasswordFormField } from '../model/change-password.types';

interface PasswordFieldsProps {
  invalidField?: PasswordFormField;
  errorId: string;
}

export const PasswordFields = ({ invalidField, errorId }: PasswordFieldsProps) => {
  const passwordHintId = useId();
  const [newPasswordLength, setNewPasswordLength] = useState(0);

  return (
    <>
      <FormField
        label="Текущий пароль"
        invalid={invalidField === 'currentPassword'}
        errorId={errorId}
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            name="currentPassword"
            autoComplete="current-password"
            placeholder="введите текущий пароль"
            required
          />
        )}
      </FormField>

      <FormField
        label="Новый пароль"
        invalid={invalidField === 'newPassword'}
        errorId={errorId}
        hintId={passwordHintId}
      >
        {(controlProps) => (
          <>
            <PasswordInput
              {...controlProps}
              name="newPassword"
              autoComplete="new-password"
              placeholder="придумайте новый пароль"
              required
              onChange={(event) => setNewPasswordLength(event.currentTarget.value.length)}
            />
            <PasswordLengthHint id={passwordHintId} length={newPasswordLength} />
          </>
        )}
      </FormField>

      <FormField
        label="Повторите пароль"
        invalid={invalidField === 'confirmPassword'}
        errorId={errorId}
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="повторите новый пароль"
            required
          />
        )}
      </FormField>
    </>
  );
};
