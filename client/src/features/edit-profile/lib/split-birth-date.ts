const stripLeadingZeros = (value: string) => value && String(Number(value));

export const splitBirthDate = (birthDate: string | null) => {
  const [year = '', month = '', day = ''] = birthDate?.split('-') ?? [];

  return {
    day: stripLeadingZeros(day),
    month: stripLeadingZeros(month),
    year,
  };
};
