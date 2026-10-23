import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSwapFocus } from './use-swap-focus';

const SwapButtons = ({ isSwapped }: { isSwapped: boolean }) => {
  const { primaryRef, secondaryRef, requestFocusSwap } = useSwapFocus(isSwapped);

  return (
    <>
      <button type="button">outside</button>
      <button type="button" onClick={requestFocusSwap}>
        request
      </button>
      {isSwapped ? (
        <button ref={secondaryRef} type="button">
          secondary
        </button>
      ) : (
        <button ref={primaryRef} type="button">
          primary
        </button>
      )}
    </>
  );
};

const requestFocusSwap = () => fireEvent.click(screen.getByRole('button', { name: 'request' }));

const focusOutside = () => act(() => screen.getByRole('button', { name: 'outside' }).focus());

const getFocusedName = () => document.activeElement?.textContent;

describe('useSwapFocus', () => {
  it('после запроса переводит фокус на вторую кнопку, когда она появилась', () => {
    const { rerender } = render(<SwapButtons isSwapped={false} />);
    focusOutside();

    requestFocusSwap();
    rerender(<SwapButtons isSwapped />);

    expect(getFocusedName()).toBe('secondary');
  });

  it('после запроса возвращает фокус на первую кнопку при обратной смене', () => {
    const { rerender } = render(<SwapButtons isSwapped />);
    focusOutside();

    requestFocusSwap();
    rerender(<SwapButtons isSwapped={false} />);

    expect(getFocusedName()).toBe('primary');
  });

  it('без запроса не трогает фокус при смене кнопок', () => {
    const { rerender } = render(<SwapButtons isSwapped={false} />);
    focusOutside();

    rerender(<SwapButtons isSwapped />);

    expect(getFocusedName()).toBe('outside');
  });

  it('запрос сгорает, если следующий рендер не сменил кнопки', () => {
    const { rerender } = render(<SwapButtons isSwapped={false} />);
    focusOutside();

    requestFocusSwap();
    rerender(<SwapButtons isSwapped={false} />);
    rerender(<SwapButtons isSwapped />);

    expect(getFocusedName()).toBe('outside');
  });

  it('запрос срабатывает только один раз', () => {
    const { rerender } = render(<SwapButtons isSwapped={false} />);

    requestFocusSwap();
    rerender(<SwapButtons isSwapped />);
    focusOutside();
    rerender(<SwapButtons isSwapped={false} />);

    expect(getFocusedName()).toBe('outside');
  });
});
