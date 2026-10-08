import { CustomError } from './custom.error.ts';

export class Forbidden extends CustomError {
  statusCode = 403;

  constructor(message = 'Forbidden') {
    super(message);

    this.message = message;
  }

  serializeErrors() {
    return { message: this.message };
  }
}
