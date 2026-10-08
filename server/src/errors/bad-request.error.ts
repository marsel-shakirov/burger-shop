import { CustomError } from './custom.error.ts';
export class BadRequest extends CustomError {
  statusCode = 400;
  code?: string;

  constructor(message = 'Bad request', code?: string) {
    super(message);

    this.message = message;
    this.code = code;
  }

  serializeErrors() {
    return { message: this.message, code: this.code };
  }
}
