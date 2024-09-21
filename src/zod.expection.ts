import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 400;
    response.status(status).json({
      success: false,
      payload: exception.errors,
      message: 'Invalid request body',
      statusCode: status,
    });
  }
}

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: any) {}

  transform(value: any) {
    this.schema.parse(value);
    return value;
  }
}
