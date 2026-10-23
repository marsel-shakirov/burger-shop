import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { copyText } from './copy-text';

const execCommand = vi.fn<(command: string) => boolean>();

const writeText = vi.fn<(text: string) => Promise<void>>();

const setClipboard = (clipboard: Pick<Clipboard, 'writeText'> | undefined) =>
  Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true });

beforeEach(() => {
  Object.defineProperty(document, 'execCommand', { value: execCommand, configurable: true });
  execCommand.mockReturnValue(true);
  writeText.mockResolvedValue(undefined);
  setClipboard({ writeText });
});

afterEach(() => {
  setClipboard(undefined);
  document.body.replaceChildren();
  vi.clearAllMocks();
});

describe('copyText: Clipboard API', () => {
  it('копирует текст через navigator.clipboard', async () => {
    await expect(copyText('BURGER10')).resolves.toBe(true);

    expect(writeText).toHaveBeenCalledExactlyOnceWith('BURGER10');
    expect(execCommand).not.toHaveBeenCalled();
  });

  it('при ошибке Clipboard API копирует через выделение', async () => {
    writeText.mockRejectedValue(new DOMException('Denied', 'NotAllowedError'));

    await expect(copyText('BURGER10')).resolves.toBe(true);

    expect(execCommand).toHaveBeenCalledExactlyOnceWith('copy');
  });
});

describe('copyText: копирование через выделение', () => {
  beforeEach(() => {
    setClipboard(undefined);
  });

  it('копирует выделенный текст из временного textarea', async () => {
    let copiedValue: string | undefined;
    execCommand.mockImplementation(() => {
      copiedValue = document.querySelector('textarea')?.value;
      return true;
    });

    await expect(copyText('BURGER10')).resolves.toBe(true);

    expect(copiedValue).toBe('BURGER10');
  });

  it('возвращает false, если браузер не скопировал текст', async () => {
    execCommand.mockReturnValue(false);

    await expect(copyText('BURGER10')).resolves.toBe(false);
  });

  it('удаляет временный textarea после копирования', async () => {
    await copyText('BURGER10');

    expect(document.querySelector('textarea')).toBeNull();
  });

  it('возвращает фокус на элемент, который был в фокусе', async () => {
    const button = document.createElement('button');
    document.body.append(button);
    button.focus();

    await copyText('BURGER10');

    expect(document.activeElement).toBe(button);
  });

  it('удаляет textarea и пробрасывает ошибку, если копирование упало', async () => {
    const error = new Error('Not supported');
    execCommand.mockImplementation(() => {
      throw error;
    });

    await expect(copyText('BURGER10')).rejects.toBe(error);
    expect(document.querySelector('textarea')).toBeNull();
  });
});
