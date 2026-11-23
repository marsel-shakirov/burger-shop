const orderIdPattern =
  /^[\da-f]{8}-[\da-f]{4}-[1-8][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$|^00000000-0000-0000-0000-000000000000$|^ffffffff-ffff-ffff-ffff-ffffffffffff$/i;

export const isOrderId = (value: string | undefined): value is string =>
  value?.length === 36 && orderIdPattern.test(value);
