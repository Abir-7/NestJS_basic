import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message =
          (exceptionResponse as { message?: string | string[] }).message ??
          message;
      }
    }

    if (exception instanceof QueryFailedError) {
      const error = exception as QueryFailedError & {
        driverError?: {
          code?: string;
        };
      };

      switch (error.driverError?.code) {
        case '23505':
          status = HttpStatus.CONFLICT;
          message = 'Duplicate entry';
          break;

        case '23503':
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid relation reference';
          break;

        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Database error';
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
