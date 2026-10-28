import { CustomError } from './custom.error.ts';

export abstract class CodedError extends CustomError {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);

    this.code = code;
  }

  serializeErrors() {
    return { message: this.message, code: this.code };
  }
}
