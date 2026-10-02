import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react';

import { CloseIcon } from '@/shared/ui/icon';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}

export const Modal = ({ open, onClose, labelledBy, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleDialogClose = () => {
    const isClosedByUser = open;
    if (isClosedByUser) onClose();
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const isClickOutsidePanel = !panelRef.current?.contains(event.target as Node);
    if (isClickOutsidePanel) event.currentTarget.close();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
      className="m-0 size-full max-h-none max-w-none overflow-y-auto overscroll-contain modal-fade bg-transparent p-0 motion-safe:max-sm:animate-sheet-up"
    >
      <div className="flex min-h-full items-end justify-center pt-28 sm:items-center sm:px-6 sm:pt-36 sm:pb-6">
        <div
          ref={panelRef}
          className="relative w-full max-w-120 rounded-t-[1.75rem] bg-white px-5 pb-[calc(1.75rem+env(safe-area-inset-bottom))] text-stone-900 shadow-[0_-10px_40px_rgb(12_10_9/0.25)] sm:rounded-3xl sm:px-8 sm:pb-8 sm:shadow-[0_30px_80px_rgb(12_10_9/0.35)] motion-safe:sm:animate-modal-rise"
        >
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Закрыть"
            className="absolute top-3 right-3 z-10 grid size-11 cursor-pointer place-items-center rounded-full bg-stone-100 text-stone-700 focus-ring transition-colors duration-150 hover:bg-stone-200 sm:top-4 sm:right-4"
          >
            <CloseIcon className="size-3.5 sm:size-4" />
          </button>

          {children}
        </div>
      </div>
    </dialog>
  );
};
