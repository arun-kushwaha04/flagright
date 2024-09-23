import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('Caught error');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const isCustomError = exception instanceof HttpException;

      const status = isCustomError
        ? (exception as HttpException).getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

      const message = isCustomError
        ? (exception as HttpException).getResponse()
        : 'Internal server error';

      response.status(status).json({
        success: false,
        message,
        payload: null,
      });
    } else {
      console.log(exception);
    }
  }
}
