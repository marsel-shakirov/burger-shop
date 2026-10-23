import { useId } from 'react';

import { Modal } from '@/shared/ui/modal';

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
  const titleId = useId();
  const errorId = useId();
  const { formError, isPending, handleSubmit, handleInput } = useChangePasswordForm({ onChanged });

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <form
        onSubmit={handleSubmit}
        onInput={handleInput}
        className="flex flex-col gap-y-5 pt-8 sm:pt-10"
      >
        <h2 id={titleId} className="pr-12 font-display text-2xl font-extrabold">
          Смена пароля
        </h2>

        <input type="email" autoComplete="username" value={email} readOnly hidden />

        <PasswordFields invalidField={formError?.field} errorId={errorId} />

        {formError && (
          <p
            id={errorId}
            role="alert"
            className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-full cursor-pointer rounded-md bg-orange-500 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-orange-500"
        >
          {isPending ? 'Сохраняем…' : 'Сменить пароль'}
        </button>
      </form>
    </Modal>
  );
};
