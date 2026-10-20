import { type ReactNode, useId } from 'react';

import { getFieldErrorProps } from './get-field-error-props';

type FormFieldControlProps = { id: string } & ReturnType<typeof getFieldErrorProps>;

interface FormFieldProps {
  label: ReactNode;
  invalid?: boolean;
  errorId?: string;
  hintId?: string;
  children: (controlProps: FormFieldControlProps) => ReactNode;
}

export const FormField = ({
  label,
  invalid = false,
  errorId,
  hintId,
  children,
}: FormFieldProps) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      {children({ id, ...getFieldErrorProps({ invalid, errorId, hintId }) })}
    </div>
  );
};
