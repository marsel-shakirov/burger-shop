import { useId } from 'react';

import { ModalForm } from '@/shared/ui/modal-form';

import { useChangePasswordForm } from '../model/use-change-password-form';
import { PasswordFields } from './password-fields';

interface ChangePasswordModalProps {
  email: string;
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}

export const ChangePasswordModal = ({
  email,
  open,
  onClose,
  onChanged,
}: ChangePasswordModalProps) => {
  const errorId = useId();
  const { formError, isPending, handleSubmit, handleInput } = useChangePasswordForm({ onChanged });

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title="Смена пароля"
      errorId={errorId}
      errorMessage={formError?.message}
      isPending={isPending}
      submitLabel="Сменить пароль"
      pendingLabel="Сохраняем…"
      onSubmit={handleSubmit}
      onInput={handleInput}
    >
      <input type="email" autoComplete="username" value={email} readOnly hidden />

      <PasswordFields invalidField={formError?.field} errorId={errorId} />
    </ModalForm>
  );
};
