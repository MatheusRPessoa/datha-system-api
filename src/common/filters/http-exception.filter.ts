import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let details: string[] | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else {
      const body = exceptionResponse as {
        message?: string | string[];
        error?: string;
      };
      if (Array.isArray(body.message)) {
        details = body.message;
        message = body.message.join('; ');
      } else {
        message = body.message ?? exception.message;
      }
    }

    response.status(status).json({
      succeeded: false,
      data: null,
      message,
      error: {
        statusCode: status,
        error: HttpStatus[status] ?? 'Error',
        ...(details ? { details } : {}),
      },
    });
  }
}
