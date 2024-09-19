import { Global, Module } from '@nestjs/common';
import { DatabaseConfigModule } from 'src/config/database/db.module';
import { RootConfigModule } from 'src/config/root/root.module';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [RootConfigModule, DatabaseConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
