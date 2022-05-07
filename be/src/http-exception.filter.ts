import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import BaseError from './exceptions/BaseError';

@Catch(BaseError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
