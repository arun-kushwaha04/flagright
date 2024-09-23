import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { RootConfigService } from './config/root/root.service';
import { CustomExceptionFilter } from './exception.filter';
import { ZodFilter } from './zod.expection';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rootConfigService = app.get(RootConfigService);
  const port = rootConfigService.port;
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalFilters(new ZodFilter());
  app.use(cookieParser());

  // Catch uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error.message);
    console.error(error.stack);
  });

  // Catch unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('Unhandled Rejection:', promise);
    console.error('Reason:', reason);
  });
  await app.listen(port);
}
bootstrap();
