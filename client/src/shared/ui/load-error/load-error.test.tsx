import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LoadError } from './load-error';

describe('LoadError', () => {
  it('сообщает об ошибке через role="alert"', () => {
    render(<LoadError message="Товары не загрузились" onRetry={vi.fn()} />);

    expect(screen.getByRole('alert').textContent).toMatch(/^Товары не загрузились/);
  });

  it('кнопка «Повторить» вызывает onRetry', () => {
    const onRetry = vi.fn();
    render(<LoadError message="Товары не загрузились" onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('кнопка не отправляет форму, внутри которой может оказаться', () => {
    render(<LoadError message="Ошибка" onRetry={vi.fn()} />);

    expect(screen.getByRole('button').getAttribute('type')).toBe('button');
  });

  it('добавляет переданный className', () => {
    render(<LoadError message="Ошибка" onRetry={vi.fn()} className="py-5" />);

    expect(screen.getByRole('alert').className).toMatch(/\bpy-5\b/);
  });
});
