import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './modal';

const renderModal = (open: boolean, onClose = vi.fn()) => {
  const view = render(
    <Modal open={open} onClose={onClose} labelledBy="modal-title">
      <h2 id="modal-title">Заголовок</h2>
      <button type="button">Внутри</button>
    </Modal>,
  );

  return { ...view, onClose };
};

const getDialog = () => screen.getByRole<HTMLDialogElement>('dialog', { hidden: true });

describe('Modal', () => {
  it('открывается, когда open=true', () => {
    renderModal(true);

    expect(getDialog().open).toBe(true);
  });

  it('закрыта, когда open=false', () => {
    renderModal(false);

    expect(getDialog().open).toBe(false);
  });

  it('подписана заголовком', () => {
    renderModal(true);

    expect(screen.getByRole('dialog', { name: 'Заголовок' })).toBe(getDialog());
  });

  it('кнопка «Закрыть» закрывает модалку и вызывает onClose', () => {
    const { onClose } = renderModal(true);

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    expect(getDialog().open).toBe(false);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('клик по фону вне панели закрывает модалку', () => {
    const { onClose } = renderModal(true);

    fireEvent.click(getDialog());

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('клик внутри панели не закрывает модалку', () => {
    const { onClose } = renderModal(true);

    fireEvent.click(screen.getByRole('button', { name: 'Внутри' }));

    expect(getDialog().open).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('закрытие браузером, например по Escape, вызывает onClose', () => {
    const { onClose } = renderModal(true);

    getDialog().close();

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('закрывается при open=false без вызова onClose', () => {
    const { rerender, onClose } = renderModal(true);

    rerender(
      <Modal open={false} onClose={onClose} labelledBy="modal-title">
        <h2 id="modal-title">Заголовок</h2>
      </Modal>,
    );

    expect(getDialog().open).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });
});
