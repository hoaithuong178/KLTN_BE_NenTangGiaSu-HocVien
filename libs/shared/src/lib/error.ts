export interface ErrorDetail {
  field: string;
  message: string;
}

export class ExistedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExistedError';
  }
}
