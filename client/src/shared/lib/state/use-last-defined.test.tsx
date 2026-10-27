import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useLastDefined } from './use-last-defined';

const render = (value: string | undefined) =>
  renderHook(({ value }) => useLastDefined(value), { initialProps: { value } });

describe('useLastDefined', () => {
  it('возвращает undefined, пока значение ни разу не было определено', () => {
    const { result, rerender } = render(undefined);

    rerender({ value: undefined });

    expect(result.current).toBeUndefined();
  });

  it('возвращает текущее значение, если оно определено', () => {
    const { result } = render('burgers');

    expect(result.current).toBe('burgers');
  });

  it('сохраняет последнее определённое значение, когда приходит undefined', () => {
    const { result, rerender } = render('burgers');

    rerender({ value: undefined });

    expect(result.current).toBe('burgers');
  });

  it('переключается на новое определённое значение', () => {
    const { result, rerender } = render('burgers');

    rerender({ value: undefined });
    rerender({ value: 'drinks' });
    rerender({ value: undefined });

    expect(result.current).toBe('drinks');
  });

  it('запоминает значение, которое появилось после undefined', () => {
    const { result, rerender } = render(undefined);

    rerender({ value: 'burgers' });
    rerender({ value: undefined });

    expect(result.current).toBe('burgers');
  });

  it('считает пустую строку определённым значением', () => {
    const { result, rerender } = render('burgers');

    rerender({ value: '' });
    rerender({ value: undefined });

    expect(result.current).toBe('');
  });
});
