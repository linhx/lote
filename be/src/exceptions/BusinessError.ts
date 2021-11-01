import BaseError from './BaseError';

export default class BusinessError extends BaseError {
  constructor(message?: string) {
    super(message);
  }
}
