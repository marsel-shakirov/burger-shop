import { type AuthError, isAuthWeakPasswordError } from '@supabase/supabase-js';

import { CustomError } from './custom.error.ts';

export class SupabaseAuthError extends CustomError {
  statusCode: number;
  code?: string;
  reasons?: string[];

  constructor(error: AuthError) {
    super(error.message);

    this.message = error.message;
    this.statusCode = error.status && error.status >= 400 ? error.status : 502;
    this.code = error.code;

    if (isAuthWeakPasswordError(error)) {
      this.reasons = error.reasons;
    }
  }

  serializeErrors() {
    return { message: this.message, code: this.code, reasons: this.reasons };
  }
}
