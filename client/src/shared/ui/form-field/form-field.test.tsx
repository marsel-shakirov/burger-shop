import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormField } from './form-field';

describe('FormField', () => {
  it('связывает подпись с полем', () => {
    render(<FormField label="Email">{(props) => <input {...props} />}</FormField>);

    expect(screen.getByLabelText('Email').tagName).toBe('INPUT');
  });

  it('без ошибки не помечает поле невалидным', () => {
    render(
      <FormField label="Email" errorId="error">
        {(props) => <input {...props} />}
      </FormField>,
    );

    const input = screen.getByLabelText('Email');

    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.hasAttribute('aria-describedby')).toBe(false);
  });

  it('с ошибкой помечает поле и связывает его с текстом ошибки', () => {
    render(
      <>
        <FormField label="Email" invalid errorId="error">
          {(props) => <input {...props} />}
        </FormField>
        <p id="error">Неверный email</p>
      </>,
    );

    const input = screen.getByLabelText('Email');

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('textbox', { description: 'Неверный email' })).toBe(input);
  });

  it('связывает поле с подсказкой и ошибкой одновременно', () => {
    render(
      <FormField label="Пароль" invalid errorId="error" hintId="hint">
        {(props) => <input {...props} />}
      </FormField>,
    );

    expect(screen.getByLabelText('Пароль').getAttribute('aria-describedby')).toBe('hint error');
  });
});
