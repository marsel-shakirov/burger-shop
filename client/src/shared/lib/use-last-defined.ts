import { useState } from 'react';

export const useLastDefined = <T>(value: T | undefined) => {
  const [lastDefinedValue, setLastDefinedValue] = useState(value);
  if (value !== undefined && value !== lastDefinedValue) setLastDefinedValue(value);

  return value ?? lastDefinedValue;
};
