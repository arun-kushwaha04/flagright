import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DBConfigService } from 'src/config/database/db.service';
import { RootConfigService } from 'src/config/root/root.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaService, DBConfigService, RootConfigService],
  exports: [PrismaService],
})
export class PrismaModule {}
