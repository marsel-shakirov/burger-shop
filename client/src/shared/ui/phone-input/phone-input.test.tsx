import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { PhoneInput } from './phone-input';

const PhoneForm = () => {
  const [value, setValue] = useState('');

  return (
    <>
      <PhoneInput aria-label="Телефон" value={value} onValueChange={setValue} />
      <output data-testid="phone-value">{value}</output>
    </>
  );
};

const getPhone = () => screen.getByRole<HTMLInputElement>('textbox', { name: 'Телефон' });

describe('PhoneInput', () => {
  it.each(['9001234567', '8 900 123-45-67', '7 900 123-45-67'])('форматирует ввод %s', (value) => {
    render(<PhoneForm />);
    const phone = getPhone();

    fireEvent.input(phone, { target: { value } });

    expect(phone.value).toBe('+7 (900) 123-45-67');
    expect(screen.getByTestId('phone-value').textContent).toBe('+79001234567');
  });

  it('отклоняет вставку номера с другим кодом и убирает ошибку при вводе', () => {
    render(<PhoneForm />);
    const phone = getPhone();

    const allowed = fireEvent.paste(phone, { clipboardData: { getData: () => '+44 7911 123456' } });

    expect(allowed).toBe(false);
    expect(phone.value).toBe('');
    expect(phone.getAttribute('aria-describedby')).toBe(screen.getByRole('alert').id);
    fireEvent.input(phone, { target: { value: '900' } });

    expect(phone.value).toBe('+7 (900');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('разрешает вставку местного номера и очистку поля', () => {
    render(<PhoneForm />);
    const phone = getPhone();
    const value = '8 900 123-45-67';

    expect(fireEvent.paste(phone, { clipboardData: { getData: () => value } })).toBe(true);
    fireEvent.input(phone, { target: { value } });
    expect(phone.value).toBe('+7 (900) 123-45-67');
    phone.setSelectionRange(0, phone.value.length);
    fireEvent.keyDown(phone, { key: 'Backspace' });
    fireEvent.input(phone, { target: { value: '' } });

    expect(phone.value).toBe('');
    expect(screen.getByTestId('phone-value').textContent).toBe('');
  });
});
