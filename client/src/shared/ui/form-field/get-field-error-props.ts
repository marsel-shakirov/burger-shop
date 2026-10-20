interface FieldErrorOptions {
  invalid: boolean;
  errorId?: string;
  hintId?: string;
}

export const getFieldErrorProps = ({ invalid, errorId, hintId }: FieldErrorOptions) => {
  const describedBy = [hintId, invalid ? errorId : undefined].filter(Boolean).join(' ');

  return {
    'aria-invalid': invalid || undefined,
    'aria-describedby': describedBy || undefined,
  };
};
