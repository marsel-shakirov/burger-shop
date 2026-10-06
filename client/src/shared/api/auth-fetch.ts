import { supabase } from './supabase';

export const authFetch = async (input: string, init: RequestInit = {}) => {
  const { data } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);

  if (data.session) {
    headers.set('Authorization', `Bearer ${data.session.access_token}`);
  }

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    await supabase.auth.signOut({ scope: 'local' });
  }

  return response;
};
