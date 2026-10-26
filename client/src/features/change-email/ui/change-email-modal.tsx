import { useId } from 'react';

import { ModalForm } from '@/shared/ui/modal-form';

import { useChangeEmailForm } from '../model/use-change-email-form';
import { EmailFields } from './email-fields';

interface ChangeEmailModalProps {
  email: string;
  open: boolean;
  onClose: () => void;
  onRequested: (newEmail: string) => void;
}

export const ChangeEmailModal = ({ email, open, onClose, onRequested }: ChangeEmailModalProps) => {
  const errorId = useId();
  const { formError, isPending, handleSubmit, handleInput } = useChangeEmailForm({
    currentEmail: email,
    onRequested,
  });

  return (
    <ModalForm
      open={open}
      onClose={onClose}
      title="Смена email"
      errorId={errorId}
      errorMessage={formError?.message}
      isPending={isPending}
      submitLabel="Отправить письмо"
      pendingLabel="Отправляем…"
      onSubmit={handleSubmit}
      onInput={handleInput}
    >
      <p className="text-sm text-stone-500">
        Пришлём ссылки для подтверждения на текущий и новый адрес
      </p>

      <input type="email" autoComplete="username" value={email} readOnly hidden />

      <EmailFields invalidField={formError?.field} errorId={errorId} />
    </ModalForm>
  );
};
