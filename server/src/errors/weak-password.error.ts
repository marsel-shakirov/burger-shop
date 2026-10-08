import { CustomError } from './custom.error.ts';

export type WeakPasswordReason = 'length' | 'characters' | 'pwned';

export class WeakPassword extends CustomError {
  statusCode = 400;
  code = 'weak_password';
  reasons: WeakPasswordReason[];

  constructor(reasons: WeakPasswordReason[], message = 'Weak password') {
    super(message);

    this.message = message;
    this.reasons = reasons;
  }

  serializeErrors() {
    return { message: this.message, code: this.code, reasons: this.reasons };
  }
}
