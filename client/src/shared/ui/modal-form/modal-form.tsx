import { type ReactNode, type SubmitEvent, useId } from 'react';

import { Button } from '@/shared/ui/button';
import { FormAlert } from '@/shared/ui/form-alert';
import { Modal } from '@/shared/ui/modal';

interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  title: string;
  errorId: string;
  errorMessage?: string;
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onInput: () => void;
  children: ReactNode;
}

export const ModalForm = ({
  open,
  onClose,
  title,
  errorId,
  errorMessage,
  isPending,
  submitLabel,
  pendingLabel,
  onSubmit,
  onInput,
  children,
}: ModalFormProps) => {
  const titleId = useId();

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <form onSubmit={onSubmit} onInput={onInput} className="flex flex-col gap-y-5 pt-8 sm:pt-10">
        <h2 id={titleId} className="pr-12 font-display text-2xl font-extrabold">
          {title}
        </h2>

        {children}

        {errorMessage && <FormAlert id={errorId}>{errorMessage}</FormAlert>}

        <Button type="submit" pending={isPending} className="w-full">
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </form>
    </Modal>
  );
};
