import { CustomError } from './custom.error.ts';

export class Conflict extends CustomError {
  statusCode = 409;
  code?: string;

  constructor(message = 'Conflict', code?: string) {
    super(message);

    this.message = message;
    this.code = code;
  }

  serializeErrors() {
    return { message: this.message, code: this.code };
  }
}
