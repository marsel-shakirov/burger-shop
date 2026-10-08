import { notifyUnauthorized } from './unauthorized';

export const authFetch = async (input: string, init: RequestInit = {}) => {
  const response = await fetch(input, init);

  if (response.status === 401) {
    notifyUnauthorized();
  }

  return response;
};
