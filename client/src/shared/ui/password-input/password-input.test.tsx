import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PasswordInput } from './password-input';

const getInput = () => screen.getByPlaceholderText('пароль');

describe('PasswordInput', () => {
  it('по умолчанию скрывает пароль', () => {
    render(<PasswordInput placeholder="пароль" />);

    expect(getInput().getAttribute('type')).toBe('password');
    expect(screen.getByRole('button', { name: /^Показать/ })).toBeDefined();
  });

  it('показывает и снова скрывает пароль', () => {
    render(<PasswordInput placeholder="пароль" />);

    fireEvent.click(screen.getByRole('button', { name: /^Показать/ }));
    expect(getInput().getAttribute('type')).toBe('text');

    fireEvent.click(screen.getByRole('button', { name: /^Скрыть/ }));
    expect(getInput().getAttribute('type')).toBe('password');
  });

  it('кнопка не отправляет форму', () => {
    render(<PasswordInput placeholder="пароль" />);

    expect(screen.getByRole('button').getAttribute('type')).toBe('button');
  });

  it('передаёт атрибуты в поле и сохраняет введённое значение при переключении', () => {
    render(<PasswordInput placeholder="пароль" name="password" autoComplete="new-password" />);
    fireEvent.change(getInput(), { target: { value: 'secret' } });

    fireEvent.click(screen.getByRole('button', { name: /^Показать/ }));

    expect(getInput()).toMatchObject({ name: 'password', value: 'secret' });
    expect(getInput().getAttribute('autocomplete')).toBe('new-password');
  });
});
