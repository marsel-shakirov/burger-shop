import { CustomError } from './custom.error.ts';

export class Unauthorized extends CustomError {
  statusCode = 401;

  constructor(message = 'Unauthorized') {
    super(message);

    this.message = message;
  }

  serializeErrors() {
    return { message: this.message };
  }
}
