import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RootConfigService } from './config/root/root.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rootConfigService = app.get(RootConfigService);
  const port = rootConfigService.port;
  await app.listen(port);
}
bootstrap();
