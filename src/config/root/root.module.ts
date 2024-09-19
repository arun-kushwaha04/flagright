import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rootConfig from './root.config';
import { RootConfigService } from './root.service';

@Module({
  imports: [ConfigModule.forFeature(rootConfig)],
  providers: [RootConfigService],
  exports: [RootConfigService],
})
export class RootConfigModule {}
