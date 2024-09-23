import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RootConfigModule } from './config/root/root.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BankModule } from './bank/bank.module';
import { TransactionModule } from './transactions/transaction.module';
import { TransactionQueueModule } from './bullmq/transaction/transaction.module';
import { DatabaseConfigModule } from './config/database/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    AuthModule,
    BankModule,
    PrismaModule,
    TransactionModule,
    TransactionQueueModule,
    DatabaseConfigModule,
    RootConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
