import { CustomError } from './custom.error.ts';
export class BadRequest extends CustomError {
  statusCode = 400;

  constructor(message = 'Bad request') {
    super(message);

    this.message = message;
  }

  serializeErrors() {
    return { message: this.message };
  }
}
