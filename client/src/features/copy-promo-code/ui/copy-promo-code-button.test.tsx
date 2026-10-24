import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { copyText } from '../lib/copy-text';
import { CopyPromoCodeButton } from './copy-promo-code-button';

vi.mock('../lib/copy-text', () => ({ copyText: vi.fn() }));

const copyTextMock = vi.mocked(copyText);

afterEach(() => {
  vi.clearAllMocks();
});

describe('CopyPromoCodeButton', () => {
  it('предлагает скопировать код', () => {
    render(<CopyPromoCodeButton code="BURGER10" />);

    expect(screen.getByRole('button').textContent).toBe('Скопировать код');
  });

  it('копирует код и сообщает об успехе', async () => {
    copyTextMock.mockResolvedValue(true);
    render(<CopyPromoCodeButton code="BURGER10" />);

    fireEvent.click(screen.getByRole('button'));

    expect(await screen.findByRole('button', { name: 'Код скопирован' })).toBeDefined();
    expect(copyTextMock).toHaveBeenCalledExactlyOnceWith('BURGER10');
  });

  it('если скопировать не вышло, просит скопировать вручную', async () => {
    copyTextMock.mockResolvedValue(false);
    render(<CopyPromoCodeButton code="BURGER10" />);

    fireEvent.click(screen.getByRole('button'));

    expect(await screen.findByRole('button', { name: 'Скопируйте вручную' })).toBeDefined();
  });

  it('повторное копирование после ошибки может пройти успешно', async () => {
    copyTextMock.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<CopyPromoCodeButton code="BURGER10" />);

    fireEvent.click(screen.getByRole('button'));
    await screen.findByRole('button', { name: 'Скопируйте вручную' });
    fireEvent.click(screen.getByRole('button'));

    expect(await screen.findByRole('button', { name: 'Код скопирован' })).toBeDefined();
  });
});
