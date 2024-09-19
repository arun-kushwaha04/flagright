import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RootConfigModule } from '../root/root.module';
import dbConfig from './db.config';
import { DBConfigService } from './db.service';

@Module({
  imports: [ConfigModule, ConfigModule.forFeature(dbConfig), RootConfigModule],
  providers: [DBConfigService],
  exports: [DBConfigService],
})
export class DatabaseConfigModule {}
