import type { ReactNode } from 'react';

interface FormAlertProps {
  id: string;
  children: ReactNode;
}

export const FormAlert = ({ id, children }: FormAlertProps) => {
  return (
    <p id={id} role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
};
