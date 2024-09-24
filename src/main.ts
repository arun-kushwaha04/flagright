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
  process.on('uncaughtException', () => {});

  // Catch unhandled promise rejections
  process.on('unhandledRejection', () => {});

  await app.listen(port);
}
bootstrap();
