import BaseError from './base.error';

export default class BusinessError extends BaseError {
  constructor(message?: string) {
    super(message);
  }
}
