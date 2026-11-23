export const normalizeLocalPhone = (value: string): string | null => {
  const phone = value.replace(/[\s()-]/g, '');

  if (/^\+7\d{10}$/.test(phone)) return phone;
  if (/^[78]\d{10}$/.test(phone)) return `+7${phone.slice(1)}`;
  if (/^\d{10}$/.test(phone)) return `+7${phone}`;

  return null;
};
