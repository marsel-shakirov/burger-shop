import { type ComponentPropsWithoutRef, useId, useState } from 'react';
import { IMaskInput } from 'react-imask';

import { cn, normalizeLocalPhone } from '@/shared/lib';

import { textInputClass } from '../text-input';

interface PhoneInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'defaultValue' | 'onChange' | 'onPaste' | 'type' | 'value'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const preparePhone = (text: string) => {
  const compact = text.replace(/[\s()-]/g, '');
  if (compact.startsWith('+') && !compact.startsWith('+7') && compact !== '+') return '';

  return normalizeLocalPhone(text) ?? text;
};

export const PhoneInput = ({
  className,
  onValueChange,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: PhoneInputProps) => {
  const pasteErrorId = useId();
  const [invalidPaste, setInvalidPaste] = useState(false);

  return (
    <>
      <IMaskInput
        {...props}
        aria-describedby={
          invalidPaste ? [describedBy, pasteErrorId].filter(Boolean).join(' ') : describedBy
        }
        aria-invalid={invalidPaste ? true : invalid}
        className={cn(textInputClass, className)}
        type="text"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7 (___) ___-__-__"
        mask="{+7} (000) 000-00-00"
        prepare={preparePhone}
        unmask={true}
        overwrite
        onAccept={(value) => {
          if (value !== props.value) onValueChange?.(value);
        }}
        onInput={() => setInvalidPaste(false)}
        onPaste={(event) => {
          const text = event.clipboardData.getData('text');
          const compact = text.replace(/[\s()-]/g, '');
          if (normalizeLocalPhone(text) || /^\d{1,9}$/.test(compact)) {
            setInvalidPaste(false);
            return;
          }

          event.preventDefault();
          setInvalidPaste(true);
        }}
      />
      {invalidPaste && (
        <p id={pasteErrorId} role="alert" className="text-sm text-red-700">
          Вставьте номер в формате +7 (900) 123-45-67
        </p>
      )}
    </>
  );
};
