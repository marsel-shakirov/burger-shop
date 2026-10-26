import type { Supabase } from '../../supabase.ts';
import type { EmailCallbackQuery } from './auth.schema.ts';
import type { EmailChangeStatus } from './auth.types.ts';
import { exchangeCodeUseCase } from './exchange-code.use-case.ts';

export async function confirmEmailChangeUseCase(
  supabase: Supabase,
  { code, message }: EmailCallbackQuery,
): Promise<EmailChangeStatus> {
  if (code) {
    return (await exchangeCodeUseCase(supabase, code)) ? 'changed' : 'failed';
  }

  return message ? 'confirm_other' : 'failed';
}
