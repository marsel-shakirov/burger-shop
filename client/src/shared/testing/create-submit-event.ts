import type { SubmitEvent } from 'react';
import { vi } from 'vitest';

export const createSubmitEvent = (fields: Record<string, string>) => {
  const form = document.createElement('form');

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.append(input);
  }

  const preventDefault = vi.fn();
  const event = { currentTarget: form, preventDefault } as unknown as SubmitEvent<HTMLFormElement>;

  return { event, preventDefault };
};
